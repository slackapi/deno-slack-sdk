import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { BlockActionHandler } from "./mod.ts";
import { BlockActionCriteria, BlockActionInvocationBody } from "./types.ts";

const createTestBlockActionBody = (
  criteria?: BlockActionCriteria,
): BlockActionInvocationBody => {
  return {
    type: "block_actions",
    actions: [
      {
        type: "...",
        "action_id": criteria?.actionId ?? "my_action",
        "block_id": criteria?.blockId ?? "my_block",
        "action_ts": "111111",
      },
    ],
    "trigger_id": "test_trigger",
    "response_url": "https://slack.com",
    user: {
      id: "U123456",
      username: "user",
      name: "User",
      "team_id": "T123456",
    },
  };
};
Deno.test("BlockActionHandler.matches() with just actionId", () => {
  const criteria = { actionId: "test_id" };
  const handler = new BlockActionHandler(
    criteria,
    async () => {},
  );
  const testBody = createTestBlockActionBody(criteria);
  assertEquals(handler.matches(testBody), true);
});

Deno.test("BlockActionHandler.matches() with incorrect actionId", () => {
  const handler = new BlockActionHandler(
    { actionId: "test_id" },
    async () => {},
  );
  const testBody = createTestBlockActionBody({ actionId: "incorrect" });
  assertEquals(handler.matches(testBody), false);
});

Deno.test("BlockActionHandler.matches() with just blockId", () => {
  const criteria = { blockId: "test_id" };
  const handler = new BlockActionHandler(
    criteria,
    async () => {},
  );
  const testBody = createTestBlockActionBody(criteria);
  assertEquals(handler.matches(testBody), true);
});

Deno.test("BlockActionHandler.matches() with incorrect blockId", () => {
  const handler = new BlockActionHandler(
    { blockId: "test_id" },
    async () => {},
  );
  const testBody = createTestBlockActionBody({ blockId: "incorrect" });
  assertEquals(handler.matches(testBody), false);
});

Deno.test("BlockActionHandler.matches() with both actionId and blockId", () => {
  const criteria = { actionId: "1", blockId: "2" };
  const handler = new BlockActionHandler(
    criteria,
    async () => {},
  );
  const testBody = createTestBlockActionBody(criteria);
  assertEquals(handler.matches(testBody), true);
});

Deno.test("BlockActionHandler.matches() with incorrect actionId and correct blockId", () => {
  const handler = new BlockActionHandler(
    { actionId: "1", blockId: "2" },
    async () => {},
  );
  const testBody = createTestBlockActionBody({
    actionId: "incorrect",
    blockId: "2",
  });
  assertEquals(handler.matches(testBody), false);
});

Deno.test("BlockActionHandler.matches() with correct actionId and incorrect blockId", () => {
  const handler = new BlockActionHandler(
    { actionId: "1", blockId: "2" },
    async () => {},
  );
  const testBody = createTestBlockActionBody({
    actionId: "1",
    blockId: "incorrect",
  });
  assertEquals(handler.matches(testBody), false);
});

Deno.test("BlockActionHandler.matches() with no actionId or blockId", () => {
  const handler = new BlockActionHandler(
    { actionId: "", blockId: "" },
    async () => {},
  );
  const testBody = createTestBlockActionBody();
  assertEquals(handler.matches(testBody), false);
});
