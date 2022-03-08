import {
  ISlackTableApi,
  PartialSlackTableRow,
  Query,
  SlackTableColumns,
  SlackTableDefinition,
  SlackTableGetResponse,
  SlackTablePutResponse,
  SlackTableQueryResponse,
} from "./types.ts";
import { BaseResponse, ISlackAPIClient } from "../types.ts";

export class SlackTableApi<Columns extends SlackTableColumns>
  implements ISlackTableApi<Columns> {
  private client: ISlackAPIClient;
  private name: string;
  private definition: SlackTableDefinition<Columns>;

  constructor(
    client: ISlackAPIClient,
    name: string,
    definition: SlackTableDefinition<Columns>,
  ) {
    this.client = client;
    this.name = name;
    this.definition = definition;
  }

  async get(id: string): Promise<SlackTableGetResponse<Columns>> {
    const resp = await this.client.call("apps.hosted.tables.getRow", {
      table: this.name,
      [this.definition.primary_key]: id,
    });

    return resp as SlackTableGetResponse<Columns>;
  }

  async put(
    row: PartialSlackTableRow<Columns>,
  ): Promise<SlackTablePutResponse<Columns>> {
    const resp = await this.client.call("apps.hosted.tables.putRow", {
      table: this.name,
      row,
    });

    return resp as SlackTablePutResponse<Columns>;
  }

  async delete(id: string): Promise<BaseResponse> {
    return await this.client.call("apps.hosted.tables.deleteRow", {
      table: this.name,
      [this.definition.primary_key]: id,
    });
  }

  async query(
    query?: Query,
  ): Promise<SlackTableQueryResponse<Columns>> {
    const resp = await this.client.call(
      "apps.hosted.tables.query",
      this.buildQuery(query),
    );

    return resp as SlackTableQueryResponse<Columns>;
  }

  buildQuery(query?: Query): queryPayload {
    const q: queryPayload = {
      table: this.name,
    };

    if (query) {
      if (query.limit) {
        q.limit = query.limit;
      }

      if (query.expression !== "") {
        q.expression = query.expression;
        q.expression_columns = query.expression_columns;
        q.expression_values = query.expression_values;
      }
    }
    return q;
  }
}

type queryPayload = {
  table: string;
  expression?: string;
  "expression_columns"?: Record<string, string>;
  "expression_values"?: Record<string, string>;
  limit?: number;
};
