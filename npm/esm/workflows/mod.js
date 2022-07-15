import { ParameterVariable, } from "../parameters/mod.js";
import { TypedWorkflowStepDefinition, UntypedWorkflowStepDefinition, } from "./workflow-step.js";
export const DefineWorkflow = (definition) => {
    return new WorkflowDefinition(definition);
};
export class WorkflowDefinition {
    constructor(definition) {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "definition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inputs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "steps", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.id = definition.callback_id;
        this.definition = definition;
        this.inputs = {};
        this.outputs = {};
        for (const [inputName, inputDefinition] of Object.entries(definition.input_parameters?.properties
            ? definition.input_parameters.properties
            : {})) {
            // deno-lint-ignore ban-ts-comment
            //@ts-ignore
            this.inputs[inputName] = ParameterVariable("inputs", inputName, inputDefinition);
        }
    }
    // The runtime implementation of addStep handles both signatures (straight function-reference & config, or ISlackFunction)
    addStep(functionOrReference, inputs) {
        const stepId = `${this.steps.length}`;
        if (typeof functionOrReference === "string") {
            const newStep = new UntypedWorkflowStepDefinition(stepId, functionOrReference, inputs);
            this.steps.push(newStep);
            return newStep;
        }
        const slackFunction = functionOrReference;
        const newStep = new TypedWorkflowStepDefinition(stepId, slackFunction, inputs);
        this.steps.push(newStep);
        return newStep;
    }
    export() {
        return {
            title: this.definition.title,
            description: this.definition.description,
            input_parameters: this.definition.input_parameters,
            steps: this.steps.map((s) => s.export()),
        };
    }
    registerStepFunctions(manifest) {
        this.steps.forEach((s) => s.registerFunction(manifest));
    }
    registerParameterTypes(manifest) {
        const { input_parameters: inputParams, output_parameters: outputParams } = this.definition;
        manifest.registerTypes(inputParams?.properties ?? {});
        manifest.registerTypes(outputParams?.properties ?? {});
    }
    toJSON() {
        return this.export();
    }
}
