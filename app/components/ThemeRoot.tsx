"use client";

import type { ReactNode } from "react";
import { ThemeProvider, type PublicThemeConfig } from "./ThemeProvider";

/** Client boundary so the server layout can pass theme config. */
export default function ThemeRoot({
  children,
  config,
}: {
  children: ReactNode;
  config: PublicThemeConfig;
}) {
  return <ThemeProvider initialConfig={config}>{children}</ThemeProvider>;
}
