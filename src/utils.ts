import { FocusableElement, tabbable } from 'tabbable';

export function getTabbableNodes(parentNode: Element) {
  return tabbable(parentNode);
}

export function focusAfter(node: FocusableElement) {
  const tabItems = getTabbableNodes(document.body);
  const nodeIndex = tabItems.indexOf(node);
  if (nodeIndex !== -1) {
    const nextIndex = nodeIndex + 1;
    if (nextIndex < tabItems.length) {
      const nextTab = tabItems[nextIndex];
      nextTab.focus();
      return true;
    }
  }
  return false;
}

export function focusBefore(node: FocusableElement) {
  const tabItems = getTabbableNodes(document.body);
  const nodeIndex = tabItems.indexOf(node);
  if (nodeIndex !== -1) {
    const prevIndex = nodeIndex - 1;
    if (prevIndex >= 0) {
      const prevTab = tabItems[prevIndex];
      prevTab.focus();
      return true;
    }
  }
  return false;
}

export function didMoveBackward(
  target: Element,
  relatedTarget: Element | null,
) {
  return relatedTarget
    ? Boolean(
        target.compareDocumentPosition(relatedTarget) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      )
    : false;
}
