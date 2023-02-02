import { ManifestFunctionSchema } from "../manifest/manifest_schema.ts";
import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../parameters/types.ts";
import { FunctionDefinitionArgs } from "./types.ts";
import { SlackManifest } from "../manifest/mod.ts";

/**
 * Define a function and its input and output parameters for use in a Slack application.
 * @param {FunctionDefinitionArgs<InputParameters, OutputParameters, RequiredInput, RequiredOutput>} definition Defines information about your function (title, description) as well as formalizes the input and output parameters of your function
 * @returns {SlackFunctionDefinition}
 */
export const DefineFunction = <
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
>(
  definition: FunctionDefinitionArgs<
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
> {
  public id: string;

  constructor(
    public definition: FunctionDefinitionArgs<
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
    };
  }
}
