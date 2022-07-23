import {
  ISlackManifestRemote,
  ISlackManifestRunOnSlack,
  SlackManifestType,
} from "./types.ts";
import { Manifest, SlackManifest } from "./mod.ts";
import {
  DefineDatastore,
  DefineFunction,
  DefineOAuth2Provider,
  DefineType,
  Schema,
} from "../mod.ts";
import {
  assert,
  assertEquals,
  assertStrictEquals,
  IsExact,
} from "../dev_deps.ts";

Deno.test("SlackManifestType correctly resolves to a Hosted App when runOnSlack = true", () => {
  const definition: SlackManifestType = {
    runOnSlack: true,
    name: "test",
    description: "description",
    backgroundColor: "#FFF",
    longDescription:
      "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
    displayName: "displayName",
    icon: "icon.png",
    botScopes: ["channels:history", "chat:write", "commands"],
  };
  assert<IsExact<typeof definition, ISlackManifestRunOnSlack>>(true);
  assert<IsExact<typeof definition, ISlackManifestRemote>>(false);
});

Deno.test("SlackManifestType correctly resolves to a Remote App when runOnSlack = false", () => {
  const definition: SlackManifestType = {
    runOnSlack: false,
    name: "test",
    description: "description",
    backgroundColor: "#FFF",
    longDescription:
      "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
    displayName: "displayName",
    icon: "icon.png",
    botScopes: ["channels:history", "chat:write", "commands"],
  };
  assert<IsExact<typeof definition, ISlackManifestRunOnSlack>>(false);
  assert<IsExact<typeof definition, ISlackManifestRemote>>(true);
});

Deno.test("Manifest() sets function_runtime = slack when runOnSlack = true", () => {
  const definition: SlackManifestType = {
    runOnSlack: true,
    name: "test",
    description: "description",
    backgroundColor: "#FFF",
    longDescription:
      "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
    displayName: "displayName",
    icon: "icon.png",
    botScopes: ["channels:history", "chat:write", "commands"],
  };
  const manifest = Manifest(definition);
  assertEquals(manifest.settings.function_runtime, "slack");
});

Deno.test("Manifest() sets function_runtime = remote when runOnSlack = false", () => {
  const definition: SlackManifestType = {
    runOnSlack: false,
    name: "test",
    description: "description",
    backgroundColor: "#FFF",
    longDescription:
      "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
    displayName: "displayName",
    icon: "icon.png",
    botScopes: ["channels:history", "chat:write", "commands"],
  };
  const manifest = Manifest(definition);
  assertEquals(manifest.settings.function_runtime, "remote");
});

Deno.test("Manifest() property mappings", () => {
  const definition: SlackManifestType = {
    runOnSlack: true,
    name: "fear and loathing in las vegas",
    description:
      "fear and loathing in las vegas: a savage journey to the heart of the american dream",
    backgroundColor: "#FFF",
    longDescription:
      "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
    displayName: "fear and loathing",
    icon: "icon.png",
    botScopes: [],
  };
  let manifest = Manifest(definition);

  assertEquals(manifest.display_information, {
    name: definition.name,
    background_color: definition.backgroundColor,
    long_description: definition.longDescription,
    description: definition.description,
  });
  assertStrictEquals(manifest.icon, definition.icon);
  assertStrictEquals(
    manifest.features.bot_user?.display_name,
    definition.displayName,
  );
  assertEquals(manifest.settings.function_runtime, "slack");

  // If display_name is not defined on definition, should fall back to name
  delete definition.displayName;
  manifest = Manifest(definition);
  assertStrictEquals(
    manifest.features.bot_user?.display_name,
    definition.name,
  );
});
// TODO: Re-add test to catch dup datastore names
// TODO: Re-add test for datastore columns

