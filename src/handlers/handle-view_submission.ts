import { ViewSubmissionInvocationBody } from "./types.ts";
import {
  Env,
  InvocationPayload,
  ISlackAPIClient,
  SlackProjectType,
} from "../types.ts";

export type HandlerOptions = {
  payload: InvocationPayload<ViewSubmissionInvocationBody>;
  client: ISlackAPIClient;
  project: SlackProjectType;
  env: Env;
};

export async function handleViewSubmission({
  payload,
  client,
  project,
  env,
}: HandlerOptions) {
  const { body } = payload;
  const callbackId = body.view.callback_id;
  if (!callbackId) {
    return {};
  }

  // Find our action definition that maps to this action
  const matchingViewSubmissionDef = project._viewSubmissions?.find(
    (viewSubmissionDef) => {
      const callbackId = viewSubmissionDef.callback_id;
      if (!callbackId) {
        return false;
      }

      if (callbackId === viewSubmissionDef.callback_id) {
        return true;
      }

      return false;
    },
  );

  if (!matchingViewSubmissionDef) {
    return {};
  }

  const resp = await matchingViewSubmissionDef.handler({ body, client, env });

  return resp || {};
}
