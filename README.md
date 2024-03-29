# rxn-renderer

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![npm download][download-image]][download-url]
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.6611392.svg)](https://doi.org/10.5281/zenodo.6611392)

.

## Installation

`$ npm install --save rxn-renderer`

## Usage

```js
import { RxnRenderer } from 'rxn-renderer';
import OCL from 'openchemlib';

const rxn = `$RXN

Rhea  rhea-util042920191555  10014
RHEA:release=104
  2  3
$MOL
CHEBI:58682
  CDK    2/12/10,15:28

 14 14  0  0  0  0  0  0  0  0999 V2000
   -2.8775    0.9500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -3.5907    0.5354    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.1593   -0.2854    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.8725   -0.7000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
   -2.1618    0.5396    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.4473    1.7771    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -1.4473    0.9521    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.7328    0.5396    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.0184    0.9521    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.6961    0.5396    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.4106    0.9521    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    2.1251    0.5396    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -3.5882   -0.2896    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -4.3027   -0.7021    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0 
  1  5  1  0  0  0  0 
  2 13  1  0  0  0  0 
 13  4  2  0  0  0  0 
  4  3  1  0  0  0  0 
  3  5  2  0  0  0  0 
  5  7  1  0  0  0  0 
  7  6  2  0  0  0  0 
  7  8  1  0  0  0  0 
  8  9  1  0  0  0  0 
  9 10  1  0  0  0  0 
 10 11  1  0  0  0  0 
 11 12  1  0  0  0  0 
 13 14  1  0  0  0  0 
M  CHG  1  11   1
M  END
$MOL
CHEBI:16240
  Marvin  12010510582D          

  4  3  0  0  0  0            999 V2000
    0.3572   -0.2063    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.3572    0.2063    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -1.0717   -0.2062    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.0717    0.2062    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  3  2  1  0  0  0  0
  4  1  1  0  0  0  0
M  END
$MOL
CHEBI:58413
  Mrv0541 04131511232D          

 14 15  0  0  1  0            999 V2000
    8.0491   -9.7491    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.7942   -8.9646    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.9692   -8.9646    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.3817  -10.2341    0.0000 N   0  3  0  0  0  0  0  0  0  0  0  0
    6.7143   -9.7491    0.0000 C   0  0  1  0  0  0  0  0  0  0  0  0
    5.9999  -10.1616    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.9999  -10.9867    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.2854   -9.7491    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.5710  -10.1616    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.5710  -10.9867    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.2854  -11.3992    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    5.9142   -9.5323    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.8566  -11.3911    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    7.3853  -11.0630    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
  4  1  1  0  0  0  0
  4  5  1  0  0  0  0
  1  2  1  0  0  0  0
  2  3  1  0  0  0  0
  3  5  1  0  0  0  0
  5  6  1  0  0  0  0
  7  6  2  0  0  0  0
  6  8  1  0  0  0  0
 11  7  1  0  0  0  0
 11 10  2  0  0  0  0
  8  9  2  0  0  0  0
  9 10  1  0  0  0  0
  5 12  1  6  0  0  0
 10 13  1  0  0  0  0
  4 14  1  0  0  0  0
M  CHG  1   4   1
M  END
$MOL
CHEBI:15377
  Marvin  01211112152D          

  3  2  0  0  0  0            999 V2000
   -0.4125    0.7145    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.4125   -0.7145    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  2  1  1  0  0  0  0
  2  3  1  0  0  0  0
M  END
$MOL
CHEBI:15379
  Marvin  02030822342D          

  2  1  0  0  0  0            999 V2000
   -0.4125    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.4125    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
M  STY  1   1 SUP
M  SAL   1  2   1   2
M  SMT   1 O2
M  END
`;

const rxnRenderer = new RxnRenderer(OCL, {
  maxWidth: 200,
  maxHeight: 100,
});
let html = rxnRenderer.renderRXN(rxn);
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/rxn-renderer.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/rxn-renderer
[travis-image]: https://img.shields.io/travis/cheminfo/rxn-renderer/main.svg?style=flat-square
[travis-url]: https://travis-ci.org/cheminfo/rxn-renderer
[download-image]: https://img.shields.io/npm/dm/rxn-renderer.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/rxn-renderer
