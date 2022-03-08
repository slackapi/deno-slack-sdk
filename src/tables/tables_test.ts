import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { DefineTable } from "./mod.ts";
import { BaseResponse } from "../types.ts";
import SchemaTypes from "../schema/schema_types.ts";
import { DefineType } from "../types/mod.ts";

export class SlackAPIClientStub {
  private result: BaseResponse = { ok: true };

  constructor(result: BaseResponse = { ok: true }) {
    this.result = result;
  }

  setResult(result: BaseResponse) {
    this.result = result;
  }

  async call(
    _method: string,
    _data: Record<string, unknown>,
  ): Promise<BaseResponse> {
    return await this.result;
  }
  async response(
    _method: string,
    _data: Record<string, unknown>,
  ): Promise<BaseResponse> {
    return await { ok: true };
  }
}

const customType = DefineType("custom_type", {
  type: SchemaTypes.object,
  properties: {
    id: {
      type: SchemaTypes.string,
    },
    user_id: {
      type: SchemaTypes.string,
    },
  },
});

const TestTable = DefineTable("test", {
  primary_key: "id",
  columns: {
    id: { type: "string" },
    mrstring: { type: "string" },
    mrcustom: { type: customType },
    mrlist: {
      type: SchemaTypes.array,
      items: { type: SchemaTypes.integer },
    },
  },
});

const err = "query error";

Deno.test("put returns ok", async () => {
  const expRow = {
    id: "1234",
    mrstring: "hello",
    mrcustom: { id: "345", user_id: "456" },
    mrlist: [1, 2, 3],
  };
  const client = new SlackAPIClientStub({
    ok: true,
    row: expRow,
  });
  const tables = TestTable.api(client);

  const resp = await tables.put(expRow);
  assertEquals(resp.ok, true);
  assertEquals(resp.row, expRow);
});

Deno.test("put returns ok false and error if error", async () => {
  const client = new SlackAPIClientStub({
    ok: false,
    error: err,
  });
  const tables = TestTable.api(client);

  const resp = await tables.put({ id: "1234", mrstring: "hello" });
  assertEquals(resp.ok, false);
  assertEquals(resp.error, err);
});

Deno.test("get returns ok", async () => {
  const expRow = {
    id: "1234",
    mrstring: "hello",
    mrcustom: { id: "345", user_id: "456" },
    mrlist: [1, 2, 3],
  };
  const client = new SlackAPIClientStub({
    ok: true,
    row: expRow,
  });
  const tables = TestTable.api(client);

  const resp = await tables.get("1234");
  assertEquals(resp.ok, true);
  assertEquals(resp.row, expRow);
});

Deno.test("get returns ok false and error if error", async () => {
  const client = new SlackAPIClientStub({
    ok: false,
    error: err,
  });
  const tables = TestTable.api(client);

  const resp = await tables.get("1234");
  assertEquals(resp.ok, false);
  assertEquals(resp.error, err);
});

Deno.test("delete returns ok", async () => {
  const expRow = { id: "1234", mrstring: "hello" };
  const client = new SlackAPIClientStub({
    ok: true,
    row: expRow,
  });
  const tables = TestTable.api(client);

  const resp = await tables.delete("1234");
  assertEquals(resp.ok, true);
});

Deno.test("delete returns ok false and error if error", async () => {
  const client = new SlackAPIClientStub({
    ok: false,
    error: err,
  });
  const tables = TestTable.api(client);

  const resp = await tables.delete("1234");
  assertEquals(resp.ok, false);
  assertEquals(resp.error, err);
});

Deno.test("query returns ok", async () => {
  const expRows = [{
    id: "1234",
    mrstring: "hello",
    mrcustom: { id: "345", user_id: "456" },
    mrlist: [1, 2, 3],
  }, {
    id: "1234",
    mrstring: "is it me you're looking for?",
    mrcustom: { id: "567", user_id: "897" },
    mrlist: [4, 5, 6],
  }];
  const client = new SlackAPIClientStub({
    ok: true,
    rows: expRows,
  });
  const tables = TestTable.api(client);

  const resp = await tables.query();
  assertEquals(resp.ok, true);
  assertEquals(resp.rows, expRows);
});

Deno.test("query returns ok false and error if error", async () => {
  const client = new SlackAPIClientStub({
    ok: false,
    error: err,
  });
  const tables = TestTable.api(client);

  const resp = await tables.query();
  assertEquals(resp.ok, false);
  assertEquals(resp.error, err);
});

Deno.test("query payload is built correctly", async () => {
  const client = new SlackAPIClientStub({ ok: true });
  const tables = TestTable.api(client);

  const expressionless = await tables.buildQuery();
  assertEquals(expressionless, { table: "test" });

  const limit = await tables.buildQuery({ limit: 5 });
  JSON.stringify(limit);
  assertEquals(limit, {
    table: "test",
    limit: 5,
    expression: undefined,
    expression_columns: undefined,
    expression_values: undefined,
  });

  const expression = await tables.buildQuery({
    expression: "#c = :c",
    expression_columns: { "#c": "c" },
    expression_values: { ":c": "val" },
    limit: 5,
  });
  assertEquals(expression, {
    table: "test",
    limit: 5,
    expression: "#c = :c",
    expression_columns: { "#c": "c" },
    expression_values: { ":c": "val" },
  });
});