Deno.test("Manifest() automatically registers types used by function input and output parameters", () => {
  const inputTypeId = "test_input_type";
  const outputTypeId = "test_output_type";
  const stringTypeId = "test_string_type";

  const CustomStringType = DefineType({
    name: stringTypeId,
    type: Schema.types.string,
  });

  const CustomInputType = DefineType({
    name: inputTypeId,
    type: CustomStringType,
  });

  const CustomOutputType = DefineType({
    name: outputTypeId,
    type: Schema.types.boolean,
  });

  const Function = DefineFunction(
    {
      callback_id: "test_function",
      title: "Function title",
      source_file: "functions/test_function.ts",
      input_parameters: {
        properties: { aType: { type: CustomInputType } },
        required: [],
      },
      output_parameters: {
        properties: { aType: { type: CustomOutputType } },
        required: [],
      },
    },
  );

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    longDescription: "LongDescription",
    botScopes: [],
    functions: [Function],
  };
  const manifest = Manifest(definition);
  assertEquals(definition.types, [
    CustomInputType,
    CustomOutputType,
    CustomStringType,
  ]);
  assertEquals(manifest.types, {
    [inputTypeId]: CustomInputType.export(),
    [stringTypeId]: CustomStringType.export(),
    [outputTypeId]: CustomOutputType.export(),
  });
});

Deno.test("Manifest() properly converts name to proper key", () => {
  const UsingName = DefineType({
    name: "Using Name",
    type: Schema.types.boolean,
  });

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    longDescription: "LongDescription",
    botScopes: [],
    types: [UsingName],
  };
  const manifest = Manifest(definition);
  assertEquals(manifest.types, { "Using Name": { type: "boolean" } });
});

Deno.test("Manifest() properly converts callback_id to proper key", () => {
  const UsingCallback = DefineType({
    callback_id: "Using Callback",
    type: Schema.types.boolean,
  });

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    longDescription: "LongDescription",
    botScopes: [],
    types: [UsingCallback],
  };
  const manifest = Manifest(definition);
  assertEquals(manifest.types, { "Using Callback": { type: "boolean" } });
});

Deno.test("Manifest() automatically registers types referenced by datastores", () => {
  const stringTypeId = "test_string_type";
  const objectTypeId = "test_object_type";
  const StringType = DefineType({
    name: stringTypeId,
    type: Schema.types.string,
  });

  const ObjectType = DefineType({
    name: objectTypeId,
    type: Schema.types.object,
    properties: {
      aString: { type: StringType },
    },
  });

  const Store = DefineDatastore({
    name: "Test store",
    attributes: {
      aString: { type: "string" },
      aType: { type: ObjectType },
    },
    primary_key: "aString",
  });

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    botScopes: [],
    datastores: [Store],
  };
  const manifest = Manifest(definition);
  assertEquals(definition.types, [ObjectType, StringType]);
  assertEquals(manifest.types, {
    [stringTypeId]: StringType.export(),
    [objectTypeId]: ObjectType.export(),
  });
});

Deno.test("Manifest() automatically registers types referenced by other types", () => {
  const objectTypeId = "test_object_type";
  const stringTypeId = "test_string_type";
  const booleanTypeId = "test_boolean_type";
  const arrayTypeId = "test_array_type";

  const BooleanType = DefineType({
    name: booleanTypeId,
    type: Schema.types.boolean,
  });

  const StringType = DefineType({
    name: stringTypeId,
    type: Schema.types.string,
  });

  const ObjectType = DefineType({
    name: objectTypeId,
    type: Schema.types.object,
    properties: {
      aBoolean: { type: BooleanType },
    },
  });

  const ArrayType = DefineType({
    name: arrayTypeId,
    type: Schema.types.array,
    items: {
      type: StringType,
    },
  });

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    longDescription: "LongDescription",
    botScopes: [],
    types: [ArrayType, ObjectType],
  };
  const manifest = Manifest(definition);

  assertEquals(definition.types, [
    ArrayType,
    ObjectType,
    StringType,
    BooleanType,
  ]);
  assertEquals(manifest.types, {
    [arrayTypeId]: ArrayType.export(),
    [objectTypeId]: ObjectType.export(),
    [stringTypeId]: StringType.export(),
    [booleanTypeId]: BooleanType.export(),
  });
});

