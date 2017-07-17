# fsm-avalon
[![build status](https://img.shields.io/travis/avalon-ng/fsm-avalon/master.svg?style=flat-square)](https://travis-ci.org/avalon-ng/fsm-avalon)
[![npm version](https://img.shields.io/npm/v/fsm-avalon.svg?style=flat-square)](https://www.npmjs.com/package/fsm-avalon)
## Install
```
npm install --save fsm-avalon
```
## Usage
```javascript
const { getFSM, actionCreators } = require('fsm-avalon');
const { reducer, getValidateError, getActions } = getFSM();

let state = reducer({}, actionCreators.startRound());

```
### Actions
```javascript
// init the game
initGame({
  users,
  isSetGoddess
});
// start the round
startRound();
// build the knights to mission
buildTeam({
  knights
});
// vote
vote({
  index,
  vote // -1 for reject, 1 for approve
});
// draw votes result
drawVotesResult();
// the knight execute mission
executeMission({
  index,
  mission // -1 for fail, 1 for success
});
// draw missions result
drawMissionsResult();
// assassin
assassin(index);
```
