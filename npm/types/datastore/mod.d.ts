import { SlackManifest } from "../manifest/mod.js";
import { ManifestDatastoreSchema } from "../manifest/manifest_schema.js";
import { ISlackDatastore, SlackDatastoreAttributes, SlackDatastoreDefinition } from "./types.js";
/**
 * Define a datastore and primary key and attributes for use in a Slack application.
 * @param {SlackDatastoreDefinition<string, SlackDatastoreAttributes, string>} definition Defines information about your datastore.
 * @returns {SlackDatastore}
 */
export declare const DefineDatastore: <Name extends string, Attributes extends SlackDatastoreAttributes, PrimaryKey extends keyof Attributes>(definition: SlackDatastoreDefinition<Name, Attributes, PrimaryKey>) => SlackDatastore<Name, Attributes, PrimaryKey>;
export declare class SlackDatastore<Name extends string, Attributes extends SlackDatastoreAttributes, PrimaryKey extends keyof Attributes> implements ISlackDatastore {
    definition: SlackDatastoreDefinition<Name, Attributes, PrimaryKey>;
    name: Name;
    constructor(definition: SlackDatastoreDefinition<Name, Attributes, PrimaryKey>);
    registerAttributeTypes(manifest: SlackManifest): void;
    export(): ManifestDatastoreSchema;
}