Deno.test("Manifest() correctly assigns display_information properties ", () => {
  const definition: SlackManifestType = {
    runOnSlack: false,
    name: "fear and loathing in las vegas",
    description:
      "fear and loathing in las vegas: a savage journey to the heart of the american dream",
    backgroundColor: "#FFF",
    longDescription:
      "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
    displayName: "fear and loathing",
    icon: "icon.png",
    botScopes: ["channels:history", "chat:write", "commands"],
  };

  const manifest = Manifest(definition);

  assertEquals(manifest.display_information, {
    name: definition.name,
    background_color: definition.backgroundColor,
    long_description: definition.longDescription,
    description: definition.description,
  });
  assertStrictEquals(manifest.icon, definition.icon);
  assertStrictEquals(
    manifest.features.bot_user?.display_name,
    definition.displayName,
  );
});

Deno.test("Manifest() correctly assigns app_directory properties", () => {
  const definition: SlackManifestType = {
    runOnSlack: false,
    name: "fear and loathing in las vegas",
    description:
      "fear and loathing in las vegas: a savage journey to the heart of the american dream",
    backgroundColor: "#FFF",
    longDescription:
      "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
    displayName: "fear and loathing",
    icon: "icon.png",
    botScopes: ["channels:history", "chat:write", "commands"],
    appDirectory: {
      app_directory_categories: ["app-directory-test"],
      use_direct_install: true,
      direct_install_url: "https://api.slack.com/",
      installation_landing_page: "https://api.slack.com/",
      privacy_policy_url: "https://api.slack.com/",
      support_url: "https://api.slack.com/",
      support_email: "example@salesfroce.com",
      supported_languages: ["eng", "fr"],
      pricing: "free",
    },
  };
  const manifest = Manifest(definition);
  // app directory
  assertStrictEquals(
    manifest.app_directory,
    definition.appDirectory,
  );
});

Deno.test("Manifest() correctly assigns settings properties", () => {
  const definition: SlackManifestType = {
    runOnSlack: false,
    name: "fear and loathing in las vegas",
    description:
      "fear and loathing in las vegas: a savage journey to the heart of the american dream",
    backgroundColor: "#FFF",
    longDescription:
      "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
    displayName: "fear and loathing",
    icon: "icon.png",
    botScopes: ["channels:history", "chat:write", "commands"],
    settings: {
      "allowed_ip_address_ranges": ["123.89.34.56"],
      "incoming_webhooks": { "incoming_webhooks_enabled": true },
      interactivity: {
        is_enabled: true,
        request_url: "https://app.slack.com/test",
        message_menu_options_url: "https://app.slack.com",
      },
      "org_deploy_enabled": true,
      "siws_links": { initiate_uri: "https://app.slack.com" },
    },
    eventSubscriptions: {
      request_url: "string",
      user_events: ["app_home_opened"],
      bot_events: ["app_home_opened"],
      metadata_subscriptions: [
        {
          app_id: "metadata-test",
          event_type: "customer_created",
        },
      ],
    },
    socketModeEnabled: true,
    tokenRotationEnabled: false,
  };
  const manifest = Manifest(definition);
  assertStrictEquals(
    manifest.settings.socket_mode_enabled,
    definition.socketModeEnabled,
  );
  assertStrictEquals(
    manifest.settings.token_rotation_enabled,
    definition.tokenRotationEnabled,
  );
  assertStrictEquals(
    manifest.settings.event_subscriptions,
    definition.eventSubscriptions,
  );
  assertStrictEquals(
    manifest.settings.allowed_ip_address_ranges,
    definition.settings?.allowed_ip_address_ranges,
  );
  assertStrictEquals(
    manifest.settings.incoming_webhooks,
    definition.settings?.incoming_webhooks,
  );
  assertStrictEquals(
    manifest.settings.org_deploy_enabled,
    definition.settings?.org_deploy_enabled,
  );
  assertStrictEquals(
    manifest.settings.siws_links,
    definition.settings?.siws_links,
  );
  assertStrictEquals(manifest.settings.function_runtime, "remote");
});

Deno.test("Manifest() correctly assigns oauth properties", () => {
  const definition: SlackManifestType = {
    runOnSlack: false,
    name: "fear and loathing in las vegas",
    description:
      "fear and loathing in las vegas: a savage journey to the heart of the american dream",
    backgroundColor: "#FFF",
    longDescription:
      "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
    displayName: "fear and loathing",
    icon: "icon.png",
    botScopes: ["channels:history", "chat:write", "commands"],
    userScopes: ["admin", "calls:read"],
    redirectUrls: ["https://api.slack.com/", "https://app.slack.com/"],
    tokenManagementEnabled: false,
  };
  const manifest = Manifest(definition);
  //oauth
  assertStrictEquals(
    manifest.oauth_config.scopes.user,
    definition.userScopes,
  );
  assertStrictEquals(
    manifest.oauth_config.redirect_urls,
    definition.redirectUrls,
  );
  assertStrictEquals(
    manifest.oauth_config.token_management_enabled,
    definition.tokenManagementEnabled,
  );
});

