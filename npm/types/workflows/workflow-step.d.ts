import { SlackManifest } from "../manifest/mod.js";
import { ManifestWorkflowStepSchema } from "../manifest/manifest_schema.js";
import { ISlackFunction } from "../functions/types.js";
import { CreateUntypedObjectParameterVariable, ParameterSetDefinition, PossibleParameterKeys } from "../parameters/mod.js";
import { WorkflowStepInputs, WorkflowStepOutputs } from "./types.js";
export declare type WorkflowStepDefinition = TypedWorkflowStepDefinition<any, any, any, any> | UntypedWorkflowStepDefinition;
declare abstract class BaseWorkflowStepDefinition {
    protected stepId: string;
    protected functionReference: string;
    protected inputs: Record<string, unknown>;
    constructor(stepId: string, functionReference: string, inputs: Record<string, unknown>);
    templatizeInputs(): {
        [name: string]: unknown;
    };
    export(): ManifestWorkflowStepSchema;
    toJSON(): ManifestWorkflowStepSchema;
    registerFunction(_manifest: SlackManifest): void;
    protected isLocalFunctionReference(): boolean;
}
export declare class TypedWorkflowStepDefinition<InputParameters extends ParameterSetDefinition, OutputParameters extends ParameterSetDefinition, RequiredInputs extends PossibleParameterKeys<InputParameters>, RequiredOutputs extends PossibleParameterKeys<OutputParameters>> extends BaseWorkflowStepDefinition {
    definition: ISlackFunction<InputParameters, OutputParameters, RequiredInputs, RequiredOutputs>;
    outputs: WorkflowStepOutputs<OutputParameters, RequiredOutputs>;
    constructor(stepId: string, slackFunction: ISlackFunction<InputParameters, OutputParameters, RequiredInputs, RequiredOutputs>, inputs: WorkflowStepInputs<InputParameters, RequiredInputs>);
    registerFunction(manifest: SlackManifest): void;
}
export declare class UntypedWorkflowStepDefinition extends BaseWorkflowStepDefinition {
    outputs: ReturnType<typeof CreateUntypedObjectParameterVariable>;
    constructor(stepId: string, functionReference: string, inputs: WorkflowStepInputs<any, any>);
}
export {};
