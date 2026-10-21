import { parse } from 'rxn-parser';

/**
 * Text written around the reaction arrow. Unless the renderer is built with
 * `escaped`, `&`, `<` and `>` are escaped; then the digits that follow a
 * letter become subscripts (`H2O` gives `H<sub>2</sub>O`).
 * @typedef {object} ReactionConditions
 * @property {string} [catalyst] - Above the arrow, first.
 * @property {string} [reagent] - Above the arrow, after the catalyst.
 * @property {string} [solvent] - Above the arrow, last.
 * @property {string} [temperature] - Below the arrow, first.
 * @property {string} [conditions] - Below the arrow, after the temperature.
 * @property {string} [yield] - Below the arrow, last.
 */

/**
 * Options of the renderer.
 * @typedef {object} RxnRendererOptions
 * @property {number} [maxWidth=400] - Largest width of a structure, in pixels.
 * @property {number} [maxHeight=300] - Largest height of a structure, in pixels.
 * @property {boolean} [escaped=false] - The conditions are HTML already, so they are not escaped.
 * @property {boolean} [showMapping=true] - Draw the atom-mapping numbers.
 */

/**
 * Renders a reaction as HTML: a wrapping flex row of OpenChemLib SVG
 * structures, `+` signs and an arrow.
 */
export class RxnRenderer {
  /**
   * Creates a renderer.
   * @param {object} OCL - The OpenChemLib module; `renderRXNCode` needs version 8.1 or later.
   * @param {RxnRendererOptions} [options] - The options.
   */
  constructor(OCL, options = {}) {
    this.OCL = OCL;
    this.maxWidth = options.maxWidth || 400;
    this.maxHeight = options.maxHeight || 300;
    this.escaped = options.escaped;
    this.showMapping = options.showMapping ?? true;
  }

  /**
   * Renders a reaction from an OpenChemLib reaction code (ReactionEncoder).
   * The arrow, with the conditions around it, is drawn when the reaction has a
   * reactant or a product.
   * @param {string} rxnCode - The reaction code.
   * @param {ReactionConditions} [conditions] - The text around the arrow.
   * @returns {string} The HTML of the reaction, or the escaped text of the error met.
   */
  renderRXNCode(rxnCode, conditions = {}) {
    if (!this.OCL.ReactionEncoder) {
      throw new Error(
        'You need at least OCL version 8.1, OCL.ReactionEncoder is not available',
      );
    }
    const reaction = this.OCL.ReactionEncoder.decode(rxnCode);
    try {
      const reactants = [];
      for (let i = 0; i < reaction.getReactants(); i++) {
        reactants.push(reaction.getReactant(i));
      }
      let result = this.getStructuresFromMolecules(reactants);
      if (reaction.getReactants() > 0 || reaction.getProducts() > 0) {
        result += this.getArrowWithConditions(conditions);
      }
      const products = [];
      for (let i = 0; i < reaction.getProducts(); i++) {
        products.push(reaction.getProduct(i));
      }
      result += this.getStructuresFromMolecules(products);
      return `<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">${result}</div>`;
    } catch (error) {
      return `<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">${safeTagsReplace(String(error))}</div>`;
    }
  }

  /**
   * Renders a reaction from an RXN file.
   * @param {string} rxn - The content of the RXN file.
   * @returns {string} The HTML of the reaction, or the escaped text of the error met.
   */
  renderRXN(rxn) {
    try {
      let parsed = parse(rxn);
      let result = this.getStructuresFromMolfile(parsed.reagents);
      if (parsed.reagents.length > 0 || parsed.products.length > 0) {
        result += this.getArrow();
      }
      result += this.getStructuresFromMolfile(parsed.products);
      return `<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">${result}</div>`;
    } catch (error) {
      return `<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">${safeTagsReplace(String(error))}</div>`;
    }
  }

  /**
   * Renders a reaction from an RXN file, with the conditions around its arrow.
   * The arrow is drawn even without an RXN file, and a parsing error is thrown.
   * @param {ReactionConditions & { rxn?: string }} [object] - The content of the RXN file (`rxn`) and the conditions.
   * @returns {string} The HTML of the reaction.
   */
  render(object = {}) {
    let result = '';
    let parsed;
    if (object.rxn) {
      parsed = parse(object.rxn);
      result += this.getStructuresFromMolfile(parsed.reagents);
    }

    result += this.getArrowWithConditions(object);

    if (object.rxn) {
      result += this.getStructuresFromMolfile(parsed.products);
    }

    return `<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">${result}</div>`;
  }

