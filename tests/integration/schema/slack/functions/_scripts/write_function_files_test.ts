import { assertSnapshot, mock } from "../../../../../../src/dev_deps.ts";
import { _internals } from "../../../../../../src/schema/slack/functions/_scripts/src/write_function_files.ts";
import { getSlackFunctions } from "../../../../../../src/schema/slack/functions/_scripts/src/utils.ts";

Deno.test(`write_function_files.ts ${_internals.main.name} function snapshot test`, async (t) => {
  const getSlackFunctionsStub = mock.stub(
    _internals,
    "getSlackFunctions",
    (
      functionsPayloadPath =
        "src/schema/slack/functions/_scripts/src/test/data/function.json",
    ) => {
      return getSlackFunctions(
        functionsPayloadPath,
      );
    },
  );

  const paths: string[] = [];
  const fileContents: string[] = [];

  const writeTextFileStub = mock.stub(
    _internals,
    "writeTextFile",
    // deno-lint-ignore require-await
    async (path, data) => {
      paths.push(path);
      fileContents.push(data);
    },
  );

  try {
    await _internals.main();
    mock.assertSpyCalls(writeTextFileStub, 3);
    mock.assertSpyCalls(getSlackFunctionsStub, 1);
    assertSnapshot(t, paths);
    assertSnapshot(t, fileContents);
  } finally {
    writeTextFileStub.restore();
    getSlackFunctionsStub.restore();
  }
});
