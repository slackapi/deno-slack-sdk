import { ManifestFunctionSchema } from "../types.ts";
import {
  ParameterSetDefinition,
  RequiredParameters,
} from "../parameters/mod.ts";
import {
  FunctionContext,
  FunctionDefinitionArgs,
  FunctionHandler,
  FunctionHandlerReturnArgs,
  IRunnableSlackFunction,
} from "./types.ts";
import { SlackProject } from "../project.ts";

/**
 * Define a function and its input and output parameters for use in a Slack application.
 * @param {string} id Unique string identifier for the function; must be unique in your application (cannot be reused by other functions)
 * @param {FunctionDefinitionArgs<InputParameters, OutputParameters, RequiredInput, RequiredOutput>} definition Defines information about your function (title, description) as well as formalizes the input and output parameters of your function
 * @param {FunctionHandler<InputParameters, OutputParameters, RequiredInput, RequiredOutput>} handler The logic comprising your function.
 * @returns {RunnableSlackFunction}
 */
export const DefineFunction = <
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends RequiredParameters<InputParameters>,
  RequiredOutput extends RequiredParameters<OutputParameters>,
>(
  id: string,
  definition: FunctionDefinitionArgs<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  >,
  handler: FunctionHandler<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  >,
) => {
  return new RunnableSlackFunction(id, definition, handler);
};

export class SlackFunction<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends RequiredParameters<InputParameters>,
  RequiredOutput extends RequiredParameters<OutputParameters>,
> {
  constructor(
    public id: string,
    public definition: FunctionDefinitionArgs<
      InputParameters,
      OutputParameters,
      RequiredInput,
      RequiredOutput
    >,
  ) {
    this.id = id;
    this.definition = definition;
  }

  export(): ManifestFunctionSchema {
    return {
      title: this.definition.title,
      description: this.definition.description,
      input_parameters: this.definition.input_parameters ??
        { properties: {}, required: [] },
      output_parameters: this.definition.output_parameters ??
        { properties: {}, required: [] },
    };
  }
}

class RunnableSlackFunction<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends RequiredParameters<InputParameters>,
  RequiredOutput extends RequiredParameters<OutputParameters>,
> extends SlackFunction<
  InputParameters,
  OutputParameters,
  RequiredInput,
  RequiredOutput
> implements
  IRunnableSlackFunction<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  > {
  handler: FunctionHandler<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  >;

  constructor(
    id: string,
    definition: FunctionDefinitionArgs<
      InputParameters,
      OutputParameters,
      RequiredInput,
      RequiredOutput
    >,
    handler: FunctionHandler<
      InputParameters,
      OutputParameters,
      RequiredInput,
      RequiredOutput
    >,
  ) {
    super(id, definition);
    this.handler = handler;
  }

  registerParameterTypes(project: SlackProject) {
    const { input_parameters: inputParams, output_parameters: outputParams } =
      this.definition;
    project.registerTypes(inputParams?.properties ?? {});
    project.registerTypes(outputParams?.properties ?? {});
  }

  async run(
    context: FunctionContext<
      InputParameters,
      RequiredInput
    >,
  ): Promise<FunctionHandlerReturnArgs<OutputParameters, RequiredOutput>> {
    return await this.handler(context);
  }
}
