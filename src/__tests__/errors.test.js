import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { RxnRenderer } from '../index.js';

const rxn = readFileSync(join(import.meta.dirname, 'test.rxn'));

// OpenChemLib stand-ins whose error message carries markup.
const message = '<img src=x onerror=alert(1)> & co';
const escapedError =
  '<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">Error: &lt;img src=x onerror=alert(1)&gt; &amp; co</div>';

test('renderRXNCode escapes the error text', () => {
  const failingOCL = {
    ReactionEncoder: {
      decode: () => ({
        getReactants() {
          throw new Error(message);
        },
      }),
    },
  };

  expect(new RxnRenderer(failingOCL).renderRXNCode('code')).toBe(escapedError);
});

test('renderRXN escapes the error text', () => {
  const failingOCL = {
    Molecule: {
      fromMolfile() {
        throw new Error(message);
      },
    },
  };

  expect(new RxnRenderer(failingOCL).renderRXN(rxn)).toBe(escapedError);
});
