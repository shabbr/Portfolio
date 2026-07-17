"use client";

import type { RefObject } from "react";
import { useInView, type UseInViewOptions } from "framer-motion";

/**
 * Section entrance trigger. Kept as a shared hook so we can tune
 * viewport margins in one place without changing call sites.
 */
export function useReadyInView(
  ref: RefObject<Element | null>,
  options: UseInViewOptions = { once: true, margin: "-80px" },
): boolean {
  return useInView(ref, options);
}
