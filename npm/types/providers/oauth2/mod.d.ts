import { OAuth2ProviderDefinitionArgs } from "./types.js";
import { ManifestOAuth2ProviderSchema } from "../../manifest/manifest_schema.js";
export declare const DefineOAuth2Provider: (definition: OAuth2ProviderDefinitionArgs) => OAuth2Provider;
export declare class OAuth2Provider {
    definition: OAuth2ProviderDefinitionArgs;
    id: string;
    private provider_type;
    private options;
    constructor(definition: OAuth2ProviderDefinitionArgs);
    export(): ManifestOAuth2ProviderSchema;
}
