import { SlackManifest } from "../manifest.ts";
import { ManifestWorkflowSchema } from "../types.ts";
import { ISlackFunction } from "../functions/types.ts";
import {
  ParameterSetDefinition,
  ParameterVariable,
  ParameterVariableType,
  RequiredParameters,
} from "../parameters/mod.ts";
import {
  BaseWorkflowStepDefinition,
  UntypedWorkflowStepDefinition,
  WorkflowStepDefinition,
} from "./workflow-step.ts";
import {
  ISlackWorkflow,
  SlackWorkflowDefinitionArgs,
  WorkflowInputsOutputsDefinition,
  WorkflowStepInputs,
} from "./types.ts";

export const DefineWorkflow = <
  Inputs extends ParameterSetDefinition,
  Outputs extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<Inputs>,
  RequiredOutputs extends RequiredParameters<Outputs>,
>(
  definition: SlackWorkflowDefinitionArgs<
    Inputs,
    Outputs,
    RequiredInputs,
    RequiredOutputs
  >,
) => {
  return new WorkflowDefinition(definition);
};

export class WorkflowDefinition<
  Inputs extends ParameterSetDefinition,
  Outputs extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<Inputs>,
  RequiredOutputs extends RequiredParameters<Outputs>,
> implements ISlackWorkflow {
  public id: string;
  private definition: SlackWorkflowDefinitionArgs<
    Inputs,
    Outputs,
    RequiredInputs,
    RequiredOutputs
  >;

  public inputs: WorkflowInputsOutputsDefinition<
    Inputs
  >;

  steps: BaseWorkflowStepDefinition[] = [];
  /* this one is a bit tricky, we collect here the workflow steps,
     these parameters are for the input / output parameters of the function that runs in that step
     and it's inputs will be of whatever shape, so this can't be typed using the WorkflowDefinition
     type parameters. The ParameterPropertiesDefinition<T> takes a Parameter set as T and uses that
     to define the "Required" type. So if we type the below to
     ParameterPropertiesDefinition<ParameterSetDefinition> it doesn't work, because the required sets
     of the function could be of a different shape. I couldn't find any way to make this work,
     other than let that one be `any` type.
  */
  // steps: WorkflowStepDefinition<
  //   // deno-lint-ignore no-explicit-any
  //   any,
  //   // deno-lint-ignore no-explicit-any
  //   any,
  //   // deno-lint-ignore no-explicit-any
  //   any,
  //   // deno-lint-ignore no-explicit-any
  //   any
  // >[] = [];

  constructor(
    definition: SlackWorkflowDefinitionArgs<
      Inputs,
      Outputs,
      RequiredInputs,
      RequiredOutputs
    >,
  ) {
    this.id = definition.callback_id;
    this.definition = definition;
    this.inputs = {} as WorkflowInputsOutputsDefinition<
      Inputs
    >;

    for (
      const [inputName, inputDefinition] of Object.entries(
        definition.input_parameters?.properties
          ? definition.input_parameters.properties
          : {},
      )
    ) {
      this.inputs[
        inputName as keyof Inputs
      ] = ParameterVariable(
        "inputs",
        inputName,
        inputDefinition,
      ) as ParameterVariableType<
        Inputs[typeof inputName]
      >;
    }
  }

  // Supports adding an untyped step by using a plain function reference string and input configuration
  // This won't support any typed inputs or outputs on the step, but can be useful when adding a step w/o the type definition available
  addStep(
    functionReference: string,
    // This is essentially an untyped step input configuration
    inputs: WorkflowStepInputs<
      ParameterSetDefinition,
      RequiredParameters<ParameterSetDefinition>
    >,
  ): UntypedWorkflowStepDefinition;

  // Supports adding a typed step where an ISlackFunction reference is used, which produces typed inputs and outputs
  // and the functionReference string can be rerived from that ISlackFunction reference
  addStep<
    StepInputs extends ParameterSetDefinition,
    StepOutputs extends ParameterSetDefinition,
    RequiredStepInputs extends RequiredParameters<StepInputs>,
    RequiredStepOutputs extends RequiredParameters<StepOutputs>,
  >(
    slackFunction: ISlackFunction<
      StepInputs,
      StepOutputs,
      RequiredStepInputs,
      RequiredStepOutputs
    >,
    inputs: WorkflowStepInputs<StepInputs, RequiredStepInputs>,
  ): WorkflowStepDefinition<
    StepInputs,
    StepOutputs,
    RequiredStepInputs,
    RequiredStepOutputs
  >;

  // The runtime implementation of addStep handles both signatures (straight function-reference & config, or ISlackFunction)
  addStep<
    StepInputs extends ParameterSetDefinition,
    StepOutputs extends ParameterSetDefinition,
    RequiredStepInputs extends RequiredParameters<StepInputs>,
    RequiredStepOutputs extends RequiredParameters<StepOutputs>,
  >(
    functionOrReference:
      | string
      | ISlackFunction<
        StepInputs,
        StepOutputs,
        RequiredStepInputs,
        RequiredStepOutputs
      >,
    inputs: WorkflowStepInputs<StepInputs, RequiredStepInputs>,
  ): BaseWorkflowStepDefinition {
    const stepId = `${this.steps.length}`;

    if (typeof functionOrReference === "string") {
      const newStep = new UntypedWorkflowStepDefinition(
        stepId,
        functionOrReference,
        inputs,
      );
      this.steps.push(newStep);
      return newStep;
    }

    const slackFunction = functionOrReference as ISlackFunction<
      StepInputs,
      StepOutputs,
      RequiredStepInputs,
      RequiredStepOutputs
    >;
    const newStep = new WorkflowStepDefinition(
      stepId,
      slackFunction,
      inputs,
    );

    this.steps.push(newStep);

    return newStep;
  }

  export(): ManifestWorkflowSchema {
    return {
      title: this.definition.title,
      description: this.definition.description,
      input_parameters: this.definition.input_parameters,
      steps: this.steps.map((s) => s.export()),
    };
  }

  registerStepFunctions(manifest: SlackManifest) {
    this.steps.forEach((s) => s.registerFunction(manifest));
  }

  registerParameterTypes(manifest: SlackManifest) {
    const { input_parameters: inputParams, output_parameters: outputParams } =
      this.definition;
    manifest.registerTypes(inputParams?.properties ?? {});
    manifest.registerTypes(outputParams?.properties ?? {});
  }

  toJSON() {
    return this.export();
  }
}
