'use strict';

import { BestPracticeResult } from '@qualweb/best-practices';
import BestPractice from './BestPractice.object';
import { QWElement } from '@qualweb/qw-element';

class QW_BP7 extends BestPractice {

  constructor() {
    super({
      name: 'Title element contains ASCII-art',
      code: 'QW-BP7',
      description: 'Title element contains ASCII-art',
      metadata: {
        target: {
          element: 'title'
        },
        related: [],
        passed: 0,
        warning: 0,
        failed: 0,
        inapplicable: 0,
        outcome: '',
        description: ''
      },
      results: new Array<BestPracticeResult>()
    });
  }

  execute(element: QWElement | undefined): void {

    if (!element) {
      return;
    }

    const evaluation: BestPracticeResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    const titleValue = element.getElementText();
    const regExConsecutiveSymbols = new RegExp('[,\\-;!?\'][,\\-;!?\']');
    const regExAllowedSymbols = new RegExp('^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9.,\\-;:!? ]*$');
    const regExAllowBracketsWithText = new RegExp(/(\([a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9.,\-;!?: ]*\))|(\[[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9.,\-;!?: ]*\])|(\{[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9.,\-;!?: ]*\})|(\"[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9.,\-;!?: ]*\")|(\'[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9.,\-;!?: ]*\')/);
    const regExConsecutiveDots = new RegExp('^[^.]*(\\.{2}(\\.{2,})?)[^.]*$');
    const regExConsecutiveSpaces = new RegExp('[ ][ ]');

    let titleValueWithoutBrackets = titleValue;
    let occurrence;
    let allDone = false;
    while (regExAllowBracketsWithText.test(titleValueWithoutBrackets) && !allDone){
      occurrence = regExAllowBracketsWithText.exec(titleValueWithoutBrackets);
      if(occurrence) {
        titleValueWithoutBrackets = titleValueWithoutBrackets.replace(occurrence[0], '');
      } else {
        allDone = true;
      }
    }

    if (!regExAllowedSymbols.test(titleValueWithoutBrackets)) {
      evaluation.verdict = 'failed';
      evaluation.description = `The title element contains other symbols than .,;-!? and ()[]{}"' with text in between`;
      evaluation.resultCode = `RC1`;
    } else {
      if (regExConsecutiveDots.test(titleValue) || regExConsecutiveSymbols.test(titleValue) || regExConsecutiveSpaces.test(titleValue)) {
        evaluation.verdict = 'failed';
        evaluation.description = `The title element contains ASCII art`;
        evaluation.resultCode = `RC2`;
      } else {
        evaluation.verdict = 'passed';
        evaluation.description = `The title element doesn't contain ASCII art`;
        evaluation.resultCode = `RC3`;
      }
    }
    evaluation.htmlCode = element.getElementHtmlCode( true, true);
    evaluation.pointer = element.getElementSelector();

    super.addEvaluationResult(evaluation);
  }
}

export = QW_BP7;
