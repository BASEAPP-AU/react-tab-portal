import { createContext, useContext, useMemo, useRef } from 'react';
import type { FocusableElement } from 'tabbable';

export const PortalContext = createContext<TabPortalContext | null>(null);

export type TabPortalContext = {
  contentRef: React.RefObject<FocusableElement | null>;
  portalRef: React.RefObject<FocusableElement | null>;
};

export default function useTabPortal() {
  const contentRef = useRef<FocusableElement>(null);
  const portalRef = useRef<FocusableElement>(null);
  return useMemo(() => ({ contentRef, portalRef }), []);
}

export function usePortalContext(
  tabPortal?: TabPortalContext,
): TabPortalContext {
  const context = useContext(PortalContext);

  if (!tabPortal && !context) {
    throw new Error(
      'Not inside TabPortal context. Place inside a <TabPortal /> component, or pass the result of useTabPortal with to/from.',
    );
  }

  return (tabPortal ?? context)!;
}
