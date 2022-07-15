"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dntShim = __importStar(require("../_dnt.test_shims.js"));
const mod_js_1 = require("./mod.js");
const mod_js_2 = require("../mod.js");
const dev_deps_js_1 = require("../dev_deps.js");
dntShim.Deno.test("SlackManifestType correctly resolves to a Hosted App when slackHosted = true", () => {
    const definition = {
        slackHosted: true,
        name: "test",
        description: "description",
        backgroundColor: "#FFF",
        longDescription: "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
        displayName: "displayName",
        icon: "icon.png",
        botScopes: ["channels:history", "chat:write", "commands"],
    };
    (0, dev_deps_js_1.assert)(true);
    (0, dev_deps_js_1.assert)(false);
});
dntShim.Deno.test("SlackManifestType correctly resolves to a Remote App when slackHosted = false", () => {
    const definition = {
        slackHosted: false,
        name: "test",
        description: "description",
        backgroundColor: "#FFF",
        longDescription: "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
        displayName: "displayName",
        icon: "icon.png",
        botScopes: ["channels:history", "chat:write", "commands"],
    };
    (0, dev_deps_js_1.assert)(false);
    (0, dev_deps_js_1.assert)(true);
});
dntShim.Deno.test("Manifest() sets function_runtime = slack when slackHosted = true", () => {
    const definition = {
        slackHosted: true,
        name: "test",
        description: "description",
        backgroundColor: "#FFF",
        longDescription: "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
        displayName: "displayName",
        icon: "icon.png",
        botScopes: ["channels:history", "chat:write", "commands"],
    };
    const manifest = (0, mod_js_1.Manifest)(definition);
    (0, dev_deps_js_1.assertEquals)(manifest.settings.function_runtime, "slack");
});
dntShim.Deno.test("Manifest() sets function_runtime = remote when slackHosted = false", () => {
    const definition = {
        slackHosted: false,
        name: "test",
        description: "description",
        backgroundColor: "#FFF",
        longDescription: "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
        displayName: "displayName",
        icon: "icon.png",
        botScopes: ["channels:history", "chat:write", "commands"],
    };
    const manifest = (0, mod_js_1.Manifest)(definition);
    console.log(manifest.settings);
    (0, dev_deps_js_1.assertEquals)(manifest.settings.function_runtime, "remote");
});
dntShim.Deno.test("Manifest() property mappings", () => {
    const definition = {
        slackHosted: true,
        name: "fear and loathing in las vegas",
        description: "fear and loathing in las vegas: a savage journey to the heart of the american dream",
        backgroundColor: "#FFF",
        longDescription: "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
        displayName: "fear and loathing",
        icon: "icon.png",
        botScopes: [],
    };
    let manifest = (0, mod_js_1.Manifest)(definition);
    (0, dev_deps_js_1.assertEquals)(manifest.display_information, {
        name: definition.name,
        background_color: definition.backgroundColor,
        long_description: definition.longDescription,
        description: definition.description,
    });
    (0, dev_deps_js_1.assertStrictEquals)(manifest.icon, definition.icon);
    (0, dev_deps_js_1.assertStrictEquals)(manifest.features.bot_user?.display_name, definition.displayName);
    (0, dev_deps_js_1.assertEquals)(manifest.settings.function_runtime, "slack");
    // If display_name is not defined on definition, should fall back to name
    delete definition.displayName;
    manifest = (0, mod_js_1.Manifest)(definition);
    (0, dev_deps_js_1.assertStrictEquals)(manifest.features.bot_user?.display_name, definition.name);
});
// TODO: Re-add test to catch dup datastore names
// TODO: Re-add test for datastore columns
dntShim.Deno.test("Manifest() automatically registers types used by function input and output parameters", () => {
    const inputTypeId = "test_input_type";
    const outputTypeId = "test_output_type";
    const stringTypeId = "test_string_type";
    const CustomStringType = (0, mod_js_2.DefineType)({
        name: stringTypeId,
        type: mod_js_2.Schema.types.string,
    });
    const CustomInputType = (0, mod_js_2.DefineType)({
        name: inputTypeId,
        type: CustomStringType,
    });
    const CustomOutputType = (0, mod_js_2.DefineType)({
        name: outputTypeId,
        type: mod_js_2.Schema.types.boolean,
    });
    const Function = (0, mod_js_2.DefineFunction)({
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
    });
    const definition = {
        name: "Name",
        description: "Description",
        icon: "icon.png",
        longDescription: "LongDescription",
        botScopes: [],
        functions: [Function],
    };
    const manifest = (0, mod_js_1.Manifest)(definition);
    (0, dev_deps_js_1.assertEquals)(definition.types, [
        CustomInputType,
        CustomOutputType,
        CustomStringType,
    ]);
    (0, dev_deps_js_1.assertEquals)(manifest.types, {
        [inputTypeId]: CustomInputType.export(),
        [stringTypeId]: CustomStringType.export(),
        [outputTypeId]: CustomOutputType.export(),
    });
});
dntShim.Deno.test("Manifest() properly converts name to proper key", () => {
    const UsingName = (0, mod_js_2.DefineType)({
        name: "Using Name",
        type: mod_js_2.Schema.types.boolean,
    });
    const definition = {
        name: "Name",
        description: "Description",
        icon: "icon.png",
        longDescription: "LongDescription",
        botScopes: [],
        types: [UsingName],
    };
    const manifest = (0, mod_js_1.Manifest)(definition);
    (0, dev_deps_js_1.assertEquals)(manifest.types, { "Using Name": { type: "boolean" } });
});
dntShim.Deno.test("Manifest() properly converts callback_id to proper key", () => {
    const UsingCallback = (0, mod_js_2.DefineType)({
        callback_id: "Using Callback",
        type: mod_js_2.Schema.types.boolean,
    });
    const definition = {
        name: "Name",
        description: "Description",
        icon: "icon.png",
        longDescription: "LongDescription",
        botScopes: [],
        types: [UsingCallback],
    };
    const manifest = (0, mod_js_1.Manifest)(definition);
    (0, dev_deps_js_1.assertEquals)(manifest.types, { "Using Callback": { type: "boolean" } });
});
dntShim.Deno.test("Manifest() automatically registers types referenced by datastores", () => {
    const stringTypeId = "test_string_type";
    const objectTypeId = "test_object_type";
    const StringType = (0, mod_js_2.DefineType)({
        name: stringTypeId,
        type: mod_js_2.Schema.types.string,
    });
    const ObjectType = (0, mod_js_2.DefineType)({
        name: objectTypeId,
        type: mod_js_2.Schema.types.object,
        properties: {
            aString: { type: StringType },
        },
    });
    const Store = (0, mod_js_2.DefineDatastore)({
        name: "Test store",
        attributes: {
            aString: { type: "string" },
            aType: { type: ObjectType },
        },
        primary_key: "aString",
    });
    const definition = {
        name: "Name",
        description: "Description",
        icon: "icon.png",
        botScopes: [],
        datastores: [Store],
    };
    const manifest = (0, mod_js_1.Manifest)(definition);
    (0, dev_deps_js_1.assertEquals)(definition.types, [ObjectType, StringType]);
    (0, dev_deps_js_1.assertEquals)(manifest.types, {
        [stringTypeId]: StringType.export(),
        [objectTypeId]: ObjectType.export(),
    });
});
dntShim.Deno.test("Manifest() automatically registers types referenced by other types", () => {
    const objectTypeId = "test_object_type";
    const stringTypeId = "test_string_type";
    const booleanTypeId = "test_boolean_type";
    const arrayTypeId = "test_array_type";
    const BooleanType = (0, mod_js_2.DefineType)({
        name: booleanTypeId,
        type: mod_js_2.Schema.types.boolean,
    });
    const StringType = (0, mod_js_2.DefineType)({
        name: stringTypeId,
        type: mod_js_2.Schema.types.string,
    });
    const ObjectType = (0, mod_js_2.DefineType)({
        name: objectTypeId,
        type: mod_js_2.Schema.types.object,
        properties: {
            aBoolean: { type: BooleanType },
        },
    });
    const ArrayType = (0, mod_js_2.DefineType)({
        name: arrayTypeId,
        type: mod_js_2.Schema.types.array,
        items: {
            type: StringType,
        },
    });
    const definition = {
        name: "Name",
        description: "Description",
        icon: "icon.png",
        longDescription: "LongDescription",
        botScopes: [],
        types: [ArrayType, ObjectType],
    };
    const manifest = (0, mod_js_1.Manifest)(definition);
    (0, dev_deps_js_1.assertEquals)(definition.types, [
        ArrayType,
        ObjectType,
        StringType,
        BooleanType,
    ]);
    (0, dev_deps_js_1.assertEquals)(manifest.types, {
        [arrayTypeId]: ArrayType.export(),
        [objectTypeId]: ObjectType.export(),
        [stringTypeId]: StringType.export(),
        [booleanTypeId]: BooleanType.export(),
    });
});
dntShim.Deno.test("Manifest() correctly assigns display_information properties ", () => {
    const definition = {
        slackHosted: false,
        name: "fear and loathing in las vegas",
        description: "fear and loathing in las vegas: a savage journey to the heart of the american dream",
        backgroundColor: "#FFF",
        longDescription: "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
        displayName: "fear and loathing",
        icon: "icon.png",
        botScopes: ["channels:history", "chat:write", "commands"],
    };
    const manifest = (0, mod_js_1.Manifest)(definition);
    (0, dev_deps_js_1.assertEquals)(manifest.display_information, {
        name: definition.name,
        background_color: definition.backgroundColor,
        long_description: definition.longDescription,
        description: definition.description,
    });
    (0, dev_deps_js_1.assertStrictEquals)(manifest.icon, definition.icon);
    (0, dev_deps_js_1.assertStrictEquals)(manifest.features.bot_user?.display_name, definition.displayName);
});
dntShim.Deno.test("Manifest() correctly assigns app_directory properties", () => {
    const definition = {
        slackHosted: false,
        name: "fear and loathing in las vegas",
        description: "fear and loathing in las vegas: a savage journey to the heart of the american dream",
        backgroundColor: "#FFF",
        longDescription: "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
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
    const manifest = (0, mod_js_1.Manifest)(definition);
    // app directory
    (0, dev_deps_js_1.assertStrictEquals)(manifest.app_directory, definition.appDirectory);
});
dntShim.Deno.test("Manifest() correctly assigns settings properties", () => {
    const definition = {
        slackHosted: false,
        name: "fear and loathing in las vegas",
        description: "fear and loathing in las vegas: a savage journey to the heart of the american dream",
        backgroundColor: "#FFF",
        longDescription: "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
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
    const manifest = (0, mod_js_1.Manifest)(definition);
    //settings
    (0, dev_deps_js_1.assertStrictEquals)(manifest.settings, definition.settings);
    (0, dev_deps_js_1.assertStrictEquals)(manifest.settings.socket_mode_enabled, definition.socketModeEnabled);
    (0, dev_deps_js_1.assertStrictEquals)(manifest.settings.token_rotation_enabled, definition.tokenRotationEnabled);
    (0, dev_deps_js_1.assertStrictEquals)(manifest.settings.event_subscriptions, definition.eventSubscriptions);
    (0, dev_deps_js_1.assertStrictEquals)(manifest.settings.function_runtime, "remote");
});
dntShim.Deno.test("Manifest() correctly assigns oauth properties", () => {
    const definition = {
        slackHosted: false,
        name: "fear and loathing in las vegas",
        description: "fear and loathing in las vegas: a savage journey to the heart of the american dream",
        backgroundColor: "#FFF",
        longDescription: "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
        displayName: "fear and loathing",
        icon: "icon.png",
        botScopes: ["channels:history", "chat:write", "commands"],
        userScopes: ["admin", "calls:read"],
        redirectUrls: ["https://api.slack.com/", "https://app.slack.com/"],
        tokenManagementEnabled: false,
    };
    const manifest = (0, mod_js_1.Manifest)(definition);
    //oauth
    (0, dev_deps_js_1.assertStrictEquals)(manifest.oauth_config.scopes.user, definition.userScopes);
    (0, dev_deps_js_1.assertStrictEquals)(manifest.oauth_config.redirect_urls, definition.redirectUrls);
    (0, dev_deps_js_1.assertStrictEquals)(manifest.oauth_config.token_management_enabled, definition.tokenManagementEnabled);
});
dntShim.Deno.test("Manifest() correctly assigns other app features", () => {
    const definition = {
        slackHosted: false,
        name: "fear and loathing in las vegas",
        description: "fear and loathing in las vegas: a savage journey to the heart of the american dream",
        backgroundColor: "#FFF",
        longDescription: "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
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
                messages_tab_read_only_enabled: false,
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
    const manifest = (0, mod_js_1.Manifest)(definition);
    //features
    (0, dev_deps_js_1.assertStrictEquals)(manifest.features.bot_user?.always_online, definition.features?.botUser?.always_online);
    (0, dev_deps_js_1.assertStrictEquals)(manifest.features.shortcuts, definition.features?.shortcuts);
    (0, dev_deps_js_1.assertStrictEquals)(manifest.features.slash_commands, definition.features?.slashCommands);
    (0, dev_deps_js_1.assertEquals)(manifest.features.app_home, definition.features?.appHome);
    (0, dev_deps_js_1.assertStrictEquals)(manifest.features.unfurl_domains, definition.features?.unfurlDomains);
    (0, dev_deps_js_1.assertStrictEquals)(manifest.features.workflow_steps, definition.features?.workflowSteps);
});
dntShim.Deno.test("SlackManifest() registration functions don't allow duplicates", () => {
    const functionId = "test_function";
    const arrayTypeId = "test_array_type";
    const objectTypeId = "test_object_type";
    const stringTypeId = "test_string_type";
    const CustomStringType = (0, mod_js_2.DefineType)({
        name: stringTypeId,
        type: mod_js_2.Schema.types.string,
    });
    const CustomObjectType = (0, mod_js_2.DefineType)({
        name: objectTypeId,
        type: mod_js_2.Schema.types.object,
        properties: {
            aString: {
                type: CustomStringType,
            },
        },
    });
    const CustomArrayType = (0, mod_js_2.DefineType)({
        name: arrayTypeId,
        type: mod_js_2.Schema.types.array,
        items: {
            type: CustomStringType,
        },
    });
    const Func = (0, mod_js_2.DefineFunction)({
        callback_id: functionId,
        title: "Function title",
        source_file: `functions/${functionId}.ts`,
    });
    const definition = {
        name: "Name",
        description: "Description",
        icon: "icon.png",
        longDescription: "LongDescription",
        botScopes: [],
        functions: [Func],
        types: [CustomArrayType, CustomObjectType],
    };
    const Manifest = new mod_js_1.SlackManifest(definition);
    Manifest.registerFunction(Func);
    Manifest.registerFunction(Func);
    Manifest.registerType(CustomObjectType);
    Manifest.registerType(CustomObjectType);
    Manifest.registerType(CustomArrayType);
    Manifest.registerType(CustomStringType);
    const exportedManifest = Manifest.export();
    (0, dev_deps_js_1.assertEquals)(definition.functions, [Func]);
    (0, dev_deps_js_1.assertEquals)(exportedManifest.functions, { [functionId]: Func.export() });
    (0, dev_deps_js_1.assertEquals)(definition.types, [
        CustomArrayType,
        CustomObjectType,
        CustomStringType,
    ]);
    (0, dev_deps_js_1.assertEquals)(exportedManifest.types, {
        [arrayTypeId]: CustomArrayType.export(),
        [objectTypeId]: CustomObjectType.export(),
        [stringTypeId]: CustomStringType.export(),
    });
});
dntShim.Deno.test("SlackManifest.export() ensures datastore scopes if they are not present", () => {
    const Store = (0, mod_js_2.DefineDatastore)({
        name: "test store",
        attributes: {
            attr: {
                type: mod_js_2.Schema.types.string,
            },
        },
        primary_key: "attr",
    });
    const definition = {
        slackHosted: true,
        name: "Name",
        description: "Description",
        icon: "icon.png",
        longDescription: "LongDescription",
        botScopes: [],
        datastores: [Store],
    };
    const Manifest = new mod_js_1.SlackManifest(definition);
    const exportedManifest = Manifest.export();
    const botScopes = exportedManifest.oauth_config.scopes.bot;
    (0, dev_deps_js_1.assertStrictEquals)(botScopes?.includes("datastore:read"), true);
    (0, dev_deps_js_1.assertStrictEquals)(botScopes?.includes("datastore:write"), true);
});
dntShim.Deno.test("SlackManifest.export() will not duplicate datastore scopes if they're already present", () => {
    const Store = (0, mod_js_2.DefineDatastore)({
        name: "test store",
        attributes: {
            attr: {
                type: mod_js_2.Schema.types.string,
            },
        },
        primary_key: "attr",
    });
    const definition = {
        name: "Name",
        description: "Description",
        icon: "icon.png",
        longDescription: "LongDescription",
        botScopes: ["datastore:read", "datastore:write"],
        datastores: [Store],
    };
    const Manifest = new mod_js_1.SlackManifest(definition);
    const exportedManifest = Manifest.export();
    const botScopes = exportedManifest.oauth_config.scopes.bot;
    (0, dev_deps_js_1.assertStrictEquals)(botScopes?.filter((scope) => scope === "datastore:read").length, 1);
    (0, dev_deps_js_1.assertStrictEquals)(botScopes?.filter((scope) => scope === "datastore:write").length, 1);
});
dntShim.Deno.test("SlackManifest.export() defaults to enabling the read only messages tab", () => {
    const definition = {
        name: "Name",
        description: "Description",
        icon: "icon.png",
        botScopes: [],
    };
    const Manifest = new mod_js_1.SlackManifest(definition);
    const exportedManifest = Manifest.export();
    exportedManifest.features.app_home?.messages_tab_enabled;
    exportedManifest.features.app_home?.messages_tab_read_only_enabled;
    (0, dev_deps_js_1.assertStrictEquals)(exportedManifest.features.app_home?.messages_tab_enabled, true);
    (0, dev_deps_js_1.assertStrictEquals)(exportedManifest.features.app_home?.messages_tab_read_only_enabled, true);
});
dntShim.Deno.test("SlackManifest.export() allows overriding app home features", () => {
    const definition = {
        name: "Name",
        description: "Description",
        icon: "icon.png",
        botScopes: [],
        features: {
            appHome: {
                messages_tab_enabled: false,
                messages_tab_read_only_enabled: false,
            },
        },
    };
    const Manifest = new mod_js_1.SlackManifest(definition);
    const exportedManifest = Manifest.export();
    exportedManifest.features.app_home?.messages_tab_enabled;
    exportedManifest.features.app_home?.messages_tab_read_only_enabled;
    (0, dev_deps_js_1.assertStrictEquals)(exportedManifest.features.app_home?.messages_tab_enabled, false);
    (0, dev_deps_js_1.assertStrictEquals)(exportedManifest.features.app_home?.messages_tab_read_only_enabled, false);
});
