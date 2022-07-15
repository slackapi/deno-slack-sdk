import { ICustomType } from "../types/types.js";
import { ManifestDatastoreSchema } from "../manifest/manifest_schema.js";
import { SlackManifest } from "../manifest/mod.js";
export declare type SlackDatastoreAttribute = {
    type: string | ICustomType;
};
export declare type SlackDatastoreAttributes = Record<string, SlackDatastoreAttribute>;
export declare type SlackDatastoreDefinition<Name extends string, Attributes extends SlackDatastoreAttributes, PrimaryKey extends keyof Attributes> = {
    name: Name;
    "primary_key": PrimaryKey;
    attributes: Attributes;
};
export interface ISlackDatastore {
    name: string;
    export: () => ManifestDatastoreSchema;
    registerAttributeTypes: (manifest: SlackManifest) => void;
}
export declare type SlackDatastoreItem<Attributes extends SlackDatastoreAttributes> = {
    [k in keyof Attributes]: any;
};
export declare type PartialSlackDatastoreItem<Attributes extends SlackDatastoreAttributes> = OptionalPartial<Attributes>;
declare type OptionalPartial<T extends any> = {
    [P in keyof T]?: any;
};
export {};