Deno.test("Manifest() correctly assigns other app features", () => {
  const definition: SlackManifestType = {
    runOnSlack: false,
    name: "fear and loathing in las vegas",
    description:
      "fear and loathing in las vegas: a savage journey to the heart of the american dream",
    backgroundColor: "#FFF",
    longDescription:
      "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
    displayName: "fear and loathing",
    icon: "icon.png",
    botScopes: ["channels:history", "chat:write", "commands"],
    features: {
      botUser: { always_online: false },
      shortcuts: [{
        name: "test-shortcut",
        type: "message",
        callback_id: "callback_id",
        description: "shortcut",
      }],
      appHome: {
        homeTabEnabled: true,
        messagesTabEnabled: false,
        messagesTabReadOnlyEnabled: false,
      },
      slashCommands: [{
        command: "sample-command",
        url: "https://app.slack.com",
        description: "test command",
        usage_hint: "testing",
        should_escape: true,
      }, {
        command: "sample-command2",
        url: "https://app.slack.com",
        description: "test command 2",
        usage_hint: "testing 2",
        should_escape: true,
      }],
      unfurlDomains: ["https://app.slack.com"],
      workflowSteps: [{
        name: "workflow step test",
        callback_id: "workflow-step-test",
      }],
    },
  };
  const manifest = Manifest(definition);

  //features
  assertStrictEquals(
    manifest.features.bot_user?.always_online,
    definition.features?.botUser?.always_online,
  );
  assertStrictEquals(
    manifest.features.shortcuts,
    definition.features?.shortcuts,
  );
  assertStrictEquals(
    manifest.features.slash_commands,
    definition.features?.slashCommands,
  );
  assertEquals(
    manifest.features.app_home?.home_tab_enabled,
    true,
  );
  assertEquals(
    manifest.features.app_home?.messages_tab_enabled,
    false,
  );
  assertEquals(
    manifest.features.app_home?.messages_tab_read_only_enabled,
    false,
  );
  assertStrictEquals(
    manifest.features.unfurl_domains,
    definition.features?.unfurlDomains,
  );
  assertStrictEquals(
    manifest.features.workflow_steps,
    definition.features?.workflowSteps,
  );
});

Deno.test("SlackManifest() registration functions don't allow duplicates", () => {
  const functionId = "test_function";
  const arrayTypeId = "test_array_type";
  const objectTypeId = "test_object_type";
  const stringTypeId = "test_string_type";

  const CustomStringType = DefineType({
    name: stringTypeId,
    type: Schema.types.string,
  });

  const CustomObjectType = DefineType({
    name: objectTypeId,
    type: Schema.types.object,
    properties: {
      aString: {
        type: CustomStringType,
      },
    },
  });

  const CustomArrayType = DefineType({
    name: arrayTypeId,
    type: Schema.types.array,
    items: {
      type: CustomStringType,
    },
  });

  const Func = DefineFunction({
    callback_id: functionId,
    title: "Function title",
    source_file: `functions/${functionId}.ts`,
  });

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    longDescription: "LongDescription",
    botScopes: [],
    functions: [Func],
    types: [CustomArrayType, CustomObjectType],
  };

  const Manifest = new SlackManifest(definition);

  Manifest.registerFunction(Func);
  Manifest.registerFunction(Func);
  Manifest.registerType(CustomObjectType);
  Manifest.registerType(CustomObjectType);
  Manifest.registerType(CustomArrayType);
  Manifest.registerType(CustomStringType);

  const exportedManifest = Manifest.export();

  assertEquals(definition.functions, [Func]);
  assertEquals(exportedManifest.functions, { [functionId]: Func.export() });
  assertEquals(definition.types, [
    CustomArrayType,
    CustomObjectType,
    CustomStringType,
  ]);
  assertEquals(exportedManifest.types, {
    [arrayTypeId]: CustomArrayType.export(),
    [objectTypeId]: CustomObjectType.export(),
    [stringTypeId]: CustomStringType.export(),
  });
});

