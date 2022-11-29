import {$isRangeSelection, TextNode} from 'lexical';

import {QueryData, TypeAheadSelection} from '../typeahead/types';
import $isSimpleText from '../typeahead/utils/$isSimpleText';
import getTokenTypeForCursorPosition from '../typeahead/utils/getTokenTypeForCursorPosition';

export default function getCodeCompletionQueryData(
  selection: TypeAheadSelection | null,
): QueryData | null {
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
    return null;
  }

  const node = selection.getNodes()[0];
  if (!$isSimpleText(node)) {
    return null;
  }

  const anchor = selection.anchor;
  const offset = anchor.offset;

  const tokenType = getTokenTypeForCursorPosition(node, offset);
  switch (tokenType) {
    case 'comment':
    case 'number':
    case 'operator':
    case 'punctuation':
    case 'string':
    case 'string2':
      return null;
  }

  let insertionBeginOffset = -1;
  let insertionBeginTextNode: TextNode | null = node;
  let positionBeginOffset = -1;
  let positionBeginTextNode: TextNode | null = node;
  let dotCount = 0;

  {
    let currentOffset = offset - 1;
    let currentTextNode: TextNode | null = node;
    let currentText = node.getTextContent();

    if (currentTextNode !== null) {
      back: while (true) {
        for (currentOffset; currentOffset >= 0; currentOffset--) {
          const char = currentText.charAt(currentOffset);
          if (char === '.') {
            if (insertionBeginTextNode === null) {
              // Replace everything after the first "." (e.g. "window.loc|" => "window.location")
              insertionBeginOffset = currentOffset;
              insertionBeginTextNode = currentTextNode;
            }

            dotCount++;
          }

          if (isBoundaryChar(char)) {
            // We've found the beginning of this expression.
            break back;
          }

          positionBeginOffset = currentOffset;
          positionBeginTextNode = currentTextNode;
        }

        const previousTextNode: TextNode | null =
          currentTextNode.getPreviousSibling();
        if (previousTextNode === null || !$isSimpleText(previousTextNode)) {
          break back;
        }

        currentTextNode = previousTextNode;
        currentText = previousTextNode.getTextContent();
        currentOffset = currentText.length - 1;
      }
    }

    if (insertionBeginTextNode === null) {
      // Edge case; replace the whole text (e.g. "win|" -> "window")
      insertionBeginOffset = positionBeginOffset;
      insertionBeginTextNode = positionBeginTextNode;
    }
  }

  let expression = '';

  let insertionEndOffset = -1;
  let insertionEndTextNode: TextNode | null = null;
  let positionEndOffset = -1;
  let positionEndTextNode: TextNode | null = null;

  {
    let currentOffset = positionBeginOffset;
    let currentTextNode: TextNode | null = positionBeginTextNode;
    let currentText = positionBeginTextNode?.getTextContent() ?? '';

    if (currentTextNode !== null) {
      forward: while (true) {
        for (
          currentOffset;
          currentOffset < currentText.length;
          currentOffset++
        ) {
          const char = currentText.charAt(currentOffset);
          if (isBoundaryChar(char)) {
            insertionEndTextNode = currentTextNode;
            insertionEndOffset = currentOffset;

            if (positionEndTextNode === null) {
              positionEndTextNode = currentTextNode;
              positionEndOffset = currentOffset;
            }

            break forward;
          } else if (char === '.') {
            if (dotCount === 0) {
              // If the cursor is within an expression (e.g. "window.loca|tion.href")
              // then break once we reach the next "."
              positionEndOffset = currentOffset;
              positionEndTextNode = currentTextNode;

              // Don't break; find the expression to can replace the whole thing (e.g. "window.loc|ation.href" => "window.location")
            }

            dotCount--;
          }

          if (positionEndTextNode === null) {
            expression += char;
          }
        }

        const nextTextNode: TextNode | null = currentTextNode.getNextSibling();
        if (nextTextNode === null) {
          // We've reached the end of the text.
          break forward;
        } else if (!$isSimpleText(nextTextNode)) {
          // Don't try to parse complex nodes.
          break forward;
        } else {
          const nextTextContent = nextTextNode.getTextContent() || '';
          const nextChar = nextTextContent.charAt(0);
          if (isBoundaryChar(nextChar)) {
            // If the next node is a boundary, end on the current node.
            break forward;
          }
        }

        currentTextNode = nextTextNode;
        currentText = nextTextNode.getTextContent();
        currentOffset = 0;
      }
    }

    if (insertionEndTextNode === null) {
      insertionEndOffset = currentOffset;
      insertionEndTextNode = currentTextNode;
    }

    if (positionEndTextNode === null) {
      positionEndOffset = currentOffset;
      positionEndTextNode = currentTextNode;
    }
  }

  const pieces = expression.split('.');
  const query = '.' + (pieces[pieces.length - 1] || '');
  const queryAdditionalData = pieces.slice(0, -1).join('.') || '';

  if (positionBeginTextNode === null || positionEndTextNode === null) {
    const textRange = {
      beginOffset: offset,
      beginTextNode: node,
      endOffset: offset,
      endTextNode: node,
    };

    return {
      insertionTextRange: textRange,
      positionTextRange: textRange,
      query,
      queryAdditionalData,
    };
  }

  return {
    insertionTextRange: {
      beginOffset: insertionBeginOffset,
      beginTextNode: insertionBeginTextNode,
      endOffset: insertionEndOffset,
      endTextNode: insertionEndTextNode,
    },
    positionTextRange: {
      beginOffset: positionBeginOffset,
      beginTextNode: positionBeginTextNode,
      endOffset: positionEndOffset,
      endTextNode: positionEndTextNode,
    },
    query,
    queryAdditionalData,
  };
}

function isBoundaryChar(char: string): boolean {
  return char.match(/[\s{},'"]/) !== null;
}