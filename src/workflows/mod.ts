import type { SlackManifest } from "../manifest/mod.ts";
import type { ManifestWorkflowSchema } from "../manifest/manifest_schema.ts";
import type { ISlackFunctionDefinition } from "../functions/types.ts";
import type {
  ParameterSetDefinition,
  ParameterVariableType,
  PossibleParameterKeys,
} from "../parameters/types.ts";
import { ParameterVariable } from "../parameters/mod.ts";
import {
  TypedWorkflowStepDefinition,
  UntypedWorkflowStepDefinition,
  type WorkflowStepDefinition,
} from "./workflow-step.ts";
import type {
  ISlackWorkflow,
  SlackWorkflowDefinitionArgs,
  WorkflowInputs,
  WorkflowOutputs,
  WorkflowStepInputs,
} from "./types.ts";

export const DefineWorkflow = <
  Inputs extends ParameterSetDefinition,
  Outputs extends ParameterSetDefinition,
  RequiredInputs extends PossibleParameterKeys<Inputs>,
  RequiredOutputs extends PossibleParameterKeys<Outputs>,
  CallbackID extends string,
>(
  definition: SlackWorkflowDefinitionArgs<
    Inputs,
    Outputs,
    RequiredInputs,
    RequiredOutputs,
    CallbackID
  >,
) => {
  return new WorkflowDefinition(definition);
};

export class WorkflowDefinition<
  Inputs extends ParameterSetDefinition,
  Outputs extends ParameterSetDefinition,
  RequiredInputs extends PossibleParameterKeys<Inputs>,
  RequiredOutputs extends PossibleParameterKeys<Outputs>,
  CallbackID extends string,
> implements ISlackWorkflow {
  public id: string;
  public definition: SlackWorkflowDefinitionArgs<
    Inputs,
    Outputs,
    RequiredInputs,
    RequiredOutputs,
    CallbackID
  >;

  public inputs: WorkflowInputs<
    Inputs,
    RequiredInputs
  >;

  public outputs: WorkflowOutputs<
    Outputs,
    RequiredOutputs
  >;

  steps: WorkflowStepDefinition[] = [];

  constructor(
    definition: SlackWorkflowDefinitionArgs<
      Inputs,
      Outputs,
      RequiredInputs,
      RequiredOutputs,
      CallbackID
    >,
  ) {
    this.id = definition.callback_id;
    this.definition = definition;
    this.inputs = {} as WorkflowInputs<
      Inputs,
      RequiredInputs
    >;
    this.outputs = {} as WorkflowOutputs<
      Outputs,
      RequiredOutputs
    >;

    for (
      const [inputName, inputDefinition] of Object.entries(
        definition.input_parameters?.properties
          ? definition.input_parameters.properties
          : {},
      )
    ) {
      // deno-lint-ignore ban-ts-comment
      //@ts-ignore
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

  // Supports adding a typed step where an ISlackFunctionDefinition reference is used, which produces typed inputs and outputs
  // and the functionReference string can be rerived from that ISlackFunctionDefinition reference
  // Important that this overload is 1st, as it's the more specific match, and preffered type if it matches
  addStep<
    StepInputs extends ParameterSetDefinition,
    StepOutputs extends ParameterSetDefinition,
    RequiredStepInputs extends PossibleParameterKeys<StepInputs>,
    RequiredStepOutputs extends PossibleParameterKeys<StepOutputs>,
  >(
    slackFunction: ISlackFunctionDefinition<
      StepInputs,
      StepOutputs,
      RequiredStepInputs,
      RequiredStepOutputs
    >,
    inputs: WorkflowStepInputs<StepInputs, RequiredStepInputs>,
  ): TypedWorkflowStepDefinition<
    StepInputs,
    StepOutputs,
    RequiredStepInputs,
    RequiredStepOutputs
  >;

  // Supports adding an untyped step by using a plain function reference string and input configuration
  // This won't support any typed inputs or outputs on the step, but can be useful when adding a step w/o the type definition available
  addStep(
    functionReference: string,
    // This is essentially an untyped step input configuration
    inputs: WorkflowStepInputs<
      ParameterSetDefinition,
      PossibleParameterKeys<ParameterSetDefinition>
    >,
  ): UntypedWorkflowStepDefinition;

  // The runtime implementation of addStep handles both signatures (straight function-reference & config, or ISlackFunctionDefinition)
  addStep<
    StepInputs extends ParameterSetDefinition,
    StepOutputs extends ParameterSetDefinition,
    RequiredStepInputs extends PossibleParameterKeys<StepInputs>,
    RequiredStepOutputs extends PossibleParameterKeys<StepOutputs>,
  >(
    functionOrReference:
      | string
      | ISlackFunctionDefinition<
        StepInputs,
        StepOutputs,
        RequiredStepInputs,
        RequiredStepOutputs
      >,
    inputs: WorkflowStepInputs<StepInputs, RequiredStepInputs>,
  ): WorkflowStepDefinition {
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

    const slackFunction = functionOrReference as ISlackFunctionDefinition<
      StepInputs,
      StepOutputs,
      RequiredStepInputs,
      RequiredStepOutputs
    >;
    const newStep = new TypedWorkflowStepDefinition(
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
