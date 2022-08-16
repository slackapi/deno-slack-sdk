/*
Possibly helpful links:
- https://github.com/slackapi/bolt-js/blob/main/src/types/view/index.ts
- https://api.slack.com/reference/interaction-payloads/views
- https://api.slack.com/reference/surfaces/views
*/

import type { BlockElement } from "./block_actions_types.ts";

/**
 * @description Common `body` type for both `view_submission` and `view_closed` events.
 */
export type ViewBody = {
  /**
   * @description The encoded application ID the view event was dispatched to, e.g. A123456.
   */
  api_app_id: string;
  /**
   * @description If applicable, the enterprise associated with the workspace the Block Action interaction originated from. If not applicable, will be null.
   */
  enterprise: {
    /**
     * @description Encoded enterprise ID, e.g. E123456.
     */
    id: string;
    /**
     * @description Enterprise name.
     */
    name: string;
  } | null;
  /**
   * @description Whether this event originated from a workspace that is part of an enterprise installation.
   */
  is_enterprise_install: boolean;
  /**
   * @description The workspace, or team, details the Block Kit interaction originated from.
   */
  team: {
    /**
     * @description The subdomain of the team, e.g. domain.slack.com
     */
    domain: string;
    /**
     * @description Encoded team ID, e.g. T123456.
     */
    id: string;
  };
  token: string;
  type: string;
  /**
   * @description Details for the user that initiated the Block Kit action.
   */
  user: {
    /**
     * @description Encoded user ID, e.g. U123456.
     */
    id: string;
    /**
     * @description User's handle as seen in the Slack client when e.g. at-notifying the user.
    name: string;
    /**
     * @description The encoded team ID for the workspace, or team, where the Block Kit action originated from.
     */
    team_id: string;
  };
  /**
   * @description The source view of the modal interacted with.
   */
  view: View;
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};

/**
 * @description The source view of the modal interacted with.
 */
export type View = {
  /**
   * @description The encoded application ID the view event was dispatched to, e.g. A123456.
   */
  app_id: string;
  /**
   * @description The encoded team ID for the workspace, or team, of the View.
   */
  app_installed_team_id: string;
  /**
   * @description The Block elements composing the view.
   */
  blocks: BlockElement[];
  // bot_id: string;
  /**
   * @description An identifier to recognize interactions and submissions of this particular view. Don't use this to store sensitive information (use `private_metadata` instead). Max length of 255 characters.
   */
  callback_id: string;
  /**
   * @description Whether clicking on the close button clears all views in this modal and closes it..
   */
  clear_on_close: boolean;
  // close: any;
  // external_id: string;
  /**
   * @description A unique value which is optionally accepted in `views.update` and `views.publish` API calls. When provided to those APIs, the `hash` is validated such that only the most recent view can be updated. This should be used to ensure the correct view is being updated when updates are happening asynchronously.
   */
  hash: string;
  // id: string;
  /**
   * @description Indicates whether Slack sends your function a `view_closed` event when a user clicks the close button in this view.
   */
  notify_on_close: boolean;
  // previous_view_id: any;
  /**
   * @description An optional string that will be sent to your app in `view_submission` and `view_closed` events. Max length of 3000 characters.
   */
  private_metadata?: string;
  // root_view_id: string;
  /**
   * @description Object representing view state.
   */
  state: {
    /**
     * @description A dictionary of objects. Each object represents a block in the view that contained stateful, interactive components. Objects are keyed by the `block_id` of those blocks. These objects each contain a child object. The child object is keyed by the `action_id` of the interactive element in the block. This final child object will contain the type and submitted value of the input block element.
     */
    values: {
      // deno-lint-ignore no-explicit-any
      [key: string]: any;
    };
  };
  // submit?: any;
  /**
   * @description The encoded team ID for the workspace, or team, of the View.
   */
  team_id: string;
  // title: any;
  type: "modal";
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};
