import type {Spread} from 'lexical';

import {type SerializedTextNode} from 'lexical';

export type SerializedCodeCompletionTextNode = Spread<
  {
    text: string;
    type: 'code-completion-item';
    version: 1;
  },
  SerializedTextNode
>;

export type Match = {
  text: string;
  weight: number;
};