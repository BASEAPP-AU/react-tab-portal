import React, { CSSProperties, forwardRef, HTMLAttributes, JSX } from 'react';
import type { FocusableElement } from 'tabbable';

export const hiddenTabbableStyle = {
  position: 'absolute',
  opacity: 0,
  width: 0,
  height: 0,
  pointerEvents: 'none',
  zIndex: -1,
} satisfies CSSProperties;

const HiddenTabbable = forwardRef<
  FocusableElement | null,
  HTMLAttributes<FocusableElement> & { as?: keyof JSX.IntrinsicElements }
>(({ as: ElementType = 'span', ...rest }, ref) => {
  return (
    <ElementType
      ref={(r: FocusableElement | null) => {
        if (typeof ref === 'function') {
          ref(r);
        } else if (ref) {
          ref.current = r;
        }
      }}
      tabIndex={0}
      style={hiddenTabbableStyle}
      {...rest}
    />
  );
});

HiddenTabbable.displayName = 'HiddenTabbable';

export default HiddenTabbable;
