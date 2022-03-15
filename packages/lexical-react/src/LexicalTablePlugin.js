/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type {TableSelection} from '@lexical/table';
import type {
  CommandListenerEditorPriority,
  ElementNode,
  NodeKey,
} from 'lexical';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $createTableNodeWithDimensions,
  applyTableHandlers,
  TableCellNode,
  TableNode,
  TableRowNode,
} from '@lexical/table';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isRootNode,
} from 'lexical';
import {useEffect} from 'react';
import invariant from 'shared/invariant';

const EditorPriority: CommandListenerEditorPriority = 0;

export default function TablePlugin(): React$Node {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([TableNode, TableCellNode, TableRowNode])) {
      invariant(
        false,
        'TablePlugin: TableNode, TableCellNode or TableRowNode not registered on editor',
      );
    }
    return editor.addListener(
      'command',
      (type, payload) => {
        if (type === 'insertTable') {
          const {columns, rows} = payload;
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return true;
          }
          const focus = selection.focus;
          const focusNode = focus.getNode();

          if (focusNode !== null) {
            const tableNode = $createTableNodeWithDimensions(rows, columns);
            if ($isRootNode(focusNode)) {
              const target = focusNode.getChildAtIndex(focus.offset);
              if (target !== null) {
                target.insertBefore(tableNode);
              } else {
                focusNode.append(tableNode);
              }
            } else {
              const topLevelNode = focusNode.getTopLevelElementOrThrow();
              topLevelNode.insertAfter(tableNode);
            }
            tableNode.insertAfter($createParagraphNode());
            const firstCell = tableNode
              .getFirstChildOrThrow<ElementNode>()
              .getFirstChildOrThrow<ElementNode>();
            firstCell.select();
          }
          return true;
        }
        return false;
      },
      EditorPriority,
    );
  }, [editor]);

  useEffect(() => {
    const tableSelections = new Map<NodeKey, TableSelection>();

    return editor.addListener('mutation', TableNode, (nodeMutations) => {
      // eslint-disable-next-line no-for-of-loops/no-for-of-loops
      for (const [nodeKey, mutation] of nodeMutations) {
        if (mutation === 'created') {
          editor.update(() => {
            const tableElement = editor.getElementByKey(nodeKey);
            const tableNode = $getNodeByKey(nodeKey);

            if (tableElement && tableNode) {
              const tableSelection = applyTableHandlers(
                tableNode,
                tableElement,
                editor,
              );

              tableSelections.set(nodeKey, tableSelection);
            }
          });
        } else if (mutation === 'destroyed') {
          const tableSelection = tableSelections.get(nodeKey);
          if (tableSelection) {
            tableSelection.removeListeners();
            tableSelections.delete(nodeKey);
          }
        }
      }
    });
  }, [editor]);

  return null;
}
