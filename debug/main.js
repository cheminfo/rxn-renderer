import OCL from 'openchemlib';

import corruptedRxn from '../src/__tests__/corrupted.rxn?raw';
import emptyRxn from '../src/__tests__/empty.rxn?raw';
import json from '../src/__tests__/test.json';
import rheaRxn from '../src/__tests__/test.rxn?raw';
import { RxnRenderer } from '../src/index.js';

const CONDITION_KEYS = [
  'catalyst',
  'reagent',
  'solvent',
  'temperature',
  'conditions',
  'yield',
];

const { rxn: jsonRxn, ...jsonConditions } = json;

const EXAMPLES = [
  { name: 'Rhea RXN file', method: 'renderRXN', input: rheaRxn },
  {
    name: 'RXN file with conditions',
    method: 'render',
    input: jsonRxn,
    conditions: jsonConditions,
  },
  {
    name: 'Reaction code',
    method: 'renderRXNCode',
    input:
      'gJQ@@dju@P!eMHAIXO}R` eF@HhP#qjN` qjH Ql#!R?g~w?[_|m?t]tmp !R?g~w?QvZw@ !R_vp]nop',
  },
  {
    name: 'Reaction SMILES with conditions',
    method: 'smiles',
    input: 'C=Cc1ccccc1>>CCc1ccccc1',
    conditions: {
      catalyst: 'Pd/C',
      reagent: 'H2',
      solvent: 'MeOH',
      temperature: '25 °C',
      yield: '95 %',
    },
  },
  { name: 'Empty RXN file', method: 'renderRXN', input: emptyRxn },
  { name: 'Corrupted RXN file', method: 'renderRXN', input: corruptedRxn },
  {
    name: 'Arrow only',
    method: 'render',
    input: '',
    conditions: { reagent: '<b>H2SO4</b>', temperature: '100 °C' },
  },
];

const elements = {
  form: document.querySelector('#form'),
  example: document.querySelector('#example'),
  method: document.querySelector('#method'),
  input: document.querySelector('#input'),
  conditions: document.querySelector('#conditions'),
  maxWidth: document.querySelector('#maxWidth'),
  maxHeight: document.querySelector('#maxHeight'),
  showMapping: document.querySelector('#showMapping'),
  escaped: document.querySelector('#escaped'),
  dark: document.querySelector('#dark'),
  status: document.querySelector('#status'),
  output: document.querySelector('#output'),
  html: document.querySelector('#html'),
};

const conditionInputs = {};
for (const key of CONDITION_KEYS) {
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.name = key;
  label.append(`${key} `, input);
  elements.conditions.append(label);
  conditionInputs[key] = input;
}

for (const [index, example] of EXAMPLES.entries()) {
  elements.example.add(new Option(example.name, String(index)));
}

elements.example.addEventListener('change', () => {
  loadExample(EXAMPLES[Number(elements.example.value)]);
});
elements.form.addEventListener('input', (event) => {
  if (event.target !== elements.example) update();
});

loadExample(EXAMPLES[0]);

function loadExample(example) {
  elements.method.value = example.method;
  elements.input.value = example.input;
  for (const key of CONDITION_KEYS) {
    conditionInputs[key].value = example.conditions?.[key] ?? '';
  }
  update();
}

function update() {
  const renderer = new RxnRenderer(OCL, {
    maxWidth: Number(elements.maxWidth.value),
    maxHeight: Number(elements.maxHeight.value),
    showMapping: elements.showMapping.checked,
    escaped: elements.escaped.checked,
  });
  const conditions = {};
  for (const key of CONDITION_KEYS) {
    const value = conditionInputs[key].value;
    if (value) conditions[key] = value;
  }

  elements.output.classList.toggle('dark', elements.dark.checked);
  const start = performance.now();
  try {
    const html = renderWith(renderer, elements.input.value, conditions);
    const time = performance.now() - start;
    elements.status.className = '';
    elements.status.textContent = `Rendered in ${time.toFixed(1)} ms, ${html.length} characters.`;
    elements.output.innerHTML = html;
    elements.html.textContent = html;
  } catch (error) {
    elements.status.className = 'error';
    elements.status.textContent = `Thrown: ${error}`;
    elements.output.replaceChildren();
    elements.html.textContent = error.stack ?? String(error);
  }
}

function renderWith(renderer, input, conditions) {
  switch (elements.method.value) {
    case 'render':
      return renderer.render({ rxn: input, ...conditions });
    case 'renderRXNCode':
      return renderer.renderRXNCode(input.trim(), conditions);
    case 'smiles': {
      const reaction = OCL.Reaction.fromSmiles(input.trim());
      return renderer.renderRXNCode(
        OCL.ReactionEncoder.encode(reaction),
        conditions,
      );
    }
    default:
      return renderer.renderRXN(input);
  }
}
