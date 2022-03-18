import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { WithUntypedObjectProxy } from "./with-untyped-object-proxy.ts";

Deno.test("WithUntypedObjectProxy", () => {
  const ctx = WithUntypedObjectProxy({});

  assertEquals(`${ctx.foo}`, "{{foo}}");
  assertEquals(`${ctx.foo.baz}`, "{{foo.baz}}");
  assertEquals(
    `${ctx.foo.baz.biz.buzz.wut.wut.hi.bye}`,
    "{{foo.baz.biz.buzz.wut.wut.hi.bye}}",
  );
  assertEquals(`Some text ${ctx.variable}`, "Some text {{variable}}");
});

Deno.test("WithUntypedObjectProxy with namespace", () => {
  const ctx = WithUntypedObjectProxy({}, "metadata");

  assertEquals(`${ctx.foo}`, "{{metadata.foo}}");
  assertEquals(`${ctx.foo.baz}`, "{{metadata.foo.baz}}");
  assertEquals(
    `${ctx.foo.baz.biz.buzz.wut.wut.hi.bye}`,
    "{{metadata.foo.baz.biz.buzz.wut.wut.hi.bye}}",
  );
  assertEquals(`Some text ${ctx.variable}`, "Some text {{metadata.variable}}");
});
