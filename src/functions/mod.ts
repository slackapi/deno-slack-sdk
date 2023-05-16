import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../parameters/types.ts";
import { SlackFunctionDefinitionArgs } from "./types.ts";

import {
  ConnectorFunctionDefinition,
  SlackFunctionDefinition,
} from "./function_definition.ts";

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
  definition: SlackFunctionDefinitionArgs<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  >,
) => {
  return new SlackFunctionDefinition(definition);
};

export { ConnectorFunctionDefinition, SlackFunctionDefinition };
