"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackDatastore = exports.DefineDatastore = void 0;
/**
 * Define a datastore and primary key and attributes for use in a Slack application.
 * @param {SlackDatastoreDefinition<string, SlackDatastoreAttributes, string>} definition Defines information about your datastore.
 * @returns {SlackDatastore}
 */
const DefineDatastore = (definition) => {
    return new SlackDatastore(definition);
};
exports.DefineDatastore = DefineDatastore;
class SlackDatastore {
    constructor(definition) {
        Object.defineProperty(this, "definition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: definition
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = definition.name;
    }
    registerAttributeTypes(manifest) {
        Object.values(this.definition.attributes ?? {})?.forEach((attribute) => {
            if (attribute.type instanceof Object) {
                manifest.registerType(attribute.type);
            }
        });
    }
    export() {
        return {
            primary_key: this.definition.primary_key,
            attributes: this.definition.attributes,
        };
    }
}
exports.SlackDatastore = SlackDatastore;
