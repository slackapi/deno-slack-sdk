import * as esbuild from "npm:esbuild@0.25.5";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.11.1";
import { join } from "jsr:@std/path@1.1.0";

async function bundle(options: {
  target: string;
}): Promise<Uint8Array> {
  const cwd = Deno.cwd();
  try {
    // esbuild configuration options https://esbuild.github.io/api/#overview
    const result = await esbuild.build({
      entryPoints: [join(cwd, "src/mod.ts")],
      platform: "browser",
      target: options.target,
      format: "esm", // esm format stands for "ECMAScript module"
      bundle: true, // inline any imported dependencies into the file itself
      absWorkingDir: cwd, // root of this project
      write: false, // Favor returning the contents
      outdir: "out", // Nothing is being written to file here
      plugins: [
        ...denoPlugins({ configPath: join(cwd, "deno.jsonc") }),
      ],
    });
    return result.outputFiles[0].contents;
  } finally {
    esbuild.stop();
  }
}

console.log("Building bundle for target: deno1");
const deno1Bundle = await bundle({ target: "deno1" });
const deno1Content = new TextDecoder().decode(deno1Bundle);
console.log(`Bundle for deno1 built successfully!`);
console.log(deno1Content);

console.log("Building bundle for target: deno2");
const deno2Bundle = await bundle({ target: "deno2" });
const deno2Content = new TextDecoder().decode(deno2Bundle);
console.log(`Bundle for deno2 built successfully!`);
console.log(deno2Content);
