import {
  greenText,
  isValidFunctionFile,
  redText,
  yellowText,
} from "../utils.ts";
import {
  assertEquals,
  assertFalse,
} from "https://deno.land/std@0.152.0/testing/asserts.ts";

Deno.test("isValidFunctionFile should be true for critical files", () => {
  assertFalse(isValidFunctionFile("_scripts"));
  assertFalse(isValidFunctionFile("mod.ts"));
});

Deno.test("colored text remain consistent", () => {
  assertEquals("\x1b[92mtest\x1b[0m", greenText("test"));
  assertEquals("\x1b[91mtest\x1b[0m", redText("test"));
  assertEquals("\x1b[38;5;214mtest\x1b[0m", yellowText("test"));
});
