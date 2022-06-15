import { SlackManifestType } from "./types.ts";

import { Manifest, SlackManifest } from "./manifest.ts";
import { DefineDatastore, DefineFunction, DefineType, Schema } from "./mod.ts";
import { assertEquals, assertStrictEquals } from "./dev_deps.ts";

Deno.test("Manifest() property mappings", () => {
  const definition: SlackManifestType = {
    slackHosted: true,
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
    callback_id: stringTypeId,
    type: Schema.types.string,
  });

  const CustomInputType = DefineType({
    callback_id: inputTypeId,
    type: CustomStringType,
  });

  const CustomOutputType = DefineType({
    callback_id: outputTypeId,
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

Deno.test("Manifest() automatically registers types referenced by datastores", () => {
  const stringTypeId = "test_string_type";
  const StringType = DefineType({
    callback_id: stringTypeId,
    type: Schema.types.string,
  });

  const Store = DefineDatastore({
    name: "Test store",
    attributes: {
      aString: { type: StringType },
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
  assertEquals(definition.types, [StringType]);
  assertEquals(manifest.types, { [stringTypeId]: StringType.export() });
});

Deno.test("Manifest() automatically registers types referenced by other types", () => {
  // const objectTypeId = "test_object_type";
  const stringTypeId = "test_string_type";
  const booleanTypeId = "test_boolean_type";
  const arrayTypeId = "test_array_type";
  const customTypeId = "test_custom_type";

  const BooleanType = DefineType({
    callback_id: booleanTypeId,
    type: Schema.types.boolean,
  });

  const StringType = DefineType({
    callback_id: stringTypeId,
    type: Schema.types.string,
  });

  const CustomType = DefineType({
    callback_id: customTypeId,
    type: BooleanType,
  });

  // const ObjectType = DefineType(objectTypeId, {
  //   type: Schema.types.object,
  //   properties: {
  //     aString: { type: StringType },
  //   },
  // });

  const ArrayType = DefineType({
    callback_id: arrayTypeId,
    type: Schema.types.array,
    items: {
      // type: ObjectType,
      type: StringType,
    },
  });

  const definition: SlackManifestType = {
    name: "Name",
    description: "Description",
    icon: "icon.png",
    longDescription: "LongDescription",
    botScopes: [],
    types: [ArrayType, CustomType],
  };
  const manifest = Manifest(definition);

  assertEquals(definition.types, [
    ArrayType,
    CustomType,
    StringType,
    // ObjectType,
    BooleanType,
  ]);
  assertEquals(manifest.types, {
    [arrayTypeId]: ArrayType.export(),
    [customTypeId]: CustomType.export(),
    // [objectTypeId]: ObjectType.export(),
    [stringTypeId]: StringType.export(),
    [booleanTypeId]: BooleanType.export(),
  });
});

Deno.test("SlackManifest() registration functions don't allow duplicates", () => {
  const functionId = "test_function";
  const arrayTypeId = "test_array_type";
  // const objectTypeId = "test_object_type";
  const stringTypeId = "test_string_type";

  const CustomStringType = DefineType({
    callback_id: stringTypeId,
    type: Schema.types.string,
  });

  // const CustomObjectType = DefineType({
  //   callback_id: objectTypeId,
  //   type: Schema.types.object,
  //   properties: {
  //     aString: {
  //       type: CustomStringType,
  //     },
  //   },
  // });

  const CustomArrayType = DefineType({
    callback_id: arrayTypeId,
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
    types: [CustomArrayType],
    // types: [CustomObjectType],
  };

  const Manifest = new SlackManifest(definition);

  Manifest.registerFunction(Func);
  Manifest.registerFunction(Func);
  // Manifest.registerType(CustomObjectType);
  // Manifest.registerType(CustomObjectType);
  Manifest.registerType(CustomArrayType);
  Manifest.registerType(CustomStringType);

  const exportedManifest = Manifest.export();

  assertEquals(definition.functions, [Func]);
  assertEquals(exportedManifest.functions, { [functionId]: Func.export() });
  assertEquals(definition.types, [CustomArrayType, CustomStringType]);
  assertEquals(exportedManifest.types, {
    [arrayTypeId]: CustomArrayType.export(),
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
    slackHosted: true,
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
    botScopes?.filter((scope) => scope === "datastore:read").length,
    1,
  );
  assertStrictEquals(
    botScopes?.filter((scope) => scope === "datastore:write").length,
    1,
  );
});

Deno.test("Manifest() property mappings for remote manifest", () => {
  const definition: SlackManifestType = {
    slackHosted: false,
    name: "fear and loathing in las vegas",
    description:
      "fear and loathing in las vegas: a savage journey to the heart of the american dream",
    backgroundColor: "#FFF",
    longDescription:
      "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
    displayName: "fear and loathing",
    icon: "icon.png",
    botScopes: [],
    features: {
      botUser: { always_online: false },
      shortcuts: [{
        name: "test-shortcut",
        type: "message",
        callback_id: "callback_id",
        description: "shortcut",
      }],
    },
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
  assertStrictEquals(
    manifest.features.bot_user?.always_online,
    definition.features?.botUser?.always_online,
  );
  assertStrictEquals(
    manifest.features.shortcuts,
    definition.features?.shortcuts,
  );
  assertEquals(manifest.settings.function_runtime, "remote");
});

Deno.test("Manifest() property mappings fo expanded types in the remote manifest", () => {
  const definition: SlackManifestType = {
    slackHosted: false,
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
        home_tab_enabled: true,
        messages_tab_enabled: false,
        messages_tab_read_only_enabled: true,
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
    settings: {
      "allowed_ip_address_ranges": ["123.89.34.56"],
      "incoming_webhooks": true,
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
    userScopes: ["admin", "calls:read"],
    redirectUrls: ["https://api.slack.com/", "https://app.slack.com/"],
    tokenManagementEnabled: false,
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
  assertStrictEquals(
    manifest.features.app_home,
    definition.features?.appHome,
  );
  assertStrictEquals(
    manifest.features.unfurl_domains,
    definition.features?.unfurlDomains,
  );
  assertStrictEquals(
    manifest.features.workflow_steps,
    definition.features?.workflowSteps,
  );
  // app directory
  assertStrictEquals(
    manifest.app_directory,
    definition.appDirectory,
  );
  //settings
  assertStrictEquals(
    manifest.settings,
    definition.settings,
  );
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

  assertStrictEquals(manifest.settings.function_runtime, "remote");
});
