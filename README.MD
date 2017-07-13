# fsm-avalon

```javascript
const { getReducer, actionCreators } = require('fsm-avalon');
const reducer = getReducer();
let state = reducer({}, actionCreators.startRound());

```