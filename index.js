const { STATE_MAP, ACTIONS, VALIDATE_MAP } = require('./fsm-avalon');
const actionCreators = require('./actions');
const makeFSM = require('fsm-reducer');

const getFSM = () => {
  const { reducer, getValidateError, getActions } = makeFSM(STATE_MAP,ACTIONS,{ 
    validateMap : VALIDATE_MAP 
  });
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