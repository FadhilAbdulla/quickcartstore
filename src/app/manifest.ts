import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QuickCart UAE",
    short_name: "QuickCart",
    description:
      "UAE's premier IT products store. Shop laptops, gaming PCs, monitors, networking and more with fast UAE delivery.",
    start_url: "/",
    display: "standalone",
    background_color: "#072654",
    theme_color: "#0066BA",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  }
}
