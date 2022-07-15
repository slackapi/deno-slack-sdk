"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomType = exports.DefineType = void 0;
const DefineType = (definition) => {
    return new CustomType(definition);
};
exports.DefineType = DefineType;
class CustomType {
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
        Object.defineProperty(this, "title", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.id = "name" in definition ? definition.name : definition.callback_id;
        this.definition = definition;
        this.description = definition.description;
        this.title = definition.title;
    }
    generateReferenceString() {
        return `#/types/${this.id}`;
    }
    toString() {
        return this.generateReferenceString();
    }
    toJSON() {
        return this.generateReferenceString();
    }
    registerParameterTypes(manifest) {
        if ("items" in this.definition) {
            // Register the item if its a type
            if (this.definition.items.type instanceof Object) {
                manifest.registerType(this.definition.items.type);
            }
        }
        else if ("properties" in this.definition) {
            // Loop through the properties and register any types
            Object.values(this.definition.properties)?.forEach((property) => {
                if ("type" in property && property.type instanceof Object) {
                    manifest.registerType(property.type);
                }
            });
        }
        else if (this.definition.type instanceof Object) {
            // The referenced type is a Custom Type
            manifest.registerType(this.definition.type);
        }
    }
    export() {
        // remove callback_id or name from the definition we pass to the manifest
        if ("name" in this.definition) {
            const { name: _n, ...definition } = this.definition;
            return definition;
        }
        else {
            const { callback_id: _c, ...definition } = this.definition;
            return definition;
        }
    }
}
exports.CustomType = CustomType;
