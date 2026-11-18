import React, {
  FocusEvent,
  HTMLAttributes,
  JSX,
  PropsWithChildren,
  useCallback,
  useRef,
} from 'react';
import HiddenTabbable from './HiddenTabbable';
import useTabPortal, {
  PortalContext,
  TabPortalContext,
  usePortalContext,
} from './useTabPortal';
import {
  getTabbableNodes,
  focusBefore,
  focusAfter,
  didMoveBackward,
} from './utils';
import type { FocusableElement } from 'tabbable';

type PortalProps = JSX.IntrinsicAttributes & { to?: TabPortalContext };

function Portal({ to: tabPortal, ...rest }: PortalProps) {
  const { contentRef, portalRef } = usePortalContext(tabPortal);

  const handleFocus = useCallback(
    (event: FocusEvent<FocusableElement>) => {
      event.stopPropagation();
      let focused = false;
      const contentNode = contentRef.current;
      if (contentNode) {
        const tabItems = getTabbableNodes(contentNode);
        const isMovingBackward = didMoveBackward(
          event.currentTarget,
          event.relatedTarget,
        );
        if (tabItems.length > 2) {
          const focusIndex = isMovingBackward ? tabItems.length - 2 : 1;
          tabItems[focusIndex].focus();
          focused = true;
        } else {
          if (isMovingBackward) {
            focused = focusBefore(portalRef.current!);
          } else {
            focused = focusAfter(portalRef.current!);
          }
        }
      }
      if (!focused) {
        event.currentTarget.blur();
      }
    },
    [contentRef, portalRef],
  );

  return <HiddenTabbable {...rest} ref={portalRef} onFocus={handleFocus} />;
}

Portal.displayName = 'TabPortal.Portal';

type ContentProps = PropsWithChildren<
  HTMLAttributes<FocusableElement> & {
    as?: keyof JSX.IntrinsicElements;
    from?: TabPortalContext;
    hiddenTabbableAs?: keyof JSX.IntrinsicElements;
  }
>;

const Content = React.forwardRef<FocusableElement, ContentProps>(
  (
    {
      as: ElementType = 'div',
      children,
      from: tabPortal,
      hiddenTabbableAs,
      ...rest
    },
    inputRef,
  ) => {
    const headRef = useRef<FocusableElement>(null);
    const tailRef = useRef<FocusableElement>(null);

    const { contentRef, portalRef } = usePortalContext(tabPortal);

    const handleFocusHead = useCallback(
      (event: FocusEvent<FocusableElement>) => {
        event.stopPropagation();
        let focused = false;

        const contentNode = contentRef.current!;
        if (event.relatedTarget && contentNode.contains(event.relatedTarget)) {
          // If focus moved here from inside the content, we're moving backward
          // and should thus move focus back to the last tabbable element before
          // the portal.
          focused = focusBefore(portalRef.current!);
        } else {
          // Otherwise, it means we've tabbed forward from the last element
          // before the content, and we should skip to the first tabbable
          // element after the content.
          focused = focusAfter(tailRef.current!);
        }
        if (!focused) {
          event.currentTarget.blur();
        }
      },
      [contentRef, portalRef],
    );

    const handleFocusTail = useCallback(
      (event: FocusEvent<FocusableElement>) => {
        event.stopPropagation();
        let focused = false;

        const contentNode = contentRef.current!;
        if (event.relatedTarget && contentNode.contains(event.relatedTarget)) {
          // If focus moved here from inside the content, we're moving forward
          // and should thus move focus back to the first tabbable element after
          // the portal.
          focused = focusAfter(portalRef.current!);
        } else {
          // Otherwise, it means we've tabbed backward from the first element
          // after the content, and we should skip to the last tabbable
          // element before the content.
          focused = focusBefore(headRef.current!);
        }
        if (!focused) {
          event.currentTarget.blur();
        }
      },
      [portalRef],
    );

    const ref = useCallback(
      (node: FocusableElement | null) => {
        // eslint-disable-next-line
        contentRef.current = node;
        if (typeof inputRef === 'function') {
          inputRef(node);
        } else if (inputRef) {
          inputRef.current = node;
        }
      },
      [contentRef, inputRef],
    );

    return (
      <ElementType ref={ref} {...rest}>
        <HiddenTabbable
          // The "head" focusable item inside the content. It serves to
          // capture when focus moves to the beginning of the content, which
          // means the user has either tabbed forward to it from the previous
          // element in document order, or tabbed backward from an element
          // inside the content (like something in `children`, or the "tail").
          as={hiddenTabbableAs}
          ref={headRef}
          onFocus={handleFocusHead}
        />
        {children}
        <HiddenTabbable
          // The "tail" focusable item inside the content. It serves to
          // capture when focus has reached the end of the content, which
          // means the user has either tabbed backward to it from the next
          // element in document order, or tabbed forward to it from an element
          // inside the content (like something in `children`, or the "head").
          as={hiddenTabbableAs}
          ref={tailRef}
          onFocus={handleFocusTail}
        />
      </ElementType>
    );
  },
);

Content.displayName = 'TabPortal.Content';

function TabPortal({ children }: PropsWithChildren) {
  const value = useTabPortal();
  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
}

TabPortal.Portal = Portal;
TabPortal.Content = Content;

export default TabPortal;
