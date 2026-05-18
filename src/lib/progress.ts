// eslint-disable-next-line @typescript-eslint/no-require-imports
const NProgress = require("nprogress")

export function startProgress() {
  NProgress.start()
}

export function doneProgress() {
  NProgress.done()
}
