import {
  ParameterSetDefinition,
  ParameterVariableType,
  PossibleParameterKeys,
} from "../parameters/types.ts";
import { ParameterVariable } from "../parameters/mod.ts";
import { SlackManifest } from "../manifest/mod.ts";
import type { ManifestWidgetSchema } from "../manifest/manifest_schema.ts";
import {
  ISlackWidget,
  SlackWidgetDefinitionArgs,
  WidgetInputs,
  WidgetOutputs,
} from "./types.ts";

export const DefineWidget = <
  Inputs extends ParameterSetDefinition,
  Outputs extends ParameterSetDefinition,
  RequiredInputs extends PossibleParameterKeys<Inputs>,
  RequiredOutputs extends PossibleParameterKeys<Outputs>,
  CallbackID extends string,
>(
  definition: SlackWidgetDefinitionArgs<
    Inputs,
    Outputs,
    RequiredInputs,
    RequiredOutputs,
    CallbackID
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
> implements ISlackWidget {
  public id: string;
  public definition: SlackWidgetDefinitionArgs<
    Inputs,
    Outputs,
    RequiredInputs,
    RequiredOutputs,
    CallbackID
  >;

  public inputs: WidgetInputs<
    Inputs,
    RequiredInputs
  >;

  public outputs: WidgetOutputs<
    Outputs,
    RequiredOutputs
  >;

  constructor(
    definition: SlackWidgetDefinitionArgs<
      Inputs,
      Outputs,
      RequiredInputs,
      RequiredOutputs,
      CallbackID
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

  export(): ManifestWidgetSchema {
    return {
      title: this.definition.title,
      description: this.definition.description,
      source_file: this.definition.source_file,
      function_id: this.definition.function_id,
      input_parameters: this.definition.input_parameters,
      output_parameters: this.definition.output_parameters,
    };
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
