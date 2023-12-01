import { assertEquals } from "../dev_deps.ts";
import { DefineWidget } from "./mod.ts";
import { SlackWidgetDataMode } from "./types.ts";

Deno.test("Widget exports json as expected", () => {
  const widgetSerialized = {
    title: "test",
    description: "this widget",
    workflow_id: "1",
    data_mode: SlackWidgetDataMode.PER_INSTALLER,
  };
  const widget = DefineWidget({
    callback_id: "test",
    ...widgetSerialized,
  });

  const exported = widget.export();
  const json = widget.toJSON();
  assertEquals(exported, widgetSerialized);
  assertEquals(json, widgetSerialized);
});
