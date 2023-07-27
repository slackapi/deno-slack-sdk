import {
  ManifestCustomEventSchema,
  ManifestCustomTypeSchema,
  ManifestDatastoreSchema,
  ManifestFunctionSchema,
  ManifestOAuth2ProviderSchema,
  ManifestWorkflowSchema,
} from "./manifest_schema.ts";

function buildCompareTable<T extends Record<string, string>>(
  current: T,
  old: T,
): Record<string, Record<string, string>> {
  const compareTable: Record<string, Record<string, string>> = {};
  for (const key in current) {
    compareTable[key] = {
      current: current[key],
      old: old[key],
    };
  }
  return compareTable;
}

export class DuplicateWorkflowError extends Error {
  static simpleSchema = (schema: ManifestWorkflowSchema) => {
    return {
      title: schema.title ?? "",
      description: schema.description ?? "",
    };
  };

  constructor(
    id: string,
    current: ManifestWorkflowSchema,
    old: ManifestWorkflowSchema,
  ) {
    console.table(buildCompareTable(
      DuplicateWorkflowError.simpleSchema(current),
      DuplicateWorkflowError.simpleSchema(old),
    ));
    super(`Duplicate callback_id: "${id}" for Workflow`);
  }
}

export class DuplicateFunctionError extends Error {
  static stringifySimpleSchema = (schema: ManifestFunctionSchema) =>
    JSON.stringify(
      {
        title: schema.title ?? "",
        description: schema.description ?? "",
        source_file: schema.source_file,
      },
      null,
      1,
    );

  constructor(
    id: string,
    current: ManifestFunctionSchema,
    old: ManifestFunctionSchema,
  ) {
    super([
      `Duplicate callback_id: "${id}" for Function`,
      DuplicateFunctionError.stringifySimpleSchema(current),
      "---",
      DuplicateFunctionError.stringifySimpleSchema(old),
    ].join("\n"));
  }
}

export class DuplicateCustomTypeError extends Error {
  static stringifySimpleSchema = (schema: ManifestCustomTypeSchema) =>
    JSON.stringify(
      {
        type: schema.type,
        title: schema.title ?? "",
        description: schema.description ?? "",
      },
      null,
      1,
    );

  constructor(
    id: string,
    current: ManifestCustomTypeSchema,
    old: ManifestCustomTypeSchema,
  ) {
    super([
      `Duplicate name: "${id}" for CustomType`,
      DuplicateCustomTypeError.stringifySimpleSchema(current),
      "---",
      DuplicateCustomTypeError.stringifySimpleSchema(old),
    ].join("\n"));
  }
}

export class DuplicateDatastoreError extends Error {
  static stringifySimpleSchema = (schema: ManifestDatastoreSchema) =>
    JSON.stringify(
      {
        primary_key: schema.primary_key,
        attributes: Object.keys(schema.attributes),
      },
    );

  constructor(
    name: string,
    current: ManifestDatastoreSchema,
    old: ManifestDatastoreSchema,
  ) {
    super([
      `Duplicate name: "${name}" for Datastore`,
      DuplicateDatastoreError.stringifySimpleSchema(current),
      "---",
      DuplicateDatastoreError.stringifySimpleSchema(old),
    ].join("\n"));
  }
}

export class DuplicateCustomEventError extends Error {
  static stringifySimpleSchema = (schema: ManifestCustomEventSchema) =>
    JSON.stringify(
      {
        type: schema.type,
        title: schema.title ?? "",
        description: schema.description ?? "",
      },
      null,
      1,
    );

  constructor(
    id: string,
    current: ManifestCustomEventSchema,
    old: ManifestCustomEventSchema,
  ) {
    super([
      `Duplicate name: "${id}" for CustomEvent`,
      DuplicateCustomEventError.stringifySimpleSchema(current),
      "---",
      DuplicateCustomEventError.stringifySimpleSchema(old),
    ].join("\n"));
  }
}

export class DuplicateProviderError extends Error {
  static stringifySimpleSchema = (schema: ManifestOAuth2ProviderSchema) =>
    JSON.stringify(
      {
        provider_type: schema.provider_type,
        provider_name: schema.options.provider_name ?? "",
        authorization_url: schema.options.authorization_url ?? "",
      },
      null,
      1,
    );

  constructor(
    id: string,
    current: ManifestOAuth2ProviderSchema,
    old: ManifestOAuth2ProviderSchema,
  ) {
    super([
      `Duplicate provider_key: "${id}" for OAuth2Provider`,
      DuplicateProviderError.stringifySimpleSchema(current),
      "---",
      DuplicateProviderError.stringifySimpleSchema(old),
    ].join("\n"));
  }
}
