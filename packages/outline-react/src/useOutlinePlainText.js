/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type {OutlineEditor} from 'outline';
import type {InputEvents} from 'outline-react/useOutlineEditorEvents';

import {useCallback} from 'react';
import useLayoutEffect from './shared/useLayoutEffect';
import useOutlineEditorEvents from './useOutlineEditorEvents';
import {
  createParagraphNode,
  ParagraphNode,
  isParagraphNode,
} from 'outline/ParagraphNode';
import {CAN_USE_BEFORE_INPUT} from 'shared/environment';
import invariant from 'shared/invariant';
import {
  onSelectionChange,
  onKeyDownForPlainText,
  onCompositionStart,
  onCompositionEnd,
  onCutForPlainText,
  onCopyForPlainText,
  onBeforeInputForPlainText,
  onPasteForPlainText,
  onDropPolyfill,
  onDragStartPolyfill,
  onMutation,
  onInput,
} from 'outline/EventHelpers';
import useOutlineDragonSupport from './shared/useOutlineDragonSupport';
import useOutlineHistory from './shared/useOutlineHistory';

function initEditor(editor: OutlineEditor): void {
  editor.update((view) => {
    const root = view.getRoot();
    const firstChild = root.getFirstChild();
    if (firstChild !== null) {
      if (!isParagraphNode(firstChild)) {
        invariant(
          'false',
          'Expected plain text root first child to be a ParagraphNode',
        );
      }
    } else {
      const paragraph = createParagraphNode();
      root.append(paragraph);
      if (view.getSelection() !== null) {
        paragraph.select();
      }
    }
  }, 'initEditor');
}

function clearEditor(
  editor: OutlineEditor,
  callbackFn?: (callbackFn?: () => void) => void,
): void {
  editor.update(
    (view) => {
      const firstChild = view.getRoot().getFirstChild();
      if (isParagraphNode(firstChild)) {
        firstChild.clear();
        if (view.getSelection() !== null) {
          firstChild.select();
        }
      }
    },
    'clearEditor',
    callbackFn,
  );
}

const events: InputEvents = [
  ['selectionchange', onSelectionChange],
  ['keydown', onKeyDownForPlainText],
  ['compositionstart', onCompositionStart],
  ['compositionend', onCompositionEnd],
  ['cut', onCutForPlainText],
  ['copy', onCopyForPlainText],
  ['dragstart', onDragStartPolyfill],
  ['paste', onPasteForPlainText],
  ['input', onInput],
];

if (CAN_USE_BEFORE_INPUT) {
  events.push(['beforeinput', onBeforeInputForPlainText]);
} else {
  events.push(['drop', onDropPolyfill]);
}

export default function useOutlinePlainText(
  editor: OutlineEditor,
  isReadOnly: boolean,
): () => void {
  useLayoutEffect(() => {
    editor.registerNodeType('paragraph', ParagraphNode);
    initEditor(editor);

    const observer = new MutationObserver(
      (mutations: Array<MutationRecord>) => {
        onMutation(editor, mutations, observer);
      },
    );

    return editor.addListener('mutation', (rootElement: null | HTMLElement) => {
      if (rootElement === null) {
        observer.disconnect();
      } else {
        observer.observe(rootElement, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }
    });
  }, [editor]);

  useOutlineEditorEvents(events, editor, isReadOnly);
  useOutlineDragonSupport(editor);
  const clearHistory = useOutlineHistory(editor);

  return useCallback(
    (callbackFn?: () => void) => {
      clearEditor(editor, () => {
        clearHistory();
        if (callbackFn) {
          callbackFn();
        }
      });
    },
    [clearHistory, editor],
  );
}
