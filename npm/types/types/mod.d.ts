import { SlackManifest } from "../manifest/mod.js";
import { ManifestCustomTypeSchema } from "../manifest/manifest_schema.js";
import { CustomTypeDefinition, DefineTypeFunction, ICustomType } from "./types.js";
export declare const DefineType: DefineTypeFunction;
export declare class CustomType<Def extends CustomTypeDefinition> implements ICustomType {
    definition: Def;
    id: string;
    title: string | undefined;
    description: string | undefined;
    constructor(definition: Def);
    private generateReferenceString;
    toString(): string;
    toJSON(): string;
    registerParameterTypes(manifest: SlackManifest): void;
    export(): ManifestCustomTypeSchema;
}
