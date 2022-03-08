import {
  BlockActionCallback,
  BlockActionCallbackArgs,
  BlockActionCriteria,
  BlockActionInvocationBody,
  IBlockAction,
} from "./types.ts";

export const DefineBlockAction = (
  criteria: BlockActionCriteria,
  callback: BlockActionCallback,
) => {
  return new BlockActionHandler(criteria, callback);
};

export class BlockActionHandler implements IBlockAction {
  private criteria: BlockActionCriteria;
  private callback: BlockActionCallback;

  constructor(criteria: BlockActionCriteria, callback: BlockActionCallback) {
    this.criteria = criteria;
    this.callback = callback;
  }

  matches(body: BlockActionInvocationBody): boolean {
    const action = body.actions[0];
    const { actionId, blockId } = this.criteria;

    // If no criteria values were set, we won't match anything
    if (!actionId && !blockId) {
      return false;
    }

    // Default to true if actionId criteria was not set, otherwise false
    let actionMatches = !actionId;
    // If actionId criteria was set, ensure it matches
    if (actionId && action?.action_id === actionId) {
      actionMatches = true;
    }
    // Default to true if blockId criteria was not set, other false
    let blockMatches = !blockId;
    // If blockId criteria was set, ensure it matches
    if (blockId && action?.block_id === blockId) {
      blockMatches = true;
    }

    return actionMatches && blockMatches;
  }

  async run(args: BlockActionCallbackArgs) {
    return await this.callback(args);
  }
}
