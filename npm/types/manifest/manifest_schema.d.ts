import { ISlackDatastore } from "../datastore/types.js";
import { ISlackFunction } from "../functions/types.js";
import type { ParameterDefinition, ParameterSetDefinition } from "../parameters/mod.js";
import { OAuth2ProviderTypeValues } from "../schema/providers/oauth2/types.js";
import type { ICustomType } from "../types/types.js";
import { ISlackWorkflow } from "../workflows/types.js";
export declare type ManifestSchema = {
    _metadata?: ManifestMetadataSchema;
    settings: ManifestSettingsSchema;
    app_directory?: ManifestAppDirectorySchema;
    display_information: ManifestDisplayInformationSchema;
    icon: string;
    oauth_config: ManifestOauthConfigSchema;
    features: ManifestFeaturesSchema;
    functions?: ManifestFunctionsSchema;
    workflows?: ManifestWorkflowsSchema;
    outgoing_domains?: string[];
    types?: ManifestCustomTypesSchema;
    datastores?: ManifestDataStoresSchema;
    external_auth_providers?: ManifestExternalAuthProviders;
};
export declare type ManifestMetadataSchema = {
    major_version?: number;
    minor_version?: number;
};
export declare type ManifestSettingsSchema = {
    allowed_ip_address_ranges?: [string, ...string[]];
    event_subscriptions?: ManifestEventSubscriptionsSchema;
    incoming_webhooks?: ManifestIncomingWebhooks;
    interactivity?: ManifestInteractivitySchema;
    org_deploy_enabled?: boolean;
    socket_mode_enabled?: boolean;
    token_rotation_enabled?: boolean;
    siws_links?: ManifestSiwsLinksSchema;
    function_runtime?: ManifestFunctionRuntime;
};
export declare type ManifestEventSubscriptionsSchema = {
    request_url?: string;
    user_events?: string[];
    bot_events?: string[];
    metadata_subscriptions?: [
        {
            app_id: string;
            event_type: string;
        },
        ...{
            app_id: string;
            event_type: string;
        }[]
    ];
};
export declare type ManifestIncomingWebhooks = {
    incoming_webhooks_enabled?: boolean;
};
export declare type ManifestInteractivitySchema = {
    is_enabled: boolean;
    request_url?: string;
    message_menu_options_url?: string;
};
export declare type ManifestSiwsLinksSchema = {
    initiate_uri?: string;
};
export declare type ManifestFunctionRuntime = "slack" | "remote" | "local";
export declare type ManifestAppDirectorySchema = {
    app_directory_categories?: string[];
    use_direct_install?: boolean;
    direct_install_url?: string;
    installation_landing_page: string;
    privacy_policy_url: string;
    support_url: string;
    support_email: string;
    supported_languages: [string, ...string[]];
    pricing: string;
};
export declare type ManifestDisplayInformationSchema = {
    name: string;
    description?: string;
    background_color?: string;
    long_description?: string;
};
export declare type ManifestOauthConfigSchema = {
    scopes: {
        bot?: string[];
        user?: string[];
    };
    redirect_urls?: string[];
    token_management_enabled?: boolean;
};
export interface ManifestFeaturesSchema {
    bot_user?: ManifestBotUserSchema;
    app_home: ManifestAppHomeSchema;
    shortcuts?: ManifestShortcutsSchema;
    slash_commands?: ManifestSlashCommandsSchema;
    unfurl_domains?: ManifestUnfurlDomainsSchema;
    workflow_steps?: ManifestWorkflowStepsSchemaLegacy;
}
export declare type ManifestBotUserSchema = {
    display_name: string;
    always_online?: boolean;
};
export declare type ManifestAppHomeSchema = AppHomeMessagesTab & {
    home_tab_enabled?: boolean;
};
declare type AppHomeMessagesTab = {
    /** @default true */
    messages_tab_enabled?: true;
    /** @default true */
    messages_tab_read_only_enabled?: boolean;
} | {
    /** @default true */
    messages_tab_enabled: false;
    /** @default true */
    messages_tab_read_only_enabled: false;
};
export declare type ManifestShortcutSchema = {
    name: string;
    type: "message" | "global";
    callback_id: string;
    description: string;
};
export declare type ManifestShortcutsSchema = PopulatedArray<ManifestShortcutSchema>;
export declare type ManifestSlashCommandsSchema = PopulatedArray<ManifestSlashCommandSchema>;
export declare type ManifestSlashCommandSchema = {
    command: string;
    url?: string;
    description: string;
    usage_hint?: string;
    should_escape?: boolean;
};
export declare type ManifestWorkflowStepLegacy = {
    name: string;
    callback_id: string;
};
export declare type ManifestWorkflowStepsSchemaLegacy = PopulatedArray<ManifestWorkflowStepLegacy>;
export declare type ManifestUnfurlDomainsSchema = [string, ...string[]];
export declare type ManifestFunction = ISlackFunction<any, any, any, any>;
export declare type ManifestFunctionsSchema = {
    [key: string]: ManifestFunctionSchema;
};
export declare type ManifestFunctionSchema = {
    title?: string;
    description?: string;
    source_file: string;
    input_parameters: ManifestFunctionParameters;
    output_parameters: ManifestFunctionParameters;
};
export declare type ManifestFunctionParameters = {
    required?: RequiredParameters;
    properties: ParameterSetDefinition;
};
export declare type RequiredParameters = {
    [index: number]: string | number | symbol;
};
export declare type ManifestWorkflow = ISlackWorkflow;
export declare type ManifestWorkflowsSchema = {
    [key: string]: ManifestWorkflowSchema;
};
export declare type ManifestWorkflowSchema = {
    title?: string;
    description?: string;
    input_parameters?: ManifestFunctionParameters;
    steps: ManifestWorkflowStepSchema[];
};
export declare type ManifestWorkflowStepSchema = {
    id: string;
    function_id: string;
    inputs: {
        [name: string]: unknown;
    };
};
export declare type ManifestCustomTypeSchema = ParameterDefinition;
export declare type ManifestCustomTypesSchema = {
    [key: string]: ManifestCustomTypeSchema;
};
export declare type ManifestDatastore = ISlackDatastore;
export declare type ManifestDatastoreSchema = {
    primary_key: string;
    attributes: {
        [key: string]: {
            type: string | ICustomType;
            items?: ManifestCustomTypeSchema;
            properties?: {
                [key: string]: ManifestCustomTypeSchema;
            };
        };
    };
};
export declare type ManifestDataStoresSchema = {
    [key: string]: ManifestDatastoreSchema;
};
export declare type ManifestOAuth2Schema = {
    [key: string]: ManifestOAuth2ProviderSchema;
};
export declare type ManifestOAuth2ProviderSchema = {
    provider_type: OAuth2ProviderTypeValues;
    options: {
        [key: string]: any;
    };
};
export interface ManifestExternalAuthProviders {
    oauth2?: ManifestOAuth2Schema;
}
export declare type PopulatedArray<T> = [T, ...T[]];
export {};
