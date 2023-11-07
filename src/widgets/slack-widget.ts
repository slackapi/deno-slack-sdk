import {
  ParameterPropertiesDefinition,
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "../parameters/types.ts";
import {
  EnrichedSlackFunctionHandler,
  RuntimeFunctionContext,
  RuntimeUnhandledEventContext,
  SlackFunctionType,
} from "./copied-from-function.ts";
import { SlackManifest } from "../manifest/mod.ts";
import { enrichContext } from "../functions/enrich-context.ts";
import {
  // ManifestFunctionSchema,
  // ManifestFunctionType,
} from "../manifest/manifest_schema.ts";
import { SlackWidgetDefinitionArgs } from "./types.ts";
// import { SlackFunctionDefinitionArgs } from "../functions/types.ts";

// import { SlackFunctionDefinition } from "../functions/definitions/mod.ts";

export type RequiredParameters = {
  [index: number]: string | number | symbol;
};

export type ManifestWidgetParameters = {
  required?: RequiredParameters;
  properties: ParameterSetDefinition;
};

export type ManifestWidgetSchema = {
  title?: string;
  description?: string;
  source_file: string;
  function_id: string;
  input_parameters?: ManifestWidgetParameters;
  output_parameters?: ManifestWidgetParameters;
};

export type WidgetDefinitionArgs<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInputs extends PossibleParameterKeys<InputParameters>,
  RequiredOutputs extends PossibleParameterKeys<OutputParameters>,
> = {
  callback_id: string;
  /** A title for your function. */
  title: string;
  /** An optional description for your function. */
  description?: string;
  source_file: string;
  function_id: string;
  /** An optional map of input parameter names containing information about their type, title, description, required and (additional) properties. */
  "input_parameters"?: ParameterPropertiesDefinition<
    InputParameters,
    RequiredInputs
  >;
  /** An optional map of output parameter names containing information about their type, title, description, required and (additional) properties. */
  "output_parameters"?: ParameterPropertiesDefinition<
    OutputParameters,
    RequiredOutputs
  >;
};

export interface ISlackWidgetDefinition<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutputs extends PossibleParameterKeys<OutputParameters>,
> {
  // type: ManifestWidgetType;
  id: string;
  definition: WidgetDefinitionArgs<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutputs
  >;
  export?: (() => ManifestWidgetSchema) | undefined;
  registerParameterTypes?: ((manifest: SlackManifest) => void) | undefined;
}

export class SlackWidgetDefinition<
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
  CallbackID extends string,
> implements
  ISlackWidgetDefinition<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput
  > {
  // type: ManifestFunctionType = "app";
  id: string;

  constructor(
    public definition: SlackWidgetDefinitionArgs<
      InputParameters,
      OutputParameters,
      RequiredInput,
      RequiredOutput,
      CallbackID
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

  export(): ManifestWidgetSchema {
    return {
      title: this.definition.title,
      description: this.definition.description,
      source_file: this.definition.source_file,
      function_id: this.definition.function_id,
      input_parameters: this.definition.input_parameters ??
        { properties: {}, required: [] },
      output_parameters: this.definition.output_parameters ??
        { properties: {}, required: [] },
    };
  }
}

export const SlackWidget = <
  InputParameters extends ParameterSetDefinition,
  OutputParameters extends ParameterSetDefinition,
  RequiredInput extends PossibleParameterKeys<InputParameters>,
  RequiredOutput extends PossibleParameterKeys<OutputParameters>,
  CallbackID extends string,
>(
  func: SlackWidgetDefinition<
    InputParameters,
    OutputParameters,
    RequiredInput,
    RequiredOutput,
    CallbackID
  >,
  functionHandler: EnrichedSlackFunctionHandler<typeof func.definition>,
) => {
  // Start with the provided fn handler, and we'll wrap it up so we can append some additional functions to it

  // Wrap the provided handler's call so we can add additional context
  // deno-lint-ignore no-explicit-any
  const handlerModule: any = (
    ctx: RuntimeFunctionContext<InputParameters>,
    // deno-lint-ignore no-explicit-any
    ...args: any
  ) => {
    // enrich the context w/ additional properties
    const newContext = enrichContext(ctx);

    //@ts-expect-error - intentionally specifying the provided functionHandler as the `this` arg for the handler's call
    return functionHandler.apply(functionHandler, [newContext, ...args]);
  };
  // Unhandled events are sent to a single handler, which is not set by default
  handlerModule.unhandledEvent = undefined;

  // deno-lint-ignore no-explicit-any
  handlerModule.addUnhandledEventHandler = (handler: any) => {
    // Set the unhandledEvent property directly
    handlerModule.unhandledEvent = (
      ctx: RuntimeUnhandledEventContext<InputParameters>,
      // deno-lint-ignore no-explicit-any
      ...args: any
    ) => {
      const newContext = enrichContext(ctx);

      return handler.apply(handler, [newContext, ...args]);
    };

    return handlerModule;
  };

  return handlerModule as SlackFunctionType<typeof func.definition>;
};