Deno.test("SlackManifest.export() ensures datastore scopes if they are not present", () => {
  const Store = DefineDatastore({
    name: "test store",
    attributes: {
      attr: {
        type: Schema.types.string,
      },
    },
    primary_key: "attr",
  });

  const definition: SlackManifestType = {
    runOnSlack: true,
    name: "Name",
    description: "Description",
    icon: "icon.png",
    longDescription: "LongDescription",
    botScopes: [],
    datastores: [Store],
  };

  const Manifest = new SlackManifest(definition);
  const exportedManifest = Manifest.export();
  const botScopes = exportedManifest.oauth_config.scopes.bot;
  assertStrictEquals(botScopes?.includes("datastore:read"), true);
  assertStrictEquals(botScopes?.includes("datastore:write"), true);
});

Deno.test("SlackManifest.export() will not duplicate datastore scopes if they're already present", () => {
  const Store = DefineDatastore({
    name: "test store",
    attributes: {
      attr: {
        type: Schema.types.string,
      },
    },
    primary_key: "attr",
  });

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    longDescription: "LongDescription",
    botScopes: ["datastore:read", "datastore:write"],
    datastores: [Store],
  };

  const Manifest = new SlackManifest(definition);
  const exportedManifest = Manifest.export();
  const botScopes = exportedManifest.oauth_config.scopes.bot;
  assertStrictEquals(
    botScopes?.filter((scope: string) => scope === "datastore:read").length,
    1,
  );
  assertStrictEquals(
    botScopes?.filter((scope: string) => scope === "datastore:write").length,
    1,
  );
});

Deno.test("SlackManifest.export() defaults to enabling the read only messages tab", () => {
  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    botScopes: [],
  };

  const Manifest = new SlackManifest(definition);
  const exportedManifest = Manifest.export();
  exportedManifest.features.app_home?.messages_tab_enabled;
  exportedManifest.features.app_home?.messages_tab_read_only_enabled;
  assertStrictEquals(
    exportedManifest.features.app_home?.messages_tab_enabled,
    true,
  );
  assertStrictEquals(
    exportedManifest.features.app_home?.messages_tab_read_only_enabled,
    true,
  );
});

Deno.test("SlackManifest.export() allows overriding app home features", () => {
  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    botScopes: [],
    features: {
      appHome: {
        messagesTabEnabled: false,
        messagesTabReadOnlyEnabled: false,
      },
    },
  };

  const Manifest = new SlackManifest(definition);
  const exportedManifest = Manifest.export();
  exportedManifest.features.app_home?.messages_tab_enabled;
  exportedManifest.features.app_home?.messages_tab_read_only_enabled;
  assertStrictEquals(
    exportedManifest.features.app_home?.messages_tab_enabled,
    false,
  );
  assertStrictEquals(
    exportedManifest.features.app_home?.messages_tab_read_only_enabled,
    false,
  );
});

Deno.test("SlackManifest() oauth2 providers get set properly", () => {
  const providerKey = "test_provider";

  const Provider = DefineOAuth2Provider({
    provider_key: providerKey,
    provider_type: Schema.providers.oauth2.CUSTOM,
    options: {
      "client_id": "123.456",
      "client_secret_env_key": "secret_key",
      "scope": ["scope_a", "scope_b"],
    },
  });

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    botScopes: [],
    externalAuthProviders: [Provider],
  };

  const Manifest = new SlackManifest(definition);
  const exportedManifest = Manifest.export();
  assertEquals(definition.externalAuthProviders, [Provider]);
  assertEquals(exportedManifest.external_auth_providers, {
    "oauth2": { "test_provider": Provider.export() },
  });
});

Deno.test("SlackManifest() oauth2 providers are undefined when not configured", () => {
  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    botScopes: [],
  };

  const Manifest = new SlackManifest(definition);

  const exportedManifest = Manifest.export();

  assertEquals(definition.externalAuthProviders, undefined);
  assertEquals(exportedManifest.external_auth_providers, undefined);
});
