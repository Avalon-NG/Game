const { STATE_MAP, ACTIONS } = require('./fsm-avalon');
const actionCreators = require('./actions');
const makeFSMReducer = require('fsm-reducer');

const getReducer = () => {
	return makeFSMReducer(STATE_MAP,ACTIONS);
}

module.exports = {
	getReducer,
	actionCreators
}