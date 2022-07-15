import type { ParameterSetDefinition, PossibleParameterKeys } from "../../parameters/mod.js";
import type { SlackFunction } from "../mod.js";
import type { FunctionContext, FunctionRuntimeParameters } from "../types.js";
export declare type SlackFunctionTesterArgs<InputParameters> = Partial<FunctionContext<InputParameters>> & {
    inputs: InputParameters;
};
export declare type CreateContext<InputParameters extends ParameterSetDefinition, RequiredInput extends PossibleParameterKeys<InputParameters>> = {
    (args: SlackFunctionTesterArgs<FunctionRuntimeParameters<InputParameters, RequiredInput> | undefined>): FunctionContext<FunctionRuntimeParameters<InputParameters, RequiredInput>>;
};
export declare type SlackFunctionTesterResponse<InputParameters extends ParameterSetDefinition, RequiredInput extends PossibleParameterKeys<InputParameters>> = {
    createContext: CreateContext<InputParameters, RequiredInput>;
};
export declare type SlackFunctionTesterFn = {
    <InputParameters extends ParameterSetDefinition, OutputParameters extends ParameterSetDefinition, RequiredInput extends PossibleParameterKeys<InputParameters>, RequiredOutput extends PossibleParameterKeys<OutputParameters>>(funcOrCallbackId: SlackFunction<InputParameters, OutputParameters, RequiredInput, RequiredOutput>): SlackFunctionTesterResponse<InputParameters, RequiredInput>;
    (funcOrCallbackId: string): {
        createContext: {
            <I>(args: SlackFunctionTesterArgs<I>): FunctionContext<I>;
        };
    };
};
