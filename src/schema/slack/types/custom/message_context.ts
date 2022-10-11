import SchemaTypes from "../../../schema_types.ts";
import { SlackPrimitiveTypes } from "../../types/mod.ts";
import { DefineType } from "../../../../types/mod.ts";

const MessageContextType = DefineType({
  name: "slack#/types/message_context",
  type: SchemaTypes.object,
  properties: {
    message_ts: {
      type: SlackPrimitiveTypes.message_ts,
    },
    user_id: {
      type: SlackPrimitiveTypes.user_id,
    },
    channel_id: {
      type: SlackPrimitiveTypes.channel_id,
    },
  },
});

export { MessageContextType };
