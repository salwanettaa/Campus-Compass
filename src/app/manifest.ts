import type { MetadataRoute } from "next";

/** Lets students add Campus Compass to their phone's home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Campus Compass",
    short_name: "Compass",
    description: "Student adaptation and community knowledge platform.",
    start_url: "/home",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
