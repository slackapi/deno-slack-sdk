import { getSlackFunctions, greenText, redText, yellowText } from "../utils.ts";
import { assertEquals } from "../../../../../../dev_deps.ts";

Deno.test("colored text remain consistent", () => {
  assertEquals("\x1b[92mtest\x1b[0m", greenText("test"));
  assertEquals("\x1b[91mtest\x1b[0m", redText("test"));
  assertEquals("\x1b[38;5;214mtest\x1b[0m", yellowText("test"));
});

Deno.test("Non builtin functions should be filtered", async () => {
  const actual = await getSlackFunctions(
    "src/schema/slack/functions/_scripts/src/test/data/function.json",
  );
  assertEquals(actual.length, 1);
});
