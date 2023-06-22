const SchemaTypes = {
  string: "string",
  boolean: "boolean",
  integer: "integer",
  number: "number",
  object: "object",
  array: "array",
} as const;

export type ValidSchemaTypes = typeof SchemaTypes[keyof typeof SchemaTypes];

export default SchemaTypes;
