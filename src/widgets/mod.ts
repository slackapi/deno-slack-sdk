import { SlackManifest } from "../manifest/mod.ts";
import { ManifestWidgetSchema } from "../manifest/manifest_schema.ts";
import { ISlackFunctionDefinition } from "../functions/types.ts";
import {
  ParameterSetDefinition,
  ParameterVariableType,
  PossibleParameterKeys,
} from "../parameters/types.ts";
import { ParameterVariable } from "../parameters/mod.ts";
import {
  TypedWidgetStepDefinition,
  UntypedWidgetStepDefinition,
  WidgetStepDefinition,
} from "./widget-step.ts";
import {
  ISlackWidget,
  SlackWidgetConfig,
  SlackWidgetDefinitionArgs,
  WidgetInputs,
  WidgetOutputs,
  WidgetStepInputs,
} from "./types.ts";

export const DefineWidget = <
  Inputs extends ParameterSetDefinition,
  Outputs extends ParameterSetDefinition,
  RequiredInputs extends PossibleParameterKeys<Inputs>,
  RequiredOutputs extends PossibleParameterKeys<Outputs>,
  CallbackID extends string,
  Config extends SlackWidgetConfig,
>(
  definition: SlackWidgetDefinitionArgs<
    Inputs,
    Outputs,
    RequiredInputs,
    RequiredOutputs,
    CallbackID,
    Config
  >,
) => {
  return new WidgetDefinition(definition);
};

export class WidgetDefinition<
  Inputs extends ParameterSetDefinition,
  Outputs extends ParameterSetDefinition,
  RequiredInputs extends PossibleParameterKeys<Inputs>,
  RequiredOutputs extends PossibleParameterKeys<Outputs>,
  CallbackID extends string,
  Config extends SlackWidgetConfig,
> implements ISlackWidget {
  public id: string;
  public definition: SlackWidgetDefinitionArgs<
    Inputs,
    Outputs,
    RequiredInputs,
    RequiredOutputs,
    CallbackID,
    Config
  >;

  public inputs: WidgetInputs<
    Inputs,
    RequiredInputs
  >;

  public outputs: WidgetOutputs<
    Outputs,
    RequiredOutputs
  >;

  steps: WidgetStepDefinition[] = [];

  constructor(
    definition: SlackWidgetDefinitionArgs<
      Inputs,
      Outputs,
      RequiredInputs,
      RequiredOutputs,
      CallbackID,
      Config
    >,
  ) {
    this.id = definition.callback_id;
    this.definition = definition;
    this.inputs = {} as WidgetInputs<
      Inputs,
      RequiredInputs
    >;
    this.outputs = {} as WidgetOutputs<
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
    inputs: WidgetStepInputs<StepInputs, RequiredStepInputs>,
  ): TypedWidgetStepDefinition<
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
    inputs: WidgetStepInputs<
      ParameterSetDefinition,
      PossibleParameterKeys<ParameterSetDefinition>
    >,
  ): UntypedWidgetStepDefinition;

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
    inputs: WidgetStepInputs<StepInputs, RequiredStepInputs>,
  ): WidgetStepDefinition {
    const stepId = `${this.steps.length}`;

    if (typeof functionOrReference === "string") {
      const newStep = new UntypedWidgetStepDefinition(
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
    const newStep = new TypedWidgetStepDefinition(
      stepId,
      slackFunction,
      inputs,
    );

    this.steps.push(newStep);

    return newStep;
  }

  export(): ManifestWidgetSchema {
    return {
      title: this.definition.title,
      description: this.definition.description,
      config: this.definition.config,
      input_parameters: this.definition.input_parameters,
      output_parameters: this.definition.output_parameters,
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
