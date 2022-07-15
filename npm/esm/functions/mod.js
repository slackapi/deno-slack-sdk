/**
 * Define a function and its input and output parameters for use in a Slack application.
 * @param {FunctionDefinitionArgs<InputParameters, OutputParameters, RequiredInput, RequiredOutput>} definition Defines information about your function (title, description) as well as formalizes the input and output parameters of your function
 * @returns {SlackFunction}
 */
export const DefineFunction = (definition) => {
    return new SlackFunction(definition);
};
export class SlackFunction {
    constructor(definition) {
        Object.defineProperty(this, "definition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: definition
        });
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.id = definition.callback_id;
        this.definition = definition;
    }
    registerParameterTypes(manifest) {
        const { input_parameters: inputParams, output_parameters: outputParams } = this.definition;
        manifest.registerTypes(inputParams?.properties ?? {});
        manifest.registerTypes(outputParams?.properties ?? {});
    }
    export() {
        return {
            title: this.definition.title,
            description: this.definition.description,
            source_file: this.definition.source_file,
            input_parameters: this.definition.input_parameters ??
                { properties: {}, required: [] },
            output_parameters: this.definition.output_parameters ??
                { properties: {}, required: [] },
        };
    }
}
