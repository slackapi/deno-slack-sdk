import { ManifestFunctionSchema } from "../manifest/manifest_schema.js";
import { ParameterSetDefinition, PossibleParameterKeys } from "../parameters/mod.js";
import { FunctionDefinitionArgs } from "./types.js";
import { SlackManifest } from "../manifest/mod.js";
/**
 * Define a function and its input and output parameters for use in a Slack application.
 * @param {FunctionDefinitionArgs<InputParameters, OutputParameters, RequiredInput, RequiredOutput>} definition Defines information about your function (title, description) as well as formalizes the input and output parameters of your function
 * @returns {SlackFunction}
 */
export declare const DefineFunction: <InputParameters extends ParameterSetDefinition, OutputParameters extends ParameterSetDefinition, RequiredInput extends PossibleParameterKeys<InputParameters>, RequiredOutput extends PossibleParameterKeys<OutputParameters>>(definition: FunctionDefinitionArgs<InputParameters, OutputParameters, RequiredInput, RequiredOutput>) => SlackFunction<InputParameters, OutputParameters, RequiredInput, RequiredOutput>;
export declare class SlackFunction<InputParameters extends ParameterSetDefinition, OutputParameters extends ParameterSetDefinition, RequiredInput extends PossibleParameterKeys<InputParameters>, RequiredOutput extends PossibleParameterKeys<OutputParameters>> {
    definition: FunctionDefinitionArgs<InputParameters, OutputParameters, RequiredInput, RequiredOutput>;
    id: string;
    constructor(definition: FunctionDefinitionArgs<InputParameters, OutputParameters, RequiredInput, RequiredOutput>);
    registerParameterTypes(manifest: SlackManifest): void;
    export(): ManifestFunctionSchema;
}
