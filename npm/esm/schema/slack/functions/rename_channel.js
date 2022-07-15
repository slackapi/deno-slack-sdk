/** This file was autogenerated on Wed Jul 06 2022. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import { DefineFunction } from "../../../functions/mod.js";
import SchemaTypes from "../../schema_types.js";
import SlackTypes from "../schema_types.js";
export default DefineFunction({
    callback_id: "slack#/functions/rename_channel",
    source_file: "",
    title: "Rename a Channel",
    description: "Rename an existing Slack channel",
    input_parameters: {
        required: ["channel_id", "channel_name"],
        properties: {
            channel_id: {
                type: SlackTypes.channel_id,
                description: "Channel to rename",
            },
            channel_name: {
                type: SchemaTypes.string,
                description: "New channel name",
            },
        },
    },
    output_parameters: {
        required: ["channel_id"],
        properties: {
            channel_id: {
                type: SlackTypes.channel_id,
                description: "Renamed Channel",
            },
        },
    },
});
