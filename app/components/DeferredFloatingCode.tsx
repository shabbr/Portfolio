"use client";

import dynamic from "next/dynamic";

const FloatingCode = dynamic(() => import("./FloatingCode"), { ssr: false });

/** Client-only wrapper — `ssr: false` is invalid in Server Components. */
export default function DeferredFloatingCode() {
  return <FloatingCode />;
}
