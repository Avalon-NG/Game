const makeFSMReducer = require('../fsm');
const { expect } = require('chai');
const { AVALON_STATE_MAP , AVALON_ACTIONS } = require('../fsm-avalon');
const { 
  ROLE_LIST, 
  NEEDED_KNIGHTS_LIST, 
  NEEDED_FAILED_LIST,
  STATUS_BEFORE_INIT,
	STATUS_INIT,
	STATUS_TEAM_BUILD,
	STATUS_TEAM_VOTING,
	STATUS_TEAM_VOTED,
	STATUS_MISSION,
	STATUS_MISSION_FINISHED,
	STATUS_GAMEOVER,
	STATUS_ASSASSIN,
	INIT_MISSION_RESULTS,
	INIT_CAPTAIN,
	INIT_ASSASSINATED,
	INIT_GODDESS_RESULTS
} = require('../config');
const validate = require('../validate');
const { 
  initGame,
  startRound,
  buildTeam,
  vote
} = require('../actions');

const TEST_VALUE_DEFAULT_VOTES_7 = [0,0,0,0,0,0,0];
const TEST_VALUE_DEFAULT_MISSIONS_7 = [0,0,0,0,0,0,0];
const TEST_VALUE_USER_7 = [0,1,2,3,4,5,6];
const TEST_VALUE_KNIGHTS_7_1 = [0,1]; 




const ACTION_INIT_GAME = 'ACTION_INIT_GAME';
const ACTION_START_ROUND = 'ACTION_START_ROUND';
const ACTION_BUILD_TEAM = 'ACTION_BUILD_TEAM';
const ACTION_VOTE_1_SUCCESS = 'ACTION_VOTE_1_SUCCESS';
const ACTION_VOTE_2_SUCCESS = 'ACTION_VOTE_2_SUCCESS';
const ACTION_VOTE_3_SUCCESS = 'ACTION_VOTE_3_SUCCESS';
const ACTION_VOTE_4_SUCCESS = 'ACTION_VOTE_4_SUCCESS';
const ACTION_VOTE_5_SUCCESS = 'ACTION_VOTE_5_SUCCESS';
const ACTION_VOTE_6_SUCCESS = 'ACTION_VOTE_6_SUCCESS';
const ACTION_VOTE_7_SUCCESS = 'ACTION_VOTE_7_SUCCESS';
const ACTION_VOTE_1_FAIL = 'ACTION_VOTE_1_FAIL';
const ACTION_VOTE_2_FAIL = 'ACTION_VOTE_2_FAIL';
const ACTION_VOTE_3_FAIL = 'ACTION_VOTE_3_FAIL';
const ACTION_VOTE_4_FAIL = 'ACTION_VOTE_4_FAIL';
const ACTION_VOTE_5_FAIL = 'ACTION_VOTE_5_FAIL';
const ACTION_VOTE_6_FAIL = 'ACTION_VOTE_6_FAIL';
const ACTION_VOTE_7_FAIL = 'ACTION_VOTE_7_FAIL';

const ACTION_MAP = {
  [ACTION_INIT_GAME] : initGame({ users : TEST_VALUE_USER_7 }),
  [ACTION_START_ROUND] : startRound(),
  [ACTION_BUILD_TEAM] : buildTeam({ knights : TEST_VALUE_KNIGHTS_7_1 }),
  [ACTION_VOTE_1_SUCCESS] : vote({ index : 0 , vote : 1 }),
  [ACTION_VOTE_1_FAIL] : vote({ index : 0 , vote : -1 }),
  [ACTION_VOTE_2_SUCCESS] : vote({ index : 1 , vote : 1 }),
  [ACTION_VOTE_2_FAIL] : vote({ index : 1 , vote : -1 }),
  [ACTION_VOTE_3_SUCCESS] : vote({ index : 2 , vote : 1 }),
  [ACTION_VOTE_3_FAIL] : vote({ index : 2 , vote : -1 }),
  [ACTION_VOTE_4_SUCCESS] : vote({ index : 3 , vote : 1 }),
  [ACTION_VOTE_4_FAIL] : vote({ index : 3 , vote : -1 }),
  [ACTION_VOTE_5_SUCCESS] : vote({ index : 4 , vote : 1 }),
  [ACTION_VOTE_5_FAIL] : vote({ index : 4 , vote : -1 }),
  [ACTION_VOTE_6_SUCCESS] : vote({ index : 5 , vote : 1 }),
  [ACTION_VOTE_6_FAIL] : vote({ index : 5 , vote : -1 }),
  [ACTION_VOTE_7_SUCCESS] : vote({ index : 6 , vote : 1 }),
  [ACTION_VOTE_7_FAIL] : vote({ index : 6 , vote : -1 }),
}

// const TEST_STEPS_BEFORE_INIT = 'TEST_STEPS_BEFORE_INIT';
// const TEST_STEPS_INIT = 'TEST_STEPS_INIT';
// const TEST_STEPS_FIRST_ROUND = 'TEST_STEPS_FIRST_ROUND';
// const TEST_STEPS_FIRST_BUILD_TEAM = 'TEST_STEPS_FIRST_BUILD_TEAM';
// const TEST_STEPS_FIRST_USER_VOTE_SUCCESS = 'TEST_STEPS_FIRST_USER_VOTE_SUCCESS';
// const TEST_STEPS_FIRST_DRAWRESULT_SUCCESS = 'TEST_STEPS_FIRST_DRAWRESULT_SUCCESS';

