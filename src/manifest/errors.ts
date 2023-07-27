import {
  ManifestCustomEventSchema,
  ManifestCustomTypeSchema,
  ManifestDatastoreSchema,
  ManifestFunctionSchema,
  ManifestOAuth2ProviderSchema,
  ManifestWorkflowSchema,
} from "./manifest_schema.ts";

interface CompareRow {
  key: string;
  current: string;
  old: string;
}

class CompareTable<T extends Record<string, string>> {
  current = "current";
  old = "old";
  keyPad = 0;
  currentPad = 0;
  oldPad = 0;

  public rows: CompareRow[] = [];

  constructor(current: T, old: T) {
    for (const key in current) {
      this.push({ key, current: current[key], old: old[key] });
    }
  }

  push(row: CompareRow): number {
    this.keyPad = this.keyPad > row.key.length ? this.keyPad : row.key.length;
    this.currentPad = this.currentPad > row.current.length
      ? this.currentPad
      : row.current.length;
    this.oldPad = this.oldPad > row.old.length ? this.oldPad : row.old.length;
    return this.rows.push(row);
  }

  stringifyRow(row: CompareRow): string {
    return `|${row.key.padEnd(this.keyPad)}|${
      row.current.padEnd(this.currentPad)
    }|${row.old.padEnd(this.oldPad)}|`;
  }

  horizontalRule(): string {
    return `|${"-".repeat(this.keyPad)}-${"-".repeat(this.currentPad)}-${
      "-".repeat(this.oldPad)
    }|`;
  }

  stringify() {
    const table: string[] = [
      this.horizontalRule(),
      this.stringifyRow({ key: "", current: this.current, old: this.old }),
      this.stringifyRow({
        key: "-".repeat(this.keyPad),
        current: "-".repeat(this.currentPad),
        old: "-".repeat(this.oldPad),
      }),
    ];
    this.rows.forEach((row: CompareRow) => {
      table.push(this.stringifyRow(row));
    });
    table.push(this.horizontalRule());
    return table.join("\n");
  }
}

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
    const compareTable = new CompareTable(
      DuplicateWorkflowError.simpleSchema(current),
      DuplicateWorkflowError.simpleSchema(old),
    );
    console.table(buildCompareTable(
      DuplicateWorkflowError.simpleSchema(current),
      DuplicateWorkflowError.simpleSchema(old),
    ));
    super([
      `Duplicate callback_id: "${id}" for Workflow`,
      compareTable.stringify(),
    ].join("\n"));
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
