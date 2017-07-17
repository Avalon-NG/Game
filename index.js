const { STATE_MAP, ACTIONS } = require('./fsm-avalon');
const actionCreators = require('./actions');
const makeFSM = require('fsm-reducer');

const getFSM = () => {
	const { reducer, getValidateError, getActions } = makeFSM(STATE_MAP,ACTIONS);
	return {
		reducer,
		getValidateError,
		getActions
	}
}

module.exports = {
	getFSM,
	actionCreators
}