/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {LexicalEditor} from 'lexical';

import {createEditor, DecoratorNode, ElementNode, TextNode} from 'lexical';
import ExtendedNodes from 'lexical/ExtendedNodes';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';

import {resetRandomKey} from '../../LexicalUtils';

type TestEnv = {
  container: HTMLDivElement | null,
  editor: LexicalEditor | null,
  outerHTML: string,
};

export function createTestEditor(config = {}): LexicalEditor {
  const customNodes = config.nodes || [];
  const editor = createEditor({
    editorState: config.editorState,
    namespace: config.namespace,
    nodes: [
      ...ExtendedNodes,
      TestElementNode,
      TestSegmentedNode,
      TestExcludeFromCopyElementNode,
      TestDecoratorNode,
      ...customNodes,
    ],
    theme: config.theme,
  });
  return editor;
}

export function initializeUnitTest(
  runTests: (testEnv: TestEnv) => void,
  editorConfig,
) {
  const testEnv: TestEnv = {
    container: null,
    editor: null,
    get outerHTML() {
      return this.container.innerHTML;
    },
  };

  beforeEach(async () => {
    resetRandomKey();

    testEnv.container = document.createElement('div');
    document.body.appendChild(testEnv.container);
    const ref = React.createRef();

    const useLexicalEditor = (rootElementRef) => {
      const lexicalEditor = React.useMemo(() => {
        const lexical = createTestEditor(editorConfig);
        lexical.addListener('error', (error) => {
          throw error;
        });
        return lexical;
      }, []);

      React.useEffect(() => {
        const rootElement = rootElementRef.current;
        lexicalEditor.setRootElement(rootElement);
      }, [rootElementRef, lexicalEditor]);
      return lexicalEditor;
    };

    const Editor = () => {
      testEnv.editor = useLexicalEditor(ref);
      testEnv.editor.addListener('error', (error) => {
        throw error;
      });
      return <div ref={ref} contentEditable={true} />;
    };

    ReactTestUtils.act(() => {
      ReactDOM.createRoot(testEnv.container).render(<Editor />);
    });
  });

  afterEach(() => {
    document.body.removeChild(testEnv.container);
    testEnv.container = null;
  });

  runTests(testEnv);
}

export class TestElementNode extends ElementNode {
  static getType(): string {
    return 'test_block';
  }
  static clone(node: ElementNode) {
    return new TestElementNode(node.__key);
  }
  createDOM() {
    return document.createElement('div');
  }
  updateDOM() {
    return false;
  }
}

export function $createTestElementNode(): TestElementNode {
  return new TestElementNode();
}

export class TestSegmentedNode extends TextNode {
  static getType(): string {
    return 'test_segmented';
  }
  static clone(node: $FlowFixMe): TestSegmentedNode {
    return new TestSegmentedNode(node.__text, node.__key);
  }
}

export function $createTestSegmentedNode(text): TestSegmentedNode {
  return new TestSegmentedNode(text).setMode('segmented');
}

export class TestExcludeFromCopyElementNode extends ElementNode {
  static getType(): string {
    return 'test_exclude_from_copy_block';
  }
  static clone(node: TestExcludeFromCopyElementNode) {
    return new TestExcludeFromCopyElementNode(node.__key);
  }
  createDOM() {
    return document.createElement('div');
  }
  updateDOM() {
    return false;
  }
  excludeFromCopy() {
    return true;
  }
}

export function $createTestExcludeFromCopyElementNode(): TestExcludeFromCopyElementNode {
  return new TestExcludeFromCopyElementNode();
}

export class TestDecoratorNode extends DecoratorNode {
  static getType(): string {
    return 'test_decorator';
  }
  static clone(node: TestNode) {
    return new TestNode(node.__key);
  }
  getTextContent() {
    return 'Hello world';
  }
  createDOM() {
    return document.createElement('span');
  }
  decorate() {
    return <Decorator text={'Hello world'} />;
  }
}

function Decorator({text}): React.MixedElement {
  return <span>{text}</span>;
}

export function $createTestDecoratorNode(): TestDecoratorNode {
  return new TestDecoratorNode();
}
