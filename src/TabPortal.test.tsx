import '@testing-library/jest-dom';

import React from 'react';
import { createPortal } from 'react-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabPortal from './TabPortal';

jest.mock('tabbable', () => {
  const lib = jest.requireActual('tabbable') as typeof import('tabbable');
  return {
    __esModule: true,
    ...lib,
    tabbable: (node, options) =>
      lib.tabbable(node, { ...options, displayCheck: 'none' }),
    focusable: (node, options) =>
      lib.focusable(node, { ...options, displayCheck: 'none' }),
    isFocusable: (node, options) =>
      lib.isFocusable(node, { ...options, displayCheck: 'none' }),
    isTabbable: (node, options) =>
      lib.isTabbable(node, { ...options, displayCheck: 'none' }),
  } as typeof import('tabbable');
});

const user = userEvent.setup();

describe('TabPortal', () => {
  beforeAll(() => {
    // See: https://github.com/jsdom/jsdom/issues/1261
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      get(this: HTMLElement) {
        return this.parentNode;
      },
    });
  });

  it('tabs forward in the expected order', async () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Portal />
        <button data-testid="4" />
        <button data-testid="8" tabIndex={1} />
        <button data-testid="5" />
        <TabPortal.Content>
          <select data-testid="2">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <a href="#" data-testid="3">
            Click here
          </a>
        </TabPortal.Content>
        <input data-testid="6" />
        <a href="#" data-testid="7">
          Click here
        </a>
      </TabPortal>,
    );

    expect(document.body).toHaveFocus();
    await user.tab();
    expect(getByTestId('8')).toHaveFocus();
    await user.tab();
    expect(getByTestId('1')).toHaveFocus();
    await user.tab();
    expect(getByTestId('2')).toHaveFocus();
    await user.tab();
    expect(getByTestId('3')).toHaveFocus();
    await user.tab();
    expect(getByTestId('4')).toHaveFocus();
    await user.tab();
    expect(getByTestId('5')).toHaveFocus();
    await user.tab();
    expect(getByTestId('6')).toHaveFocus();
    await user.tab();
    expect(getByTestId('7')).toHaveFocus();
    await user.tab();
    // Focus should have looped around.
    expect(document.body).toHaveFocus();
    await user.tab();
    expect(getByTestId('8')).toHaveFocus();
  });

  it('tabs backward in the expected order', async () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Portal />
        <button data-testid="4" />
        <button data-testid="8" tabIndex={1} />
        <button data-testid="5" />
        <TabPortal.Content>
          <select data-testid="2">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <a href="#" data-testid="3">
            Click here
          </a>
        </TabPortal.Content>
        <input data-testid="6" />
        <a href="#" data-testid="7">
          Click here
        </a>
      </TabPortal>,
    );

    expect(document.body).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('7')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('6')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('5')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('4')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('3')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('2')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('1')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('8')).toHaveFocus();
    await user.tab({ shift: true });
    // Focus should have looped around.
    expect(document.body).toHaveFocus();
  });

  it('tabs forward in the expected order when portal content is at start of document', async () => {
    const { getByTestId } = render(
      <TabPortal>
        <TabPortal.Content>
          <select data-testid="2">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <a href="#" data-testid="3">
            Click here
          </a>
        </TabPortal.Content>
        <input data-testid="1" />
        <TabPortal.Portal />
        <button data-testid="4" />
        <button data-testid="8" tabIndex={1} />
        <button data-testid="5" />
        <input data-testid="6" />
        <a href="#" data-testid="7">
          Click here
        </a>
      </TabPortal>,
    );

    expect(document.body).toHaveFocus();
    await user.tab();
    expect(getByTestId('8')).toHaveFocus();
    await user.tab();
    expect(getByTestId('1')).toHaveFocus();
    await user.tab();
    expect(getByTestId('2')).toHaveFocus();
    await user.tab();
    expect(getByTestId('3')).toHaveFocus();
    await user.tab();
    expect(getByTestId('4')).toHaveFocus();
    await user.tab();
    expect(getByTestId('5')).toHaveFocus();
    await user.tab();
    expect(getByTestId('6')).toHaveFocus();
    await user.tab();
    expect(getByTestId('7')).toHaveFocus();
    await user.tab();
    // Focus should have looped around.
    expect(document.body).toHaveFocus();
    await user.tab();
    expect(getByTestId('8')).toHaveFocus();
  });

  it('tabs forward in the expected order when portal content is at end of document', async () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Portal />
        <button data-testid="4" />
        <button data-testid="8" tabIndex={1} />
        <button data-testid="5" />
        <input data-testid="6" />
        <a href="#" data-testid="7">
          Click here
        </a>
        <TabPortal.Content>
          <select data-testid="2">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <a href="#" data-testid="3">
            Click here
          </a>
        </TabPortal.Content>
      </TabPortal>,
    );

    expect(document.body).toHaveFocus();
    await user.tab();
    expect(getByTestId('8')).toHaveFocus();
    await user.tab();
    expect(getByTestId('1')).toHaveFocus();
    await user.tab();
    expect(getByTestId('2')).toHaveFocus();
    await user.tab();
    expect(getByTestId('3')).toHaveFocus();
    await user.tab();
    expect(getByTestId('4')).toHaveFocus();
    await user.tab();
    expect(getByTestId('5')).toHaveFocus();
    await user.tab();
    expect(getByTestId('6')).toHaveFocus();
    await user.tab();
    expect(getByTestId('7')).toHaveFocus();
    await user.tab();
    // Focus should have looped around.
    expect(document.body).toHaveFocus();
    await user.tab();
    expect(getByTestId('8')).toHaveFocus();
  });

  it('tabs backward in the expected order when portal content is at start of document', async () => {
    const { getByTestId } = render(
      <TabPortal>
        <TabPortal.Content>
          <select data-testid="2">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <a href="#" data-testid="3">
            Click here
          </a>
        </TabPortal.Content>
        <input data-testid="1" />
        <TabPortal.Portal />
        <button data-testid="4" />
        <button data-testid="8" tabIndex={1} />
        <button data-testid="5" />
        <input data-testid="6" />
        <a href="#" data-testid="7">
          Click here
        </a>
      </TabPortal>,
    );

    expect(document.body).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('7')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('6')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('5')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('4')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('3')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('2')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('1')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('8')).toHaveFocus();
    await user.tab({ shift: true });
    // Focus should have looped around.
    expect(document.body).toHaveFocus();
  });

  it('tabs backward in the expected order when portal content is at end of document', async () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Portal />
        <button data-testid="4" />
        <button data-testid="8" tabIndex={1} />
        <button data-testid="5" />
        <input data-testid="6" />
        <a href="#" data-testid="7">
          Click here
        </a>
        <TabPortal.Content>
          <select data-testid="2">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <a href="#" data-testid="3">
            Click here
          </a>
        </TabPortal.Content>
      </TabPortal>,
    );

    expect(document.body).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('7')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('6')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('5')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('4')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('3')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('2')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('1')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('8')).toHaveFocus();
    await user.tab({ shift: true });
    // Focus should have looped around.
    expect(document.body).toHaveFocus();
  });

  it('skips over content when there are no tabbables', async () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Portal />
        <button data-testid="2" />
        <button data-testid="6" tabIndex={1} />
        <button data-testid="3" />
        <TabPortal.Content></TabPortal.Content>
        <input data-testid="4" />
        <a href="#" data-testid="5">
          Click here
        </a>
      </TabPortal>,
    );
    expect(document.body).toHaveFocus();
    await user.tab();
    expect(getByTestId('6')).toHaveFocus();
    await user.tab();
    expect(getByTestId('1')).toHaveFocus();
    await user.tab();
    expect(getByTestId('2')).toHaveFocus();
    await user.tab();
    expect(getByTestId('3')).toHaveFocus();
    await user.tab();
    expect(getByTestId('4')).toHaveFocus();
    await user.tab();
    expect(getByTestId('5')).toHaveFocus();
    await user.tab();
    // Focus should have looped around.
    expect(document.body).toHaveFocus();
  });

  it('skips over content when there are no tabbables in reverse order', async () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Portal />
        <button data-testid="2" />
        <button data-testid="6" tabIndex={1} />
        <button data-testid="3" />
        <TabPortal.Content></TabPortal.Content>
        <input data-testid="4" />
        <a href="#" data-testid="5">
          Click here
        </a>
      </TabPortal>,
    );
    expect(document.body).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('5')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('4')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('3')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('2')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('1')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('6')).toHaveFocus();
    await user.tab({ shift: true });
    // Focus should have looped around.
    expect(document.body).toHaveFocus();
  });

  it('supports content coming before portal', async () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Content>
          <select data-testid="4">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <a href="#" data-testid="5">
            Click here
          </a>
        </TabPortal.Content>
        <button data-testid="2" />
        <button data-testid="8" tabIndex={1} />
        <button data-testid="3" />
        <TabPortal.Portal />
        <input data-testid="6" />
        <a href="#" data-testid="7">
          Click here
        </a>
      </TabPortal>,
    );
    expect(document.body).toHaveFocus();
    await user.tab();
    expect(getByTestId('8')).toHaveFocus();
    await user.tab();
    expect(getByTestId('1')).toHaveFocus();
    await user.tab();
    expect(getByTestId('2')).toHaveFocus();
    await user.tab();
    expect(getByTestId('3')).toHaveFocus();
    await user.tab();
    expect(getByTestId('4')).toHaveFocus();
    await user.tab();
    expect(getByTestId('5')).toHaveFocus();
    await user.tab();
    expect(getByTestId('6')).toHaveFocus();
    await user.tab();
    expect(getByTestId('7')).toHaveFocus();
    await user.tab();
    // Focus should have looped around.
    expect(document.body).toHaveFocus();
  });

  it('supports content coming before portal when reverse tabbing', async () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Content>
          <select data-testid="4">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <a href="#" data-testid="5">
            Click here
          </a>
        </TabPortal.Content>
        <button data-testid="2" />
        <button data-testid="8" tabIndex={1} />
        <button data-testid="3" />
        <TabPortal.Portal />
        <input data-testid="6" />
        <a href="#" data-testid="7">
          Click here
        </a>
      </TabPortal>,
    );
    expect(document.body).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('7')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('6')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('5')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('4')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('3')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('2')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('1')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('8')).toHaveFocus();
    await user.tab({ shift: true });
    // Focus should have looped around.
    expect(document.body).toHaveFocus();
  });

  it('forwards props and refs to TabPortal.Content', async () => {
    const ref = React.createRef<HTMLElement>();

    const { getByTestId } = render(
      <TabPortal>
        <TabPortal.Portal />
        <button data-testid="2">Click me</button>
        <TabPortal.Content data-testid="content" ref={ref}>
          <input data-testid="1" />
        </TabPortal.Content>
      </TabPortal>,
    );

    expect(document.body).toHaveFocus();
    await user.tab();
    expect(getByTestId('1')).toHaveFocus();
    await user.tab();
    expect(getByTestId('2')).toHaveFocus();
    expect(ref.current).toBe(getByTestId('content'));
  });

  it('forwards function refs to TabPortal.Content', async () => {
    const ref = jest.fn();

    const { getByTestId } = render(
      <TabPortal>
        <TabPortal.Portal />
        <button data-testid="2">Click me</button>
        <TabPortal.Content data-testid="content" ref={ref}>
          <input data-testid="1" />
        </TabPortal.Content>
      </TabPortal>,
    );

    expect(document.body).toHaveFocus();
    await user.tab();
    expect(getByTestId('1')).toHaveFocus();
    await user.tab();
    expect(getByTestId('2')).toHaveFocus();
    expect(ref).toHaveBeenCalledWith(getByTestId('content'));
  });

  it('tabs forward in the expected order with react portals', async () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Portal />
        <button data-testid="4" />
        <button data-testid="8" tabIndex={1} />
        <button data-testid="5" />
        {createPortal(
          <TabPortal.Content>
            <select data-testid="2">
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
            <a href="#" data-testid="3">
              Click here
            </a>
          </TabPortal.Content>,
          document.body,
        )}
        <input data-testid="6" />
        <a href="#" data-testid="7">
          Click here
        </a>
      </TabPortal>,
    );

    expect(document.body).toHaveFocus();
    await user.tab();
    expect(getByTestId('8')).toHaveFocus();
    await user.tab();
    expect(getByTestId('1')).toHaveFocus();
    await user.tab();
    expect(getByTestId('2')).toHaveFocus();
    await user.tab();
    expect(getByTestId('3')).toHaveFocus();
    await user.tab();
    expect(getByTestId('4')).toHaveFocus();
    await user.tab();
    expect(getByTestId('5')).toHaveFocus();
    await user.tab();
    expect(getByTestId('6')).toHaveFocus();
    await user.tab();
    expect(getByTestId('7')).toHaveFocus();
    await user.tab();
    // Focus should have looped around.
    expect(document.body).toHaveFocus();
    await user.tab();
    expect(getByTestId('8')).toHaveFocus();
  });

  it('tabs backward in the expected order with react portals', async () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Portal />
        <button data-testid="4" />
        <button data-testid="8" tabIndex={1} />
        <button data-testid="5" />
        {createPortal(
          <TabPortal.Content>
            <select data-testid="2">
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
            <a href="#" data-testid="3">
              Click here
            </a>
          </TabPortal.Content>,
          document.body,
        )}
        <input data-testid="6" />
        <a href="#" data-testid="7">
          Click here
        </a>
      </TabPortal>,
    );

    expect(document.body).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('7')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('6')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('5')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('4')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('3')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('2')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('1')).toHaveFocus();
    await user.tab({ shift: true });
    expect(getByTestId('8')).toHaveFocus();
    await user.tab({ shift: true });
    // Focus should have looped around.
    expect(document.body).toHaveFocus();
  });
});
