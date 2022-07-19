import { SlackManifestType } from "./types.js";
import { ICustomType } from "../types/types.js";
import { ParameterSetDefinition } from "../parameters/mod.js";
import { ManifestFunction, ManifestSchema } from "./manifest_schema.js";
export declare const Manifest: (definition: Omit<SlackManifestType, "runOnSlack">) => ManifestSchema;
export declare class SlackManifest {
    private definition;
    constructor(definition: SlackManifestType);
    export(): ManifestSchema;
    private registerFeatures;
    registerFunction(func: ManifestFunction): void;
    registerTypes(parameterSet: ParameterSetDefinition): void;
    registerType(customType: ICustomType): void;
    private ensureBotScopes;
    private getFunctionRuntime;
    private assignNonRunOnSlackManifestProperties;
}
