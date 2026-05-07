import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["server.ts"],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile: "dist-server/server.js",
  external: [
    "express",
    "vite",
    "multer",
    "uuid",
    "cors",
    "child_process",
    "fs",
    "path",
    "crypto",
    "os",
  ],
});
