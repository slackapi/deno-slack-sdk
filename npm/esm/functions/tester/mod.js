export const DEFAULT_FUNCTION_TESTER_TITLE = "Function Test Title";
export const SlackFunctionTester = (funcOrCallbackId) => {
    const now = new Date();
    const testFnID = `fn${now.getTime()}`;
    let testFnCallbackID;
    let testFnTitle;
    if (typeof funcOrCallbackId === "string") {
        testFnCallbackID = funcOrCallbackId;
        testFnTitle = DEFAULT_FUNCTION_TESTER_TITLE;
    }
    else {
        testFnCallbackID = funcOrCallbackId.definition.callback_id;
        testFnTitle = funcOrCallbackId.definition.title;
    }
    const createContext = (args) => {
        const ts = new Date();
        return {
            inputs: (args.inputs || {}),
            env: args.env || {},
            token: args.token || "slack-function-test-token",
            event: args.event || {
                type: "function_executed",
                event_ts: `${ts.getTime()}`,
                function_execution_id: `fx${ts.getTime()}`,
                inputs: args.inputs,
                function: {
                    id: testFnID,
                    callback_id: testFnCallbackID,
                    title: testFnTitle,
                },
            },
        };
    };
    return { createContext };
};
