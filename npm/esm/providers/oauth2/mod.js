export const DefineOAuth2Provider = (definition) => {
    return new OAuth2Provider(definition);
};
export class OAuth2Provider {
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
        Object.defineProperty(this, "provider_type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.id = definition.provider_key;
        this.provider_type = definition.provider_type;
        this.options = definition.options;
    }
    export() {
        return {
            provider_type: this.provider_type,
            options: this.options,
        };
    }
}
