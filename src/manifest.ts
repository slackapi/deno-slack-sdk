import { ParameterSetDefinition } from "./parameters/mod.ts";
import {
  ManifestCustomTypesSchema,
  ManifestDataStoresSchema,
  ManifestFunction,
  ManifestFunctionsSchema,
  ManifestSchema,
  ManifestWorkflowsSchema,
  SlackManifestType,
} from "./types.ts";
import { ICustomType } from "./types/types.ts";

export const Manifest = (definition: SlackManifestType) => {
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
      settings: { "function_runtime": this.getFunctionRuntime() },
    } as ManifestSchema;

    if (def.slackHosted === false && def.slackHosted !== undefined) {
      //Settings
      if (def.settings === undefined) {
        manifest.settings = {};
      }
      if (def.settings !== undefined) {
        manifest.settings = def.settings;
      }
      manifest.settings.function_runtime = this.getFunctionRuntime();
      if (def.eventSubscriptions !== undefined) {
        manifest.settings.event_subscriptions = def.eventSubscriptions;
      }
      if (def.socketModeEnabled !== undefined) {
        manifest.settings.socket_mode_enabled = def.socketModeEnabled;
      }
      if (def.tokenRotationEnabled !== undefined) {
        manifest.settings.token_rotation_enabled = def.tokenRotationEnabled;
      }

      //AppDirectory
      if (def.appDirectory !== undefined) {
        manifest.app_directory = def.appDirectory;
      }

      //OauthConfig
      if (def.userScopes !== undefined) {
        manifest.oauth_config.scopes.user = def.userScopes;
      }
      if (def.redirectUrls !== undefined) {
        manifest.oauth_config.redirect_urls = def.redirectUrls;
      }
      if (def.tokenManagementEnabled !== undefined) {
        manifest.oauth_config.token_management_enabled =
          def.tokenManagementEnabled;
      }
      //Features
      if (def.features?.appHome !== undefined) {
        manifest.features.app_home = def.features?.appHome;
      }
      if (def.features?.botUser?.always_online !== undefined) {
        manifest.features.bot_user!.always_online =
          def.features.botUser.always_online;
      }
      if (def.features?.shortcuts !== undefined) {
        manifest.features.shortcuts = def.features?.shortcuts;
      }
      if (def.features?.slashCommands !== undefined) {
        manifest.features.slash_commands = def.features?.slashCommands;
      }
      if (def.features?.unfurlDomains !== undefined) {
        manifest.features.unfurl_domains = def.features?.unfurlDomains;
      }
      if (def.features?.workflowSteps !== undefined) {
        manifest.features.workflow_steps = def.features?.workflowSteps;
      }
    } else {
      manifest.outgoing_domains = def.outgoingDomains || [];
    }

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
      const { messagesTabEnabled, messagesTabReadOnlyEnabled } =
        def.features.appHome;

      if (messagesTabEnabled !== undefined) {
        manifest.features.app_home.messages_tab_enabled = messagesTabEnabled;
      }
      if (messagesTabReadOnlyEnabled !== undefined) {
        manifest.features.app_home.messages_tab_read_only_enabled =
          messagesTabReadOnlyEnabled;
      }
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

  // Maps the slackHosted to function_runtime
  private getFunctionRuntime(): string {
    const slackHosted = this.definition.slackHosted;
    let functionRuntime;
    if (slackHosted === undefined || slackHosted) {
      functionRuntime = "slack";
    } else {
      functionRuntime = "remote";
    }

    return functionRuntime;
  }
}
