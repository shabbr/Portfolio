"use client";

import type { RefObject } from "react";
import { useInView } from "framer-motion";

type Options = {
  once?: boolean;
  margin?: string;
  amount?: number | "some" | "all";
};

/**
 * Section entrance trigger. Kept as a shared hook so we can tune
 * viewport margins in one place without changing call sites.
 */
export function useReadyInView(
  ref: RefObject<Element | null>,
  options: Options = { once: true, margin: "-80px" },
): boolean {
  return useInView(ref, options);
}
