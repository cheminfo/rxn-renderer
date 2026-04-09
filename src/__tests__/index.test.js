import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import OCL from 'openchemlib';
import { expect, test } from 'vitest';

import { RxnRenderer } from '../index.js';

const rxn = readFileSync(join(import.meta.dirname, 'test.rxn'), 'utf8');
const emptyRXN = readFileSync(join(import.meta.dirname, 'empty.rxn'), 'utf8');
const corrupted = readFileSync(
  join(import.meta.dirname, 'corrupted.rxn'),
  'utf8',
);

const json = JSON.parse(
  readFileSync(join(import.meta.dirname, 'test.json'), 'utf8'),
);

test('generate file for rxn', () => {
  const rxnRenderer = new RxnRenderer(OCL, {
    maxWidth: 200,
    maxHeight: 100,
  });
  const result = rxnRenderer.renderRXN(rxn);

  expect(result).toMatchSnapshot();

  writeFileSync(join(import.meta.dirname, 'test-rxn.html'), result);
});

test('generate file for corrupted rxn', () => {
  const rxnRenderer = new RxnRenderer(OCL, {
    maxWidth: 200,
    maxHeight: 100,
  });
  const result = rxnRenderer.renderRXN(corrupted);

  expect(result).toMatchSnapshot();
});

test('generate file for empty rxn', () => {
  const rxnRenderer = new RxnRenderer(OCL, {
    maxWidth: 200,
    maxHeight: 100,
  });
  const result = rxnRenderer.renderRXN(emptyRXN);

  expect(result).toMatchSnapshot();

  writeFileSync(join(import.meta.dirname, 'test-empty.html'), result);
});

test('generate file for json', () => {
  const rxnRenderer = new RxnRenderer(OCL);
  const result = rxnRenderer.render(json);

  expect(result).toMatchSnapshot();

  writeFileSync(join(import.meta.dirname, 'test-json.html'), result);
});

test('check a rxnCode', () => {
  const rxnCode =
    'gJQ@@dju@P!eMHAIXO}R` eF@HhP#qjN` qjH Ql#!R?g~w?[_|m?t]tmp !R?g~w?QvZw@ !R_vp]nop';

  const rxnRenderer = new RxnRenderer(OCL);
  const result = rxnRenderer.renderRXNCode(rxnCode);

  expect(result).toMatchSnapshot();

  writeFileSync(join(import.meta.dirname, 'test-rxn-code.html'), result);
});
