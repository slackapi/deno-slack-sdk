import {
  ISlackManifestRemote,
  ISlackManifestRunOnSlack,
  SlackManifestType,
} from "./types.ts";
import { ICustomType } from "../types/types.ts";
import { OAuth2Provider } from "../providers/oauth2/mod.ts";
import { ParameterSetDefinition } from "../parameters/mod.ts";
import {
  ManifestCustomTypesSchema,
  ManifestDataStoresSchema,
  ManifestFunction,
  ManifestFunctionRuntime,
  ManifestFunctionsSchema,
  ManifestSchema,
  ManifestWorkflowsSchema,
} from "./manifest_schema.ts";

export const Manifest = (
  definition: Omit<ISlackManifestRunOnSlack, "runOnSlack">,
) => {
  const manifest = new SlackManifest(definition);
  return manifest.export();
};

export class SlackManifest {
  constructor(private definition: SlackManifestType) {
    this.registerFeatures();
  }

  export() {
    const def = this.definition;
    const manifest: ManifestSchema = {
      _metadata: {
        // todo: is there a more idiomatic way of defining this? constant file?
        major_version: 2,
      },
      display_information: {
        background_color: def.backgroundColor,
        name: def.name,
        long_description: def.longDescription,
        description: def.description,
      },
      icon: def.icon,
      oauth_config: {
        scopes: {
          bot: this.ensureBotScopes(),
        },
      },
      features: {
        bot_user: {
          display_name: def.displayName || def.name,
        },
        app_home: {
          messages_tab_enabled: true,
          messages_tab_read_only_enabled: true,
        },
      },
      settings: { function_runtime: this.getFunctionRuntime() },
    };

    // Assign other shared properties
    if (def.functions) {
      manifest.functions = def.functions?.reduce<ManifestFunctionsSchema>(
        (acc = {}, fn) => {
          acc[fn.id] = fn.export();
          return acc;
        },
        {},
      );
    }

    if (def.workflows) {
      manifest.workflows = def.workflows?.reduce<ManifestWorkflowsSchema>(
        (acc = {}, workflow) => {
          acc[workflow.id] = workflow.export();
          return acc;
        },
        {},
      );
    }

    if (def.types) {
      manifest.types = def.types?.reduce<ManifestCustomTypesSchema>(
        (acc = {}, customType) => {
          acc[customType.id] = customType.export();
          return acc;
        },
        {},
      );
    }

    if (def.datastores) {
      manifest.datastores = def.datastores?.reduce<ManifestDataStoresSchema>(
        (acc = {}, datastore) => {
          acc[datastore.name] = datastore.export();
          return acc;
        },
        {},
      );
    }

    if (def.features?.appHome) {
      const {
        homeTabEnabled,
        messagesTabEnabled,
        messagesTabReadOnlyEnabled,
      } = def.features.appHome;

      if (manifest.features.app_home != undefined) {
        manifest.features.app_home.home_tab_enabled = homeTabEnabled;
        manifest.features.app_home.messages_tab_enabled = messagesTabEnabled;
        manifest.features.app_home.messages_tab_read_only_enabled =
          messagesTabReadOnlyEnabled;
      }
    }

    manifest.outgoing_domains = def.outgoingDomains || [];

    // Assign remote hosted app properties
    if (manifest.settings.function_runtime === "slack") {
      this.assignRunOnSlackManifestProperties(manifest);
    } else if (manifest.settings.function_runtime === "remote") {
      this.assignRemoteSlackManifestProperties(manifest);
    }

    return manifest;
  }

  private registerFeatures() {
    this.definition.workflows?.forEach((workflow) => {
      workflow.registerStepFunctions(this);
      workflow.registerParameterTypes(this);
    });
    // Loop through functions to automatically register any referenced types
    this.definition.functions?.forEach((func) => {
      func.registerParameterTypes(this);
    });

    // Loop through datastores to automatically register any referenced types
    this.definition.datastores?.forEach((datastore) => {
      datastore.registerAttributeTypes(this);
    });

    // Loop through types to automatically register any referenced sub-types
    const registeredTypes = this.definition.types || [];
    for (let i = 0; i < registeredTypes.length; i++) {
      this.definition.types?.[i].registerParameterTypes(this);
    }
  }

  registerFunction(func: ManifestFunction) {
    if (!this.definition.functions) this.definition.functions = [];
    // Check to make sure function doesn't already exist on manifest
    else if (this.definition.functions.some((f) => func.id === f.id)) return;
    // Add function to manifest
    this.definition.functions.push(func);
  }

  // Loop through a ParameterSetDefinition to register each individual type
  registerTypes(parameterSet: ParameterSetDefinition) {
    Object.values(parameterSet ?? {}).forEach((param) => {
      if (param.type instanceof Object) {
        this.registerType(param.type);
      }
    });
  }

  registerType(customType: ICustomType) {
    if (!this.definition.types) this.definition.types = [];
    // Check to make sure type doesn't already exist on manifest
    if (this.definition.types.some((type) => type.id === customType.id)) {
      return;
    }
    // Add type to manifest
    this.definition.types.push(customType);
  }

  private ensureBotScopes(): string[] {
    const includedScopes = this.definition.botScopes || [];

    // Add datastore scopes if necessary
    if (Object.keys(this.definition.datastores ?? {}).length > 0) {
      const datastoreScopes = ["datastore:read", "datastore:write"];
      datastoreScopes.forEach((scope) => {
        if (!includedScopes.includes(scope)) {
          includedScopes.push(scope);
        }
      });
    }

    return includedScopes;
  }

  // Maps the top level runOnSlack boolean property to corresponding underlying ManifestSchema function_runtime property required by Slack API.
  // If no runOnSlack property supplied, then functionRuntime defaults to "slack".
  private getFunctionRuntime(): ManifestFunctionRuntime {
    return this.definition.runOnSlack === false ? "remote" : "slack";
  }

  // Assigns the remote app properties
  private assignRemoteSlackManifestProperties(manifest: ManifestSchema) {
    const def = this.definition as ISlackManifestRemote;

    //Settings
    manifest.settings = {
      ...manifest.settings,
      ...def.settings,
    };
    manifest.settings.event_subscriptions = def.eventSubscriptions;
    manifest.settings.socket_mode_enabled = def.socketModeEnabled;
    manifest.settings.token_rotation_enabled = def.tokenRotationEnabled;

    //AppDirectory
    manifest.app_directory = def.appDirectory;

    //OauthConfig
    manifest.oauth_config.scopes.user = def.userScopes;
    manifest.oauth_config.redirect_urls = def.redirectUrls;
    manifest.oauth_config.token_management_enabled = def.tokenManagementEnabled;

    // Remote Features
    manifest.features.bot_user!.always_online = def.features?.botUser
      ?.always_online;
    manifest.features.shortcuts = def.features?.shortcuts;
    manifest.features.slash_commands = def.features?.slashCommands;
    manifest.features.unfurl_domains = def.features?.unfurlDomains;
    manifest.features.workflow_steps = def.features?.workflowSteps;
  }

  private assignRunOnSlackManifestProperties(manifest: ManifestSchema) {
    const def = this.definition as ISlackManifestRunOnSlack;

    // External Auth providers
    if (def.externalAuthProviders) {
      manifest.external_auth_providers = def.externalAuthProviders?.reduce(
        (acc, provider) => {
          if (provider instanceof OAuth2Provider) {
            acc["oauth2"] = acc["oauth2"] ?? {};
            acc["oauth2"][provider.id] = provider.export();
          }
          return acc;
        },
        {} as NonNullable<ManifestSchema["external_auth_providers"]>,
      );
    }
  }
}
