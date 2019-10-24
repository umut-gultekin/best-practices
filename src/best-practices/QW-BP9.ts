'use strict';

import { BestPractice as BestPracticeType, BestPracticeResult } from '@qualweb/best-practices';
import BestPractice from './BestPractice.object';
import { DomElement } from 'htmlparser2';
import { DomUtils } from '@qualweb/util';
const stew = new(require('stew-select')).Stew();

const bestPractice: BestPracticeType = {
  name: 'Table element without header cells has a caption',
  code: 'QW-BP9',
  description: 'A table without th elements should have a caption element to describe it.',
  metadata: {
    target: {
      element: 'table'
    },
    passed: 0,
    warning: 0,
    failed: 0,
    inapplicable: 0,
    outcome: '',
    description: ''
  },
  results: new Array<BestPracticeResult>()
};

class QW_BP9 extends BestPractice {

  constructor() {
    super(bestPractice);
  }

  async execute(element: DomElement | undefined): Promise<void> {

    if (!element) {
      return;
    }

    const evaluation: BestPracticeResult = {
      verdict: '',
      description: '',
      resultCode: ''
    };

    const headers = stew.select(element, 'th');

    if (headers.length === 0) {
      const caption = stew.select(element, 'caption');

      if (caption.length !== 0) {
        evaluation.verdict = 'passed';
        evaluation.description = `Table doesn't have header cells but has a caption`;
        evaluation.resultCode = 'RC1';
      } else {
        evaluation.verdict = 'failed';
        evaluation.description = `Table doesn't have header cells or caption`;
        evaluation.resultCode = 'RC2';
      }
    } else {
      evaluation.verdict = 'inapplicable';
      evaluation.description = `Table has header cells`;
      evaluation.resultCode = 'RC3';
    }
    
    evaluation.htmlCode = DomUtils.transformElementIntoHtml(element);
    evaluation.pointer = DomUtils.getElementSelector(element);
    
    super.addEvaluationResult(evaluation);
  }
}

export = QW_BP9;
