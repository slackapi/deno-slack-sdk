/** This file was autogenerated. Follow the steps in src/schema/slack/functions/_scripts/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.ts";
import SchemaTypes from "../../schema_types.ts";
import SlackTypes from "../schema_types.ts";

export default DefineFunction({
  callback_id: "slack#/functions/add_bookmark",
  source_file: "",
  title: "Add a bookmark",
  input_parameters: {
    properties: {
      channel_id: {
        type: SlackTypes.channel_id,
        description: "Search all channels",
        title: "Select a channel",
      },
      name: {
        type: SchemaTypes.string,
        description: "Enter the bookmark name",
        title: "Bookmark name",
      },
      link: {
        type: SchemaTypes.string,
        description: "https://docs.acme.com",
        title: "Bookmark Link",
      },
    },
    required: ["channel_id", "name", "link"],
  },
  output_parameters: {
    properties: {
      channel_id: {
        type: SlackTypes.channel_id,
        description: "Channel",
        title: "Channel",
      },
      bookmark_name: {
        type: SchemaTypes.string,
        description: "Bookmark name",
        title: "Bookmark name",
      },
      bookmark_link: {
        type: SchemaTypes.string,
        description: "Bookmark link",
        title: "Bookmark link",
      },
    },
    required: ["channel_id", "bookmark_name", "bookmark_link"],
  },
});
