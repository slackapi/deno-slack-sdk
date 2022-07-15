import { SlackManifest } from "../manifest/mod.js";
import { ManifestWorkflowSchema } from "../manifest/manifest_schema.js";
import { ISlackFunction } from "../functions/types.js";
import { ParameterSetDefinition, PossibleParameterKeys } from "../parameters/mod.js";
import { TypedWorkflowStepDefinition, UntypedWorkflowStepDefinition, WorkflowStepDefinition } from "./workflow-step.js";
import { ISlackWorkflow, SlackWorkflowDefinitionArgs, WorkflowInputs, WorkflowOutputs, WorkflowStepInputs } from "./types.js";
export declare const DefineWorkflow: <Inputs extends ParameterSetDefinition, Outputs extends ParameterSetDefinition, RequiredInputs extends PossibleParameterKeys<Inputs>, RequiredOutputs extends PossibleParameterKeys<Outputs>>(definition: SlackWorkflowDefinitionArgs<Inputs, Outputs, RequiredInputs, RequiredOutputs>) => WorkflowDefinition<Inputs, Outputs, RequiredInputs, RequiredOutputs>;
export declare class WorkflowDefinition<Inputs extends ParameterSetDefinition, Outputs extends ParameterSetDefinition, RequiredInputs extends PossibleParameterKeys<Inputs>, RequiredOutputs extends PossibleParameterKeys<Outputs>> implements ISlackWorkflow {
    id: string;
    private definition;
    inputs: WorkflowInputs<Inputs, RequiredInputs>;
    outputs: WorkflowOutputs<Outputs, RequiredOutputs>;
    steps: WorkflowStepDefinition[];
    constructor(definition: SlackWorkflowDefinitionArgs<Inputs, Outputs, RequiredInputs, RequiredOutputs>);
    addStep<StepInputs extends ParameterSetDefinition, StepOutputs extends ParameterSetDefinition, RequiredStepInputs extends PossibleParameterKeys<StepInputs>, RequiredStepOutputs extends PossibleParameterKeys<StepOutputs>>(slackFunction: ISlackFunction<StepInputs, StepOutputs, RequiredStepInputs, RequiredStepOutputs>, inputs: WorkflowStepInputs<StepInputs, RequiredStepInputs>): TypedWorkflowStepDefinition<StepInputs, StepOutputs, RequiredStepInputs, RequiredStepOutputs>;
    addStep(functionReference: string, inputs: WorkflowStepInputs<ParameterSetDefinition, PossibleParameterKeys<ParameterSetDefinition>>): UntypedWorkflowStepDefinition;
    export(): ManifestWorkflowSchema;
    registerStepFunctions(manifest: SlackManifest): void;
    registerParameterTypes(manifest: SlackManifest): void;
    toJSON(): ManifestWorkflowSchema;
}
