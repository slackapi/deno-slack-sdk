/**
 * A factory function for easily generating DefineFunction's source_file parameter value.
 *
 * @param importMetaUrl the value of import.meta.url
 * @param depth pass the depth when having nested directories under functions directory (default: 0)
 * @returns a valid string value for DefineFunction's source_file argument
 */
const FunctionSourceFile = function (
  // Pass the value of import.meta.url in a function code
  importMetaUrl: string,
  // If you have sub diretories under "functions" dir, set the depth.
  // When you place functions/pto/data_submission.ts, the depth for the source file is 1.
  depth = 0,
): string {
  const sliceStart = -2 - depth;
  const path = new URL("", importMetaUrl).pathname;
  return path.split("/").slice(sliceStart).join("/");
};

export default FunctionSourceFile;