const TEST_STEPS_BEFORE_INIT = [];
const TEST_STEPS_INIT = [ACTION_INIT_GAME];
const TEST_STEPS_FIRST_ROUND = [ACTION_INIT_GAME,ACTION_START_ROUND];
const TEST_STEPS_FIRST_BUILD_TEAM = [ACTION_INIT_GAME,ACTION_START_ROUND,ACTION_BUILD_TEAM];
const TEST_STEPS_FIRST_USER_VOTE_SUCCESS = [ACTION_INIT_GAME,ACTION_START_ROUND,ACTION_BUILD_TEAM,ACTION_VOTE_1_SUCCESS];
const TEST_STEPS_ALL_SUCCESS = [
  ACTION_VOTE_1_SUCCESS,
  ACTION_VOTE_2_SUCCESS,
  ACTION_VOTE_3_SUCCESS,
  ACTION_VOTE_4_SUCCESS,
  ACTION_VOTE_5_SUCCESS,
  ACTION_VOTE_6_SUCCESS,
  ACTION_VOTE_7_SUCCESS
];
const TEST_STEPS_FIRST_DRAWRESULT_SUCCESS = TEST_STEPS_FIRST_BUILD_TEAM.concat(TEST_STEPS_ALL_SUCCESS);

const reducer = makeFSMReducer(AVALON_STATE_MAP,AVALON_ACTIONS,'FSM/');

const testHelper = (testSteps) => {
  let state = reducer(undefined,{});
  testSteps.forEach((el) => {
    state = reducer(state,ACTION_MAP[el]);
  })
  return state;
}

describe('basic 7 people game',()=>{

  describe('before init',() => {
    let state = testHelper(TEST_STEPS_BEFORE_INIT);
    it('status should be before init',()=>{
      expect(state.status).equal(STATUS_BEFORE_INIT);
    })
  })

  describe('init game',() => {
    let state = testHelper(TEST_STEPS_INIT);
    const { status, value } = state; 
    it('status should be init',()=>{
      expect(status).equal(STATUS_INIT);
    })
    it('users should be the same as TEST_VALUE_USER_7',()=>{
      expect(value.users).deep.equal(TEST_VALUE_USER_7);
    })
    it('goddessResults should be empty',()=>{
      expect(value.goddessResults).deep.equal([]);
    })
    it('neededKnights should be same as NEEDED_KNIGHTS_LIST',()=>{
      expect(value.neededKnights).deep.equal(NEEDED_KNIGHTS_LIST[7]);
    })
    it('neededFails should be same as NEEDED_FAILED_LIST',()=>{
      expect(value.neededFails).deep.equal(NEEDED_FAILED_LIST[7]);
    })
  })

  describe('first round, begin to choose knights',() => {
    let state = testHelper(TEST_STEPS_FIRST_ROUND);
    const { status, value } = state; 
    it('status should be team build',()=>{
      expect(status).equal(STATUS_TEAM_BUILD);
    })
    it('users should be the same as TEST_VALUE_DEFAULT_VOTES_7',()=>{
      expect(value.votes).deep.equal(TEST_VALUE_DEFAULT_VOTES_7);
    })
    it('users should be the same as TEST_VALUE_DEFAULT_MISSIONS_7',()=>{
      expect(value.missions).deep.equal(TEST_VALUE_DEFAULT_MISSIONS_7);
    })
  })

  describe('first round, after build team, begin to vote',() => {
    let state = testHelper(TEST_STEPS_FIRST_BUILD_TEAM);
    const { status, value } = state; 
    it('status should be team voting',()=>{
      expect(status).equal(STATUS_TEAM_VOTING);
    })
    it('knights should be the same as TEST_VALUE_DEFAULT_VOTES_7',()=>{
      expect(value.knights).deep.equal(TEST_VALUE_KNIGHTS_7_1);
    })
  })

  describe('first round, first user vote success',() => {
    let state = testHelper(TEST_STEPS_FIRST_USER_VOTE_SUCCESS);
    const { status, value } = state; 
    it('status should be team voting',()=>{
      expect(status).equal(STATUS_TEAM_VOTING);
    })
    it('votes should only first be 1, others are 0',()=>{
      expect(value.votes[0]).equal(1);
      expect(value.votes.slice(1,7).every((el) => el === 0)).equal(true);
    })
  })

  describe('first round, all user vote success',() => {
    let state = testHelper(TEST_STEPS_FIRST_DRAWRESULT_SUCCESS);
    const { status, value } = state; 
    it('status should be team voted',()=>{
      expect(status).equal(STATUS_TEAM_VOTED);
    })
    it('votes should all be 1',()=>{
      expect(value.votes.slice(0,7).every((el) => el === 1)).equal(true);
    })
  })

})


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
