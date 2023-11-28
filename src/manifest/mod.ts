import {
  ISlackManifestRemote,
  ISlackManifestRunOnSlack,
  SlackManifestType,
} from "./types.ts";
import { ICustomType } from "../types/types.ts";
import { ParameterSetDefinition } from "../parameters/types.ts";
import {
  ManifestAppHomeMessagesTabSchema,
  ManifestAppHomeSchema,
  ManifestCustomEventsSchema,
  ManifestCustomTypesSchema,
  ManifestDataStoresSchema,
  ManifestFunction,
  ManifestFunctionRuntime,
  ManifestFunctionsSchema,
  ManifestSchema,
  ManifestWidgetSchema,
  ManifestWorkflowsSchema,
} from "./manifest_schema.ts";
import { isCustomType } from "../types/mod.ts";
import { isCustomFunctionDefinition } from "../functions/definitions/slack-function.ts";
import {
  DuplicateCallbackIdError,
  DuplicateNameError,
  DuplicateProviderKeyError,
} from "./errors.ts";

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
      },
      settings: { function_runtime: this.getFunctionRuntime() },
    };

    // Assign other shared properties
    if (def.functions) {
      manifest.functions = def.functions.reduce<ManifestFunctionsSchema>(
        (acc = {}, fn) => {
          if (isCustomFunctionDefinition(fn)) {
            if (fn.id in acc) {
              throw new DuplicateCallbackIdError(fn.id, "Function");
            }
            acc[fn.id] = fn.export();
          }
          return acc;
        },
        {},
      );
    }

    if (def.workflows) {
      manifest.workflows = def.workflows.reduce<ManifestWorkflowsSchema>(
        (acc = {}, workflow) => {
          if (workflow.id in acc) {
            throw new DuplicateCallbackIdError(workflow.id, "Workflow");
          }
          acc[workflow.id] = workflow.export();
          return acc;
        },
        {},
      );
    }

    if (def.types) {
      manifest.types = def.types.reduce<ManifestCustomTypesSchema>(
        (acc = {}, customType) => {
          if (customType.id in acc) {
            throw new DuplicateNameError(customType.id, "CustomType");
          }
          acc[customType.id] = customType.export();
          return acc;
        },
        {},
      );
    }

    if (def.datastores) {
      manifest.datastores = def.datastores.reduce<ManifestDataStoresSchema>(
        (acc = {}, datastore) => {
          if (datastore.name in acc) {
            throw new DuplicateNameError(datastore.name, "Datastore");
          }
          acc[datastore.name] = datastore.export();
          return acc;
        },
        {},
      );
    }

    if (def.events) {
      manifest.events = def.events.reduce<ManifestCustomEventsSchema>(
        (acc = {}, event) => {
          if (event.id in acc) {
            throw new DuplicateNameError(event.id, "CustomEvent");
          }
          acc[event.id] = event.export();
          return acc;
        },
        {},
      );
    }

    if (def.widgets) {
      manifest.widgets = def.widgets?.reduce<ManifestWidgetSchema>(
        (acc = {}, widget) => {
          acc[widget.id] = widget.export();
          return acc;
        },
        {},
      );
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
      if (isCustomFunctionDefinition(func)) {
        func.registerParameterTypes(this);
      }
    });

    // Loop through datastores to automatically register any referenced types
    this.definition.datastores?.forEach((datastore) => {
      datastore.registerAttributeTypes(this);
    });

    // Loop through events to automatically register any referenced types
    this.definition.events?.forEach((event) => {
      event.registerParameterTypes(this);
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
    Object.values(parameterSet).forEach((param) => {
      if (isCustomType(param.type)) {
        this.registerType(param.type);
      }
    });
  }

  registerType(customType: ICustomType) {
    if (!this.definition.types) this.definition.types = [];
    // Don't register Slack types
    if (customType.id.startsWith("slack#/")) {
      return;
    }
    // Check to make sure type doesn't already exist on manifest
    if (this.definition.types.some((type) => type.id === customType.id)) {
      return;
    }
    // Add type to manifest
    this.definition.types.push(customType);
  }

  /**
   * Verifies scopes defined in the app passes baseline validation.
   * @returns {string[]} The user-defined manifest scopes from `definition.botScopes`
   */
  private ensureBotScopes(): string[] {
    // Warn about missing datastore scopes if app includes datastores
    if (Object.keys(this.definition.datastores ?? {}).length > 0) {
      const missingScopes: string[] = [];
      const datastoreScopes = ["datastore:read", "datastore:write"];
      datastoreScopes.forEach((scope) => {
        if (!this.definition.botScopes.includes(scope)) {
          missingScopes.push(scope);
        }
      });
      if (missingScopes.length > 0) {
        console.warn(
          `Warning! Application manifest includes at least one datastore, but does not specify the following datastore-related scopes in its 'botScopes': ${
            missingScopes.join(", ")
          }`,
        );
      }
    }

    return this.definition.botScopes;
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

    // Set app home features
    if (def.features?.appHome) {
      const {
        homeTabEnabled,
        messagesTabEnabled,
        messagesTabReadOnlyEnabled,
      } = def.features.appHome;

      manifest.features.app_home = {
        home_tab_enabled: homeTabEnabled,
        messages_tab_enabled: messagesTabEnabled,
        messages_tab_read_only_enabled: messagesTabReadOnlyEnabled,
      } as ManifestAppHomeSchema;
    }

    // Set org deploy enabled to true unless specified by dev
    // Org deploy enabled is required to use remote functions
    manifest.settings.org_deploy_enabled =
      (def.settings?.org_deploy_enabled !== undefined)
        ? def.settings?.org_deploy_enabled
        : true;

    //AppDirectory
    manifest.app_directory = def.appDirectory;

    //OauthConfig
    manifest.oauth_config.scopes.user = def.userScopes;
    manifest.oauth_config.redirect_urls = def.redirectUrls;

    // Remote-hosted Slack apps manage their own tokens
    manifest.oauth_config.token_management_enabled = true;

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

    // Run on Slack Apps do not manage access tokens
    // This is set by default as false
    manifest.oauth_config.token_management_enabled = false;

    // Required App Settings for run on slack apps
    manifest.settings.org_deploy_enabled = true;

    // App Home
    // Default to messages enabled
    manifest.features.app_home = {
      messages_tab_enabled: true,
      messages_tab_read_only_enabled: true,
    } as ManifestAppHomeMessagesTabSchema;

    // Allow App Home override values if provided in apphome
    if (def.features?.appHome) {
      const {
        messagesTabEnabled,
        messagesTabReadOnlyEnabled,
      } = def.features.appHome;

      manifest.features.app_home.messages_tab_enabled = messagesTabEnabled;
      manifest.features.app_home.messages_tab_read_only_enabled =
        messagesTabReadOnlyEnabled;
    }

    // External Auth providers
    if (def.externalAuthProviders?.length) {
      manifest.external_auth_providers = def.externalAuthProviders.reduce(
        (acc, provider) => {
          acc["oauth2"] = acc["oauth2"] ?? {};
          if (provider.id in acc["oauth2"]) {
            throw new DuplicateProviderKeyError(provider.id, "OAuth2Provider");
          }
          acc["oauth2"][provider.id] = provider.export();
          return acc;
        },
        {} as NonNullable<ManifestSchema["external_auth_providers"]>,
      );
    }
  }
}
