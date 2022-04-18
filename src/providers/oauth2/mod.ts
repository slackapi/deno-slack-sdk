import {
  ManifestOAuth2ProviderSchema,
  OAuth2ProviderOptions,
} from "./types.ts";

export const DefineOAuth2Provider = (
  definition: OAuth2ProviderDefinitionArgs,
): OAuth2Provider => {
  return new OAuth2Provider(definition);
};

export enum OAuth2ProviderTypes {
  CUSTOM = "CUSTOM",
}

export type OAuth2ProviderDefinitionArgs = {
  /** A unique name for your provider */
  provider_key: string;
  /** Type of your provider */
  provider_type: OAuth2ProviderTypes;
  /** OAuth2 Configuration options for your provider */
  options: OAuth2ProviderOptions;
};

export class OAuth2Provider {
  public id: string;
  public provider_type: OAuth2ProviderTypes;
  public options: OAuth2ProviderOptions;

  constructor(
    public definition: OAuth2ProviderDefinitionArgs,
  ) {
    this.id = definition.provider_key;
    this.provider_type = definition.provider_type;
    this.options = definition.options;
  }

  export(): ManifestOAuth2ProviderSchema {
    return {
      // provider_key: this.id,
      provider_type: this.provider_type,
      options: this.options,
    };
  }
}
