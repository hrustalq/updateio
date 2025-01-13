// eslint-disable-next-line import/export
import * as uiConfig from "@repo/ui/tailwind.config";

export default {
  ...uiConfig,
  content: [
    "src/**/*.{ts,tsx}",
    "index.html",
  ],
}
