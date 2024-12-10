/** This file was autogenerated on Tue Oct 08 2024. Follow the steps in src/schema/slack/functions/_scripts/README.md to rebuild **/
import AddBookmark from "./add_bookmark.ts";
import AddCanvasToChannelTab from "./add_canvas_to_channel_tab.ts";
import AddPin from "./add_pin.ts";
import AddReaction from "./add_reaction.ts";
import AddUserToUsergroup from "./add_user_to_usergroup.ts";
import ArchiveChannel from "./archive_channel.ts";
import CanvasCopy from "./canvas_copy.ts";
import CanvasCreate from "./canvas_create.ts";
import CanvasUpdateContent from "./canvas_update_content_v2.ts";
import ChannelCanvasCreate from "./channel_canvas_create.ts";
import CreateChannel from "./create_channel.ts";
import CreateUsergroup from "./create_usergroup.ts";
import Delay from "./delay.ts";
import InviteUserToChannel from "./invite_user_to_channel.ts";
import OpenForm from "./open_form.ts";
import RemoveReaction from "./remove_reaction.ts";
import RemoveUserFromUsergroup from "./remove_user_from_usergroup.ts";
import ReplyInThread from "./reply_in_thread.ts";
import SendDm from "./send_dm.ts";
import SendEphemeralMessage from "./send_ephemeral_message.ts";
import SendMessage from "./send_message.ts";
import ShareCanvas from "./share_canvas.ts";
import ShareCanvasInThread from "./share_canvas_in_thread.ts";
import UpdateChannelTopic from "./update_channel_topic.ts";

const SlackFunctions = {
  AddBookmark,
  AddCanvasToChannelTab,
  AddPin,
  AddReaction,
  AddUserToUsergroup,
  ArchiveChannel,
  CanvasCopy,
  CanvasCreate,
  CanvasUpdateContent,
  ChannelCanvasCreate,
  CreateChannel,
  CreateUsergroup,
  Delay,
  InviteUserToChannel,
  OpenForm,
  RemoveReaction,
  RemoveUserFromUsergroup,
  ReplyInThread,
  SendDm,
  SendEphemeralMessage,
  SendMessage,
  ShareCanvas,
  ShareCanvasInThread,
  UpdateChannelTopic,
} as const;

export default SlackFunctions;
