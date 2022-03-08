import { SlackProject } from "./project.ts";
import {
  IWorkflowDefinition,
  ManifestWorkflowSchema,
  ManifestWorkflowStepSchema,
  ProjectFunction,
} from "./types.ts";
import { ISlackFunction, WorkflowDefinitionArgs } from "./functions/types.ts";
import {
  ParameterSetDefinition,
  ParameterVariable,
  ParameterVariableType,
  RequiredParameters,
} from "./parameters/mod.ts";

const localFnPrefix = "#/functions/";

type WorkflowInputOutputDefinition<
  Parameters extends ParameterSetDefinition,
> = {
  [name in keyof Parameters]: ParameterVariableType<
    Parameters[name]
  >;
};

export type WorkflowStepInputs<
  InputParameters extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<InputParameters>,
> =
  & {
    // deno-lint-ignore no-explicit-any
    [k in RequiredInputs[number]]: any;
  }
  & {
    // deno-lint-ignore no-explicit-any
    [k in keyof InputParameters]?: any;
  };

export const DefineWorkflow = <
  WorkflowInputParameters extends ParameterSetDefinition,
  WorkflowOutputParameters extends ParameterSetDefinition,
>(
  id: string,
  definition: WorkflowDefinitionArgs<
    WorkflowInputParameters,
    WorkflowOutputParameters
  >,
) => {
  return new WorkflowDefinition(id, definition);
};

export class WorkflowDefinition<
  // TODO: WorkflowDefinition doesn't really care about required parameters
  // since this only matters in runtime, we can simplify this and only pass the ParameterSet
  // parameter.
  WorkflowInputParameters extends ParameterSetDefinition,
  WorkflowOutputParameters extends ParameterSetDefinition,
> implements IWorkflowDefinition {
  public id: string;
  private definition: WorkflowDefinitionArgs<
    WorkflowInputParameters,
    WorkflowOutputParameters
  >;

  public inputs: WorkflowInputOutputDefinition<
    WorkflowInputParameters
  >;

  /* this one is a bit tricky, we collect here the workflow steps,
     these parameters are for the input / output parameters of the function that runs in that step
     and it's inputs will be of whatever shape, so this can't be typed using the WorkflowDefinition
     type parameters. The ParameterPropertiesDefinition<T> takes a Parameter set as T and uses that
     to define the "Required" type. So if we type the below to
     ParameterPropertiesDefinition<ParameterSetDefinition> it doesn't work, because the required sets
     of the function could be of a different shape. I couldn't find any way to make this work,
     other than let that one be `any` type.
  */
  steps: WorkflowStepDefinition<
    // deno-lint-ignore no-explicit-any
    any,
    // deno-lint-ignore no-explicit-any
    any,
    // deno-lint-ignore no-explicit-any
    any,
    // deno-lint-ignore no-explicit-any
    any
  >[] = [];

  constructor(
    id: string,
    definition: WorkflowDefinitionArgs<
      WorkflowInputParameters,
      WorkflowOutputParameters
    >,
  ) {
    this.id = id;
    this.definition = definition;
    this.inputs = {} as WorkflowInputOutputDefinition<
      WorkflowInputParameters
    >;

    for (
      const [inputName, inputDefinition] of Object.entries(
        definition.input_parameters?.properties
          ? definition.input_parameters.properties
          : {},
      )
    ) {
      this.inputs[
        inputName as keyof WorkflowInputParameters
      ] = ParameterVariable(
        "inputs",
        inputName,
        inputDefinition,
      ) as ParameterVariableType<
        WorkflowInputParameters[typeof inputName]
      >;
    }
  }

  addStep<
    StepInputParameters extends ParameterSetDefinition,
    StepOutputParameters extends ParameterSetDefinition,
    RequiredStepInput extends RequiredParameters<StepInputParameters>,
    RequiredStepOutput extends RequiredParameters<StepOutputParameters>,
  >(
    slackFunction: ISlackFunction<
      StepInputParameters,
      StepOutputParameters,
      RequiredStepInput,
      RequiredStepOutput
    >,
    inputs: WorkflowStepInputs<StepInputParameters, RequiredStepInput>,
  ): WorkflowStepDefinition<
    StepInputParameters,
    StepOutputParameters,
    RequiredStepInput,
    RequiredStepOutput
  > {
    // TODO: should we required/allow this to be set manually?
    const stepId = `${this.steps.length}`;

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

  registerStepFunctions(project: SlackProject) {
    this.steps.forEach((s) => s.registerFunction(project));
  }

  registerParameterTypes(project: SlackProject) {
    const { input_parameters: inputParams, output_parameters: outputParams } =
      this.definition;
    project.registerTypes(inputParams?.properties ?? {});
    project.registerTypes(outputParams?.properties ?? {});
  }

  toJSON() {
    return this.export();
  }
}

class WorkflowStepDefinition<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInputs extends RequiredParameters<InputParameters>,
  RequiredOutputs extends RequiredParameters<OutputParameters>,
> {
  private stepId: string;

  public definition: ISlackFunction<
    InputParameters,
    OutputParameters,
    RequiredInputs,
    RequiredOutputs
  >;

  private inputs: WorkflowStepInputs<InputParameters, RequiredInputs>;

  public outputs: WorkflowInputOutputDefinition<
    OutputParameters
  >;
  private fnRef: string;
  constructor(
    stepId: string,
    slackFunction: ISlackFunction<
      InputParameters,
      OutputParameters,
      RequiredInputs,
      RequiredOutputs
    >,
    inputs: WorkflowStepInputs<InputParameters, RequiredInputs>,
  ) {
    this.stepId = stepId;
    this.definition = slackFunction;
    this.inputs = inputs;
    this.outputs = {} as WorkflowInputOutputDefinition<
      OutputParameters
    >;
    const fnId = this.definition.id;
    // TODO: This is hacky, will revamp this later to allow fns to handle namespaces
    this.fnRef = /^slack#/.test(fnId) ? fnId : localFnPrefix + fnId;

    // Setup step outputs for use in input template expressions
    for (
      const [outputName, outputDefinition] of Object.entries(
        slackFunction?.definition?.output_parameters?.properties ?? {},
      )
    ) {
      this.outputs[
        outputName as keyof OutputParameters
      ] = ParameterVariable(
        `steps.${this.stepId}`,
        outputName,
        outputDefinition,
      ) as ParameterVariableType<
        OutputParameters[typeof outputName]
      >;
    }
  }

  templatizeInputs() {
    const templatizedInputs: ManifestWorkflowStepSchema["inputs"] =
      {} as ManifestWorkflowStepSchema["inputs"];

    for (const [inputName, inputValue] of Object.entries(this.inputs)) {
      templatizedInputs[inputName] = JSON.parse(JSON.stringify(inputValue));
    }

    return templatizedInputs;
  }

  export(): ManifestWorkflowStepSchema {
    return {
      id: this.stepId,
      function_id: this.fnRef,
      inputs: this.templatizeInputs(),
    };
  }

  toJSON() {
    return this.export();
  }

  registerFunction(project: SlackProject) {
    if (this.isLocalFunctionReference()) {
      project.registerFunction(this.definition as ProjectFunction);
    }
  }

  private isLocalFunctionReference(): boolean {
    return this.fnRef.startsWith(localFnPrefix);
  }
}
