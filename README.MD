# fsm-avalon
[![build status](https://img.shields.io/travis/avalon-ng/fsm-avalon/master.svg?style=flat-square)](https://travis-ci.org/avalon-ng/fsm-avalon)
[![npm version](https://img.shields.io/npm/v/fsm-avalon.svg?style=flat-square)](https://www.npmjs.com/package/fsm-avalon)
## Install
```
npm install --save fsm-avalon
```
## Usage
```javascript
const { getReducer, actionCreators } = require('fsm-avalon');
const reducer = getReducer();
let state = reducer({}, actionCreators.startRound());

```