  /**
   * Draws the arrow with the conditions around it: catalyst, reagent and
   * solvent above; temperature, conditions and yield below.
   * @param {ReactionConditions} [conditions] - The text around the arrow.
   * @returns {string} The HTML of the arrow.
   */
  getArrowWithConditions(conditions = {}) {
    const hover = [];
    const under = [];
    if (conditions.catalyst) hover.push(this.getEscaped(conditions.catalyst));
    if (conditions.reagent) hover.push(this.getEscaped(conditions.reagent));
    if (conditions.solvent) hover.push(this.getEscaped(conditions.solvent));
    if (conditions.temperature) {
      under.push(this.getEscaped(conditions.temperature));
    }
    if (conditions.conditions) {
      under.push(this.getEscaped(conditions.conditions));
    }
    if (conditions.yield) under.push(this.getEscaped(conditions.yield));
    return this.getArrow(hover.join(', '), under.join(', '));
  }

  /**
   * Draws the arrow in `currentColor`, so it follows the text colour around it.
   * @param {string} [hover] - HTML written above the arrow.
   * @param {string} [under] - HTML written below the arrow.
   * @returns {string} The HTML of the arrow.
   */
  getArrow(hover = '', under = '') {
    return `<div style="font-family: arial, sans-serif; font-size: 10px">
    <div style="text-align: center; margin: 5px">${hover}</div>
    <div>
      <div
        style="top: 50%; position: relative; border-top: 2px solid currentColor; width: 100%; min-width: 70px"
      >
        <div
          style="position: absolute; right: -2px; top: -6px; border-top: 5px solid transparent; border-left: 10px solid currentColor;border-bottom: 5px solid transparent;"
        ></div>
      </div>
    </div>
    <div style="text-align: center; margin: 5px">
      ${under}
    </div>
  </div>`;
  }

  /**
   * Escapes a condition, unless the renderer is built with `escaped`, then
   * turns the digits that follow a letter into subscripts.
   * @param {string} value - The condition.
   * @returns {string} The HTML of the condition.
   */
  getEscaped(value) {
    if (this.escaped) return subscript(value);
    return subscript(safeTagsReplace(value));
  }

  /**
   * Draws OpenChemLib molecules, separated by `+` signs.
   * @param {object[]} molecules - The molecules.
   * @returns {string} The HTML of the structures.
   */
  getStructuresFromMolecules(molecules) {
    if (!molecules || molecules.length === 0) return '';
    const results = [];
    for (let molecule of molecules) {
      results.push(`<div>${this.getSVG(molecule)}</div>`);
    }
    return results.join('<div>+</div>');
  }

  /**
   * Draws molfiles, separated by `+` signs.
   * @param {string[]} structures - The molfiles.
   * @returns {string} The HTML of the structures.
   */
  getStructuresFromMolfile(structures) {
    if (!structures || structures.length === 0) return '';
    const results = [];
    for (let structure of structures) {
      let molecule = this.OCL.Molecule.fromMolfile(structure);
      results.push(`<div>${this.getSVG(molecule)}</div>`);
    }
    return results.join('<div>+</div>');
  }

  /**
   * Draws an OpenChemLib molecule as SVG, with its atom-mapping numbers when
   * `showMapping` is set.
   * @param {object} molecule - The molecule.
   * @returns {string} The SVG.
   */
  getSVG(molecule) {
    return molecule.toSVG(this.maxWidth, this.maxHeight, undefined, {
      autoCrop: true,
      autoCropMargin: 25,
      suppressChiralText: true,
      suppressCIPParity: true,
      suppressESR: true,
      noStereoProblem: true,
      showMapping: this.showMapping,
    });
  }
}

function subscript(string) {
  return string.replaceAll(
    /(?<letter>[A-Za-z])(?<digits>\d+)/g,
    '$<letter><sub>$<digits></sub>',
  );
}

let tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

function safeTagsReplace(str) {
  return str.replaceAll(/[&<>]/g, (tag) => tagsToReplace[tag] || tag);
}
