import { BaseResponse, ISlackAPIClient } from "../types.ts";
import { ICustomType } from "../types/types.ts";
import { PrimitiveParameterDefinition } from "../parameters/types.ts";

export type SlackTableColumn = {
  // supports custom types, primitive types, inline objects and lists
  type: string | ICustomType;
  title?: string;
  description?: string;
  items?: PrimitiveParameterDefinition;
  properties?: {
    [key: string]: PrimitiveParameterDefinition;
  };
};

export type SlackTableColumns = Record<string, SlackTableColumn>;

export type SlackTableDefinition<Columns extends SlackTableColumns> = {
  "primary_key": keyof Columns;
  columns: Columns;
};

export interface ISlackTable<Columns extends SlackTableColumns> {
  name: string;
  api: (client: ISlackAPIClient) => ISlackTableApi<Columns>;
  export: () => ManifestTableSchema;
}

export type SlackTableGetResponse<Columns extends SlackTableColumns> =
  & BaseResponse
  & {
    table: string;
    row: SlackTableRow<Columns>;
  };

export type SlackTablePutResponse<Columns extends SlackTableColumns> =
  & BaseResponse
  & {
    table: string;
    row: SlackTableRow<Columns>;
  };

export type SlackTableQueryResponse<Columns extends SlackTableColumns> =
  & BaseResponse
  & {
    table: string;
    rows: SlackTableRow<Columns>[];
  };

export interface ISlackTableApi<Columns extends SlackTableColumns> {
  get(id: string): Promise<SlackTableGetResponse<Columns>>;
  put(
    row: PartialSlackTableRow<Columns>,
  ): Promise<SlackTablePutResponse<Columns>>;
  delete(id: string): Promise<BaseResponse>;
  query(
    query?: Query,
  ): Promise<SlackTableQueryResponse<Columns>>;
}

export type Query = {
  expression?: string;
  "expression_columns"?: Record<string, string>;
  "expression_values"?: Record<string, string>;
  limit?: number;
};

export type SlackTableRow<Columns extends SlackTableColumns> = {
  // TODO: In the future, see if we can map the column.type to
  // the TS type map like functions do w/ parameters
  // deno-lint-ignore no-explicit-any
  [k in keyof Columns]: any;
};

export type PartialSlackTableRow<Columns extends SlackTableColumns> =
  OptionalPartial<Columns>;

export type ManifestTableSchema = {
  "primary_key": string;
  columns: {
    [key: string]: {
      type: string | ICustomType;
      title?: string;
      description?: string;
      items?: PrimitiveParameterDefinition;
      properties?: {
        [key: string]: PrimitiveParameterDefinition;
      };
    };
  };
};

// deno-lint-ignore no-explicit-any
type OptionalPartial<T extends any> = {
  // deno-lint-ignore no-explicit-any
  [P in keyof T]?: any;
};
