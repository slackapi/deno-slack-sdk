import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.148.0/testing/asserts.ts";

import * as logger from "./logger.ts";

const regex =
  /^{\"loggerName\":\"slack\",\"msg\":\"(?<msg>.*)\",\"level\":(?<level>10|20|30|40|50),\"datetime\":\"(?<ts>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)\"}$/;

Deno.test("Test logging with string", () => {
  const msg = "This is a string";
  const res = logger.info(msg);

  const match = res.match(regex);

  assertExists(match);
  assertExists(match.groups);

  assertEquals(match.groups["msg"], msg);
});

Deno.test("Test logging with int", () => {
  const msg = 15;
  const res = logger.info(msg);

  const match = res.match(regex);

  assertExists(match);
  assertExists(match.groups);

  assertEquals(match.groups["msg"], "15");
});

Deno.test("Test logging with object", () => {
  const msg = { "test": 15 };
  const res = logger.info(msg);

  const match = res.match(regex);

  assertExists(match);
  assertExists(match.groups);

  assertEquals(match.groups["msg"], `{"test":15}`);
});

Deno.test("Test debug logging", () => {
  const msg = "Test";
  const res = logger.debug(msg);

  const match = res.match(regex);

  assertExists(match);
  assertExists(match.groups);

  assertEquals(match.groups["level"], "10");
});

Deno.test("Test info logging", () => {
  const msg = "Test";
  const res = logger.info(msg);

  const match = res.match(regex);

  assertExists(match);
  assertExists(match.groups);

  assertEquals(match.groups["level"], "20");
});

Deno.test("Test warn logging", () => {
  const msg = "Test";
  const res = logger.warn(msg);

  const match = res.match(regex);

  assertExists(match);
  assertExists(match.groups);

  assertEquals(match.groups["level"], "30");
});

Deno.test("Test error logging", () => {
  const msg = "Test";
  const res = logger.error(msg);

  const match = res.match(regex);

  assertExists(match);
  assertExists(match.groups);

  assertEquals(match.groups["level"], "40");
});

Deno.test("Test fatal logging", () => {
  const msg = "Test";
  const res = logger.fatal(msg);

  const match = res.match(regex);

  assertExists(match);
  assertExists(match.groups);

  assertEquals(match.groups["level"], "50");
});
