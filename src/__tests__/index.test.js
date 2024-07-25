import fs from 'node:fs';
import { join } from 'node:path';

import OCL from 'openchemlib';

import { RxnRenderer } from '..';

const rxn = fs.readFileSync(join(__dirname, 'test.rxn'), 'utf8');
const emptyRXN = fs.readFileSync(join(__dirname, 'empty.rxn'), 'utf8');
const corrupted = fs.readFileSync(join(__dirname, 'corrupted.rxn'), 'utf8');

const json = JSON.parse(fs.readFileSync(join(__dirname, 'test.json'), 'utf8'));

describe('rxn-renderer', () => {
  it('generate file for rxn', () => {
    const rxnRenderer = new RxnRenderer(OCL, {
      maxWidth: 200,
      maxHeight: 100,
    });
    const result = rxnRenderer.renderRXN(rxn);
    expect(result).toMatchSnapshot();
    fs.writeFileSync(join(__dirname, 'test-rxn.html'), result);
  });

  it('generate file for corrupted rxn', () => {
    const rxnRenderer = new RxnRenderer(OCL, {
      maxWidth: 200,
      maxHeight: 100,
    });
    const result = rxnRenderer.renderRXN(corrupted);
    expect(result).toMatchSnapshot();
  });

  it('generate file for empty rxn', () => {
    const rxnRenderer = new RxnRenderer(OCL, {
      maxWidth: 200,
      maxHeight: 100,
    });
    const result = rxnRenderer.renderRXN(emptyRXN);
    expect(result).toMatchSnapshot();
    fs.writeFileSync(join(__dirname, 'test-empty.html'), result);
  });

  it('generate file for json', () => {
    const rxnRenderer = new RxnRenderer(OCL);
    const result = rxnRenderer.render(json);
    expect(result).toMatchSnapshot();
    fs.writeFileSync(join(__dirname, 'test-json.html'), result);
  });

  it('check a rxnCode', () => {
    const rxnCode =
      'gJQ@@dju@P!eMHAIXO}R` eF@HhP#qjN` qjH Ql#!R?g~w?[_|m?t]tmp !R?g~w?QvZw@ !R_vp]nop';

    const rxnRenderer = new RxnRenderer(OCL);
    const result = rxnRenderer.renderRXNCode(rxnCode);
    expect(result).toMatchSnapshot();
    fs.writeFileSync(join(__dirname, 'test-rxn-code.html'), result);
  });
});
