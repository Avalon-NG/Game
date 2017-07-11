const fsm = require('../fsm');
const { expect } = require('chai');
const { stateMap , actions} = require('../fsm-avalon');
 



// store.dispatch({ type : 'FSM/START_ROUND' });
// expect
// store.dispatch({ type : 'FSM/BUILD_TEAM' , knights : [1,2,3] });
// store.dispatch({ type : 'FSM/VOTE' , index : 1 , vote : 1 });
// store.dispatch({ type : 'FSM/VOTE' , index : 2 , vote : 1 });
// store.dispatch({ type : 'FSM/VOTE' , index : 3 , vote : 1 });
// store.dispatch({ type : 'FSM/VOTE' , index : 4 , vote : 1 });
// store.dispatch({ type : 'FSM/VOTE' , index : 0 , vote : 1 });
// store.dispatch({ type : 'FSM/DRAW_VOTE_RESULT' });
// store.dispatch({ type : 'FSM/EXECUTE_MISSION' , index : 1 , mission : 0 });
// store.dispatch({ type : 'FSM/EXECUTE_MISSION' , index : 2 , mission : 0 });
// store.dispatch({ type : 'FSM/EXECUTE_MISSION' , index : 3 , mission : 0 });
// store.dispatch({ type : 'FSM/DRAW_MISSION_RESULT' });
describe('fsm',()=>{
  it('xxx',()=>{
    let reducer = fsm(stateMap,actions);
    let s = reducer(undefined,{ type : 'FSM/XXX' });
    expect(s.value.users.length).to.equal(0);
  })
})