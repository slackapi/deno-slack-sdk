import { SlackFunctionDefinition } from "./slack-function.ts";
import { ConnectorFunctionDefinition } from "./connector-function.ts";

import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../../parameters/types.ts";
import {
  FunctionDefinitionArgs,
  SlackFunctionDefinitionArgs,
} from "./../types.ts";

export { ConnectorFunctionDefinition, SlackFunctionDefinition };
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

/**
 * Define a connector and its input and output parameters for use in a Slack application.
 * @param {FunctionDefinitionArgs<InputParameters, OutputParameters, RequiredInput, RequiredOutput>} definition Defines information about your function (title, description) as well as formalizes the input and output parameters of a connector
 * @returns {ConnectorFunctionDefinition}
 */
export const DefineConnector = <
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
  return new ConnectorFunctionDefinition(definition);
};
