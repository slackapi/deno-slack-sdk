import {
  ManifestFunctionSchema,
  ManifestFunctionType,
} from "../../manifest/manifest_schema.ts";
import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/types.ts";
import { FunctionDefinitionArgs } from "../types.ts";
import { FunctionDefinition } from "./function.ts";

export class ConnectorFunctionDefinition<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
> extends FunctionDefinition<
  InputParameters,
  OutputParameters,
  RequiredInput,
  RequiredOutput
> {
  type: ManifestFunctionType = "API";
  constructor(
    public definition: FunctionDefinitionArgs<
      InputParameters,
      OutputParameters,
      RequiredInput,
      RequiredOutput
    >,
  ) {
    super(definition);
  }

  export(): ManifestFunctionSchema {
    return {
      title: this.definition.title,
      description: this.definition.description,
      type: this.type,
      input_parameters: this.definition.input_parameters ??
        { properties: {}, required: [] },
      output_parameters: this.definition.output_parameters ??
        { properties: {}, required: [] },
    };
  }
}
