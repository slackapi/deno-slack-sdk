"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dntShim = __importStar(require("../_dnt.test_shims.js"));
const dev_deps_js_1 = require("../dev_deps.js");
const mod_js_1 = require("./mod.js");
const mod_js_2 = require("../mod.js");
dntShim.Deno.test("WorkflowStep export input values", () => {
    const TestFunction = (0, mod_js_2.DefineFunction)({
        callback_id: "no_params",
        title: "Test Function",
        source_file: "",
        input_parameters: {
            properties: {
                email: {
                    type: "string",
                },
                name: {
                    type: "string",
                },
                manager: {
                    type: "object",
                    properties: {
                        email: { type: "string" },
                        name: { type: "string" },
                    },
                },
            },
            required: ["email"],
        },
        output_parameters: {
            properties: {
                url: {
                    type: "string",
                },
                manager: {
                    type: "object",
                    properties: {
                        email: { type: "string" },
                        name: { type: "string" },
                    },
                },
            },
            required: ["url"],
        },
    });
    const workflow = (0, mod_js_1.DefineWorkflow)({
        callback_id: "test_wf",
        title: "test",
        input_parameters: {
            properties: {
                email: {
                    type: "string",
                },
                name: {
                    type: "string",
                },
                manager: {
                    type: "object",
                    properties: {
                        email: { type: "string" },
                        name: { type: "string" },
                    },
                },
            },
            required: ["email", "manager"],
        },
    });
    // Add a DefineFunction result as a step
    const step1 = workflow.addStep(TestFunction, {
        email: workflow.inputs.email,
        name: `A name: ${workflow.inputs.name}`,
        manager: {
            name: workflow.inputs.manager.name,
            email: workflow.inputs.manager.email,
        },
    });
    // add a manually configured step
    const step2 = workflow.addStep("slack#/functions/create_channel", {
        channel_name: `test-channel-${workflow.inputs.name}-${step1.outputs.url}`,
    });
    // another manually configured step, reyling on outputs of another manually configured step
    workflow.addStep("slack#/functions/send_message", {
        channel_id: "C123123",
        message: `Channel Created <#${step2.outputs.channel_id}>`,
    });
    const exportedWorkflow = workflow.export();
    const step1Inputs = exportedWorkflow.steps[0].inputs;
    const step2Inputs = exportedWorkflow.steps[1].inputs;
    const step3Inputs = exportedWorkflow.steps[2].inputs;
    (0, dev_deps_js_1.assertEquals)(exportedWorkflow.steps.length, 3);
    (0, dev_deps_js_1.assertEquals)(exportedWorkflow.title, "test");
    (0, dev_deps_js_1.assertEquals)(exportedWorkflow?.input_parameters?.properties.email, {
        type: "string",
    });
    (0, dev_deps_js_1.assertEquals)(`${step1Inputs.email}`, "{{inputs.email}}");
    (0, dev_deps_js_1.assertEquals)(`${step1Inputs.name}`, "A name: {{inputs.name}}");
    (0, dev_deps_js_1.assertEquals)(`${step1.outputs.url}`, "{{steps.0.url}}");
    (0, dev_deps_js_1.assertEquals)(`${step1.outputs.manager?.email}`, "{{steps.0.manager.email}}");
    (0, dev_deps_js_1.assertEquals)(`${step1.outputs.manager?.name}`, "{{steps.0.manager.name}}");
    (0, dev_deps_js_1.assertEquals)(`${step2Inputs.channel_name}`, "test-channel-{{inputs.name}}-{{steps.0.url}}");
    (0, dev_deps_js_1.assertEquals)(`${step3Inputs.channel_id}`, "C123123");
    (0, dev_deps_js_1.assertEquals)(`${step3Inputs.message}`, "Channel Created <#{{steps.1.channel_id}}>");
});
