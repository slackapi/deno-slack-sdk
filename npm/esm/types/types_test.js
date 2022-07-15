import * as dntShim from "../_dnt.test_shims.js";
import { DefineType } from "./mod.js";
import { assertEquals } from "../dev_deps.js";
dntShim.Deno.test("DefineType test against id using the name parameter", () => {
    const Type = DefineType({
        title: "Title",
        description: "Description",
        name: "Name",
        type: "Type",
    });
    assertEquals(Type.id, "Name");
});
dntShim.Deno.test("DefineType test against id using the callback_id parameter", () => {
    const Type = DefineType({
        title: "Title",
        description: "Description",
        callback_id: "Callback_id",
        type: "Type",
    });
    assertEquals(Type.id, "Callback_id");
});
dntShim.Deno.test("DefineType test toString using the callback_id parameter", () => {
    const Type = DefineType({
        title: "Title",
        description: "Description",
        callback_id: "Callback_id",
        type: "Type",
    });
    const typeString = Type.toString();
    assertEquals(typeString, "#/types/Callback_id");
});
dntShim.Deno.test("DefineType test toString using the name parameter", () => {
    const Type = DefineType({
        title: "Title",
        description: "Description",
        name: "Name",
        type: "Type",
    });
    const typeJson = Type.toJSON();
    assertEquals(typeJson, "#/types/Name");
});
dntShim.Deno.test("DefineType test export using the name parameter", () => {
    const Type = DefineType({
        title: "Title",
        description: "Description",
        name: "Name",
        type: "Type",
    });
    const exportType = Type.export();
    assertEquals(exportType, {
        title: "Title",
        description: "Description",
        type: "Type",
    });
});
dntShim.Deno.test("DefineType test export using the callback_id parameter", () => {
    const Type = DefineType({
        title: "Title",
        description: "Description",
        callback_id: "Callback_id",
        type: "Type",
    });
    const exportType = Type.export();
    assertEquals(exportType, {
        title: "Title",
        description: "Description",
        type: "Type",
    });
});
