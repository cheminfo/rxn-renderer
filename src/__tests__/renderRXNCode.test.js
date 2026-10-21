import OCL from 'openchemlib';
import { expect, test } from 'vitest';

import { RxnRenderer } from '../index.js';

// One reactant and two products, with atom-mapping numbers.
const rxnCode =
  'gJQ@@dju@P!eMHAIXO}R` eF@HhP#qjN` qjH Ql#!R?g~w?[_|m?t]tmp !R?g~w?QvZw@ !R_vp]nop';

const flexRow =
  '<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">';

function arrowTexts(html) {
  return Array.from(
    html.matchAll(
      /<div style="text-align: center; margin: 5px">\s*(?<text>.*?)\s*<\/div>/gs,
    ),
    (match) => match.groups.text,
  );
}

// The labels of each structure, in drawing order.
function svgTexts(html) {
  return html
    .split('<svg ')
    .slice(1)
    .map((svg) =>
      Array.from(
        svg.matchAll(/<text[^>]*>(?<text>[^<]*)<\/text>/g),
        (match) => match.groups.text,
      ),
    );
}

// OpenChemLib numbers the SVG ids across calls (mol1, mol2, …).
function withoutIds(html) {
  return html.replaceAll(/\bmol\d+/g, 'mol');
}

test('renderRXNCode writes the conditions above and below the arrow', () => {
  const html = new RxnRenderer(OCL).renderRXNCode(rxnCode, {
    catalyst: 'Pd/C',
    reagent: 'H2',
    solvent: 'MeOH',
    temperature: '25 °C',
    conditions: '2 h',
    yield: '95 %',
  });

  expect(arrowTexts(html)).toStrictEqual([
    'Pd/C, H<sub>2</sub>, MeOH',
    '25 °C, 2 h, 95 %',
  ]);
});

test('renderRXNCode draws the same arrow as render for the same conditions', () => {
  const renderer = new RxnRenderer(OCL);
  const conditions = { catalyst: 'Pd/C', solvent: 'MeOH', yield: '95 %' };
  const arrow = renderer
    .render(conditions)
    .slice(flexRow.length, -'</div>'.length);

  expect(arrowTexts(arrow)).toStrictEqual(['Pd/C, MeOH', '95 %']);
  expect(renderer.renderRXNCode(rxnCode, conditions)).toContain(arrow);
});

test('renderRXNCode escapes the conditions', () => {
  const html = new RxnRenderer(OCL).renderRXNCode(rxnCode, {
    solvent: '<img src=x onerror=alert(1)> & THF',
    conditions: 'Ar <1 bar>',
  });

  expect(arrowTexts(html)).toStrictEqual([
    '&lt;img src=x onerror=alert(1)&gt; &amp; THF',
    'Ar &lt;1 bar&gt;',
  ]);
});

test('renderRXNCode inserts HTML conditions as given with escaped', () => {
  const html = new RxnRenderer(OCL, { escaped: true }).renderRXNCode(rxnCode, {
    reagent: '<i>n</i>-BuLi',
    temperature: '−78 °C',
  });

  expect(arrowTexts(html)).toStrictEqual(['<i>n</i>-BuLi', '−78 °C']);
});

test('renderRXNCode skips the empty conditions', () => {
  const html = new RxnRenderer(OCL).renderRXNCode(rxnCode, {
    catalyst: '',
    solvent: 'THF',
    yield: '',
  });

  expect(arrowTexts(html)).toStrictEqual(['THF', '']);
});

test('renderRXNCode without conditions draws a bare arrow', () => {
  const renderer = new RxnRenderer(OCL);
  const bare = withoutIds(renderer.renderRXNCode(rxnCode));

  expect(arrowTexts(bare)).toStrictEqual(['', '']);
  expect(withoutIds(renderer.renderRXNCode(rxnCode, {}))).toBe(bare);
  expect(withoutIds(renderer.renderRXNCode(rxnCode, undefined))).toBe(bare);
});

test('renderRXNCode draws no arrow, nor conditions, for an empty reaction', () => {
  const html = new RxnRenderer(OCL).renderRXNCode('!##', { solvent: 'THF' });

  expect(html).toBe(`${flexRow}</div>`);
});

test('the arrow is drawn in currentColor', () => {
  const html = new RxnRenderer(OCL).renderRXNCode(rxnCode);

  expect(html.match(/solid currentColor/g)).toHaveLength(2);
  expect(html).toContain('border-top: 2px solid currentColor;');
  expect(html).toContain('border-left: 10px solid currentColor;');
  expect(html).not.toContain('black');
});

test('showMapping false draws no atom-mapping numbers', () => {
  const mapped = new RxnRenderer(OCL).renderRXNCode(rxnCode);
  const unmapped = new RxnRenderer(OCL, {
    showMapping: false,
  }).renderRXNCode(rxnCode);

  expect(svgTexts(mapped)).toStrictEqual([
    ['O', '5', '2', '4', '3', '1'],
    ['O', '5', '2', '4'],
    ['1', '3'],
  ]);
  expect(svgTexts(unmapped)).toStrictEqual([['O'], ['O'], []]);
});
