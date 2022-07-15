import { SlackManifest } from "../manifest/mod.js";
import type { ManifestWorkflowSchema } from "../manifest/manifest_schema.js";
import { ParameterPropertiesDefinition, ParameterSetDefinition, ParameterVariableType, PossibleParameterKeys } from "../parameters/mod.js";
export interface ISlackWorkflow {
    id: string;
    export: () => ManifestWorkflowSchema;
    registerStepFunctions: (manifest: SlackManifest) => void;
    registerParameterTypes: (manfest: SlackManifest) => void;
}
export declare type SlackWorkflowDefinition<Definition> = Definition extends SlackWorkflowDefinitionArgs<infer I, infer O, infer RI, infer RO> ? SlackWorkflowDefinitionArgs<I, O, RI, RO> : never;
export declare type SlackWorkflowDefinitionArgs<InputParameters extends ParameterSetDefinition, OutputParameters extends ParameterSetDefinition, RequiredInputs extends PossibleParameterKeys<InputParameters>, RequiredOutputs extends PossibleParameterKeys<OutputParameters>> = {
    callback_id: string;
    title: string;
    description?: string;
    "input_parameters"?: ParameterPropertiesDefinition<InputParameters, RequiredInputs>;
    "output_parameters"?: ParameterPropertiesDefinition<OutputParameters, RequiredOutputs>;
};
export declare type WorkflowInputs<Params extends ParameterSetDefinition, RequiredParams extends PossibleParameterKeys<Params>> = WorkflowParameterReferences<Params, RequiredParams>;
export declare type WorkflowOutputs<Params extends ParameterSetDefinition, RequiredParams extends PossibleParameterKeys<Params>> = WorkflowParameterReferences<Params, RequiredParams>;
export declare type WorkflowStepOutputs<Params extends ParameterSetDefinition, RequiredParams extends PossibleParameterKeys<Params>> = WorkflowParameterReferences<Params, RequiredParams>;
declare type WorkflowParameterReferences<Parameters extends ParameterSetDefinition, Required extends PossibleParameterKeys<Parameters>> = {
    [name in Required[number]]: ParameterVariableType<Parameters[name]>;
} & {
    [name in keyof Parameters]?: ParameterVariableType<Parameters[name]>;
};
export declare type WorkflowStepInputs<InputParameters extends ParameterSetDefinition, RequiredInputs extends PossibleParameterKeys<InputParameters>> = {
    [k in RequiredInputs[number]]: any;
} & {
    [k in keyof InputParameters]?: any;
};
export {};
