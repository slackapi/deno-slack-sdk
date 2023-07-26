import {
  ManifestCustomEventSchema,
  ManifestCustomTypeSchema,
  ManifestDatastoreSchema,
  ManifestFunctionSchema,
  ManifestOAuth2ProviderSchema,
  ManifestWorkflowSchema,
} from "./manifest_schema.ts";

export function createDuplicateWorkflowError(options: {
  id: string;
  current: ManifestWorkflowSchema;
  old: ManifestWorkflowSchema;
}) {
  const stringifySimpleSchema = (schema: ManifestWorkflowSchema) =>
    JSON.stringify(
      {
        title: schema.title ?? "",
        description: schema.description ?? "",
      },
      null,
      1,
    );
  return Error([
    `Duplicate callback_id: "${options.id}" for Workflow`,
    stringifySimpleSchema(options.current),
    "---",
    stringifySimpleSchema(options.old),
  ].join("\n"));
}

export function createDuplicateFunctionError(options: {
  id: string;
  current: ManifestFunctionSchema;
  old: ManifestFunctionSchema;
}) {
  const stringifySimpleSchema = (schema: ManifestFunctionSchema) =>
    JSON.stringify(
      {
        title: schema.title ?? "",
        description: schema.description ?? "",
        source_file: schema.source_file,
      },
      null,
      1,
    );
  return Error([
    `Duplicate callback_id: "${options.id}" for Function`,
    stringifySimpleSchema(options.current),
    "---",
    stringifySimpleSchema(options.old),
  ].join("\n"));
}

export function createDuplicateCustomTypeError(options: {
  id: string;
  current: ManifestCustomTypeSchema;
  old: ManifestCustomTypeSchema;
}) {
  const stringifySimpleSchema = (schema: ManifestCustomTypeSchema) =>
    JSON.stringify(
      {
        type: schema.type,
        title: schema.title ?? "",
        description: schema.description ?? "",
      },
      null,
      1,
    );
  return Error([
    `Duplicate name: "${options.id}" for CustomType`,
    stringifySimpleSchema(options.current),
    "---",
    stringifySimpleSchema(options.old),
  ].join("\n"));
}

export function createDuplicateDataStoreError(options: {
  name: string;
  current: ManifestDatastoreSchema;
  old: ManifestDatastoreSchema;
}) {
  const stringifySimpleSchema = (schema: ManifestDatastoreSchema) =>
    JSON.stringify(
      {
        primary_key: schema.primary_key,
        attributes: Object.keys(schema.attributes),
      },
    );
  return Error([
    `Duplicate name: "${options.name}" for DataStore`,
    stringifySimpleSchema(options.current),
    "---",
    stringifySimpleSchema(options.old),
  ].join("\n"));
}

export function createDuplicateCustomEventError(options: {
  id: string;
  current: ManifestCustomEventSchema;
  old: ManifestCustomEventSchema;
}) {
  const stringifySimpleSchema = (schema: ManifestCustomEventSchema) =>
    JSON.stringify(
      {
        type: schema.type,
        title: schema.title ?? "",
        description: schema.description ?? "",
      },
      null,
      1,
    );
  return Error([
    `Duplicate name: "${options.id}" for CustomEvent`,
    stringifySimpleSchema(options.current),
    "---",
    stringifySimpleSchema(options.old),
  ].join("\n"));
}

export function createDuplicateProviderError(options: {
  id: string;
  current: ManifestOAuth2ProviderSchema;
  old: ManifestOAuth2ProviderSchema;
}) {
  const stringifySimpleSchema = (schema: ManifestOAuth2ProviderSchema) =>
    JSON.stringify(
      {
        provider_type: schema.provider_type,
        options: Object.keys(schema.options),
      },
    );
  return Error([
    `Duplicate provider_key: "${options.id}" for OAuth2Provider`,
    stringifySimpleSchema(options.current),
    "---",
    stringifySimpleSchema(options.old),
  ].join("\n"));
}
