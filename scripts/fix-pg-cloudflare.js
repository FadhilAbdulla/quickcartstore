#!/usr/bin/env node
// nft only traces pg-cloudflare via the "default" export condition (dist/empty.js).
// esbuild bundles with the "workerd" condition and needs dist/index.js.
// This script copies the missing workerd files after opennextjs-cloudflare build.
const fs = require("fs")
const path = require("path")

const src = path.join(__dirname, "../node_modules/pg-cloudflare")
const dest = path.join(__dirname, "../.open-next/server-functions/default/node_modules/pg-cloudflare")

if (!fs.existsSync(dest)) {
  console.log("pg-cloudflare not in .open-next — skipping fix")
  process.exit(0)
}

const files = ["dist/index.js", "dist/index.js.map", "dist/index.d.ts"]
for (const file of files) {
  const srcFile = path.join(src, file)
  const destFile = path.join(dest, file)
  if (fs.existsSync(srcFile) && !fs.existsSync(destFile)) {
    fs.mkdirSync(path.dirname(destFile), { recursive: true })
    fs.copyFileSync(srcFile, destFile)
    console.log(`Copied pg-cloudflare/${file}`)
  }
}
console.log("pg-cloudflare fix complete")
