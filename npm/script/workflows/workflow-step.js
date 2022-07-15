"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UntypedWorkflowStepDefinition = exports.TypedWorkflowStepDefinition = void 0;
const mod_js_1 = require("../parameters/mod.js");
const localFnPrefix = "#/functions/";
class BaseWorkflowStepDefinition {
    constructor(stepId, functionReference, inputs) {
        Object.defineProperty(this, "stepId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "functionReference", {
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
        this.stepId = stepId;
        // ensures the function reference is a full path - local functions will only be passing in the function callback id
        this.functionReference = functionReference.includes("#/")
            ? functionReference
            : `${localFnPrefix}${functionReference}`;
        this.inputs = inputs;
    }
    templatizeInputs() {
        const templatizedInputs = {};
        for (const [inputName, inputValue] of Object.entries(this.inputs)) {
            templatizedInputs[inputName] = JSON.parse(JSON.stringify(inputValue));
        }
        return templatizedInputs;
    }
    export() {
        return {
            id: this.stepId,
            function_id: this.functionReference,
            inputs: this.templatizeInputs(),
        };
    }
    toJSON() {
        return this.export();
    }
    registerFunction(_manifest) {
        // default is a noop, only steps using a function definition will register themselves on the manifest
    }
    isLocalFunctionReference() {
        return this.functionReference.startsWith(localFnPrefix);
    }
}
class TypedWorkflowStepDefinition extends BaseWorkflowStepDefinition {
    constructor(stepId, slackFunction, inputs) {
        super(stepId, slackFunction.id, inputs);
        Object.defineProperty(this, "definition", {
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
        this.definition = slackFunction;
        this.outputs = {};
        // Setup step outputs for use in input template expressions
        for (const [outputName, outputDefinition] of Object.entries(slackFunction?.definition?.output_parameters?.properties ?? {})) {
            // deno-lint-ignore ban-ts-comment
            //@ts-ignore
            this.outputs[outputName] = (0, mod_js_1.ParameterVariable)(`steps.${this.stepId}`, outputName, outputDefinition);
        }
    }
    registerFunction(manifest) {
        if (this.isLocalFunctionReference()) {
            manifest.registerFunction(this.definition);
        }
    }
}
exports.TypedWorkflowStepDefinition = TypedWorkflowStepDefinition;
class UntypedWorkflowStepDefinition extends BaseWorkflowStepDefinition {
    constructor(stepId, functionReference, 
    // deno-lint-ignore no-explicit-any
    inputs) {
        super(stepId, functionReference, inputs);
        Object.defineProperty(this, "outputs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.outputs = (0, mod_js_1.CreateUntypedObjectParameterVariable)(`steps.${stepId}`, "");
    }
}
exports.UntypedWorkflowStepDefinition = UntypedWorkflowStepDefinition;
