import {
  ManifestFunctionSchema,
  ManifestFunctionType,
} from "../../manifest/manifest_schema.ts";
import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/types.ts";
import { FunctionDefinitionArgs, ISlackFunctionDefinition } from "../types.ts";
import { SlackManifest } from "../../manifest/mod.ts";

export abstract class FunctionDefinition<
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
  public id: string;
  abstract type: ManifestFunctionType;

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

  abstract export(): ManifestFunctionSchema;
}
