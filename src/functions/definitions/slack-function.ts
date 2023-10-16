import {
  ManifestFunctionSchema,
  ManifestFunctionType,
} from "../../manifest/manifest_schema.ts";
import { SlackManifest } from "../../mod.ts";
import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/types.ts";
import {
  ISlackFunctionDefinition,
  SlackFunctionDefinitionArgs,
} from "../types.ts";

/**
 * Define a function and its input and output parameters for use in a Slack application.
 * @param {SlackFunctionDefinitionArgs<InputParameters, OutputParameters, RequiredInput, RequiredOutput>} definition Defines information about your function (title, description) as well as formalizes the input and output parameters of your function
 * @returns {SlackFunctionDefinition}
 */
export const DefineFunction = <
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
>(
  definition: SlackFunctionDefinitionArgs<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  >,
) => {
  return new SlackFunctionDefinition(definition);
};

export class SlackFunctionDefinition<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
> implements
  ISlackFunctionDefinition<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  > {
  type: ManifestFunctionType = "app";
  id: string;

  constructor(
    public definition: SlackFunctionDefinitionArgs<
      InputParameters,
      OutputParameters,
      RequiredInput,
      RequiredOutput
    >,
  ) {
    this.id = definition.callback_id;
    this.definition = definition;
  }

  registerParameterTypes(manifest: SlackManifest) {
    const { input_parameters: inputParams, output_parameters: outputParams } =
      this.definition;
    manifest.registerTypes(inputParams?.properties ?? {});
    manifest.registerTypes(outputParams?.properties ?? {});
  }

  export(): ManifestFunctionSchema {
    return {
      title: this.definition.title,
      description: this.definition.description,
      source_file: this.definition.source_file,
      input_parameters: this.definition.input_parameters ??
        { properties: {}, required: [] },
      output_parameters: this.definition.output_parameters ??
        { properties: {}, required: [] },
      is_widget: this.definition.is_widget,
      widget_configuration: this.definition.widget_configuration,
    };
  }
}

export function isCustomFunctionDefinition<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutputs extends PossibleParameterKeys<OutputParameters>,
>(
  functionDefinition: ISlackFunctionDefinition<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutputs
  >,
): functionDefinition is SlackFunctionDefinition<
  InputParameters,
  OutputParameters,
  RequiredInput,
  RequiredOutputs
> {
  if (
    functionDefinition.type === "app" &&
    functionDefinition.export &&
    functionDefinition.registerParameterTypes
  ) {
    return true;
  }
  return false;
}
