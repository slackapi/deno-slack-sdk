import { TypedParameterDefinition } from "../parameters/types.js";
import { SlackManifest } from "../manifest/mod.js";
import { ManifestCustomTypeSchema } from "../manifest/manifest_schema.js";
import { CustomType } from "./mod.js";
export declare type NameTypeDefinition = {
    name: string;
} & TypedParameterDefinition;
export declare type CallbackTypeDefinition = {
    callback_id: string;
} & TypedParameterDefinition;
export declare type CustomTypeDefinition = NameTypeDefinition | CallbackTypeDefinition;
export declare type DefineTypeFunction = {
    <Def extends NameTypeDefinition>(definition: Def): CustomType<Def>;
    /**
     * @deprecated Use name instead of callback_id
     */
    <Def extends CallbackTypeDefinition>(definition: Def): CustomType<Def>;
};
export interface ICustomType {
    id: string;
    definition: CustomTypeDefinition;
    description?: string;
    registerParameterTypes: (manifest: SlackManifest) => void;
    export(): ManifestCustomTypeSchema;
}
