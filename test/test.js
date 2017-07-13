const makeFSMReducer = require('fsm-reducer');
const { expect } = require('chai');
const { STATE_MAP , ACTIONS } = require('../fsm-avalon');
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
  vote,
  drawVotesResult,
  executeMission,
  drawMissionsResult
} = require('../actions');

const TEST_VALUE_DEFAULT_VOTES_7 = [0,0,0,0,0,0,0];
const TEST_VALUE_DEFAULT_MISSIONS_7 = [undefined,undefined,undefined,undefined,undefined,undefined,undefined];
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
const ACTION_DRAW_VOTES_RESULT = 'ACTION_DRAW_VOTES_RESULT';

const ACTION_MISSION_1_SUCCESS = 'ACTION_MISSION_1_SUCCESS';
const ACTION_MISSION_2_SUCCESS = 'ACTION_MISSION_2_SUCCESS';
const ACTION_MISSION_3_SUCCESS = 'ACTION_MISSION_3_SUCCESS';
const ACTION_MISSION_4_SUCCESS = 'ACTION_MISSION_4_SUCCESS';
const ACTION_MISSION_5_SUCCESS = 'ACTION_MISSION_5_SUCCESS';
const ACTION_MISSION_6_SUCCESS = 'ACTION_MISSION_6_SUCCESS';
const ACTION_MISSION_7_SUCCESS = 'ACTION_MISSION_7_SUCCESS';
const ACTION_MISSION_1_FAIL = 'ACTION_MISSION_1_FAIL'; 
const ACTION_MISSION_2_FAIL = 'ACTION_MISSION_2_FAIL'; 
const ACTION_MISSION_3_FAIL = 'ACTION_MISSION_3_FAIL'; 
const ACTION_MISSION_4_FAIL = 'ACTION_MISSION_4_FAIL'; 
const ACTION_MISSION_5_FAIL = 'ACTION_MISSION_5_FAIL'; 
const ACTION_MISSION_6_FAIL = 'ACTION_MISSION_6_FAIL'; 
const ACTION_MISSION_7_FAIL = 'ACTION_MISSION_7_FAIL'; 

const ACTION_DRAW_MISSIONS_RESULT = 'ACTION_DRAW_MISSIONS_RESULT';

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
  [ACTION_DRAW_VOTES_RESULT] : drawVotesResult(),
  [ACTION_MISSION_1_SUCCESS] : executeMission({ index : 0 , mission : 1 }),
  [ACTION_MISSION_2_SUCCESS] : executeMission({ index : 1 , mission : 1 }),
  [ACTION_MISSION_3_SUCCESS] : executeMission({ index : 2 , mission : 1 }),
  [ACTION_MISSION_4_SUCCESS] : executeMission({ index : 3 , mission : 1 }),
  [ACTION_MISSION_5_SUCCESS] : executeMission({ index : 4 , mission : 1 }),
  [ACTION_MISSION_6_SUCCESS] : executeMission({ index : 5 , mission : 1 }),
  [ACTION_MISSION_7_SUCCESS] : executeMission({ index : 6 , mission : 1 }),
  [ACTION_MISSION_1_FAIL] : executeMission({ index : 0 , mission : -1 }),
  [ACTION_MISSION_2_FAIL] : executeMission({ index : 1 , mission : -1 }),
  [ACTION_MISSION_3_FAIL] : executeMission({ index : 2 , mission : -1 }),
  [ACTION_MISSION_4_FAIL] : executeMission({ index : 3 , mission : -1 }),
  [ACTION_MISSION_5_FAIL] : executeMission({ index : 4 , mission : -1 }),
  [ACTION_MISSION_6_FAIL] : executeMission({ index : 5 , mission : -1 }),
  [ACTION_MISSION_7_FAIL] : executeMission({ index : 6 , mission : -1 }),
  [ACTION_DRAW_MISSIONS_RESULT] : drawMissionsResult()
}

const TEST_STEPS_BEFORE_INIT = [];
const TEST_STEPS_INIT = [ACTION_INIT_GAME];
const TEST_STEPS_FIRST_ROUND = [ACTION_INIT_GAME,ACTION_START_ROUND];
const TEST_STEPS_FIRST_BUILD_TEAM = [ACTION_INIT_GAME,ACTION_START_ROUND,ACTION_BUILD_TEAM];
const TEST_STEPS_FIRST_USER_VOTE_SUCCESS = [ACTION_INIT_GAME,ACTION_START_ROUND,ACTION_BUILD_TEAM,ACTION_VOTE_1_SUCCESS];

const TEST_STEPS_VOTES_ALL_SUCCESS = [
  ACTION_VOTE_1_FAIL,
  ACTION_VOTE_2_FAIL,
  ACTION_VOTE_3_FAIL,
  ACTION_VOTE_4_SUCCESS,
  ACTION_VOTE_5_SUCCESS,
  ACTION_VOTE_6_SUCCESS,
  ACTION_VOTE_7_SUCCESS
];
const TEST_STEPS_VOTES_ALL_FAIL = [
  ACTION_VOTE_1_FAIL,
  ACTION_VOTE_2_FAIL,
  ACTION_VOTE_3_FAIL,
  ACTION_VOTE_4_FAIL,
  ACTION_VOTE_5_SUCCESS,
  ACTION_VOTE_6_SUCCESS,
  ACTION_VOTE_7_SUCCESS
];

const TEST_STEPS_VOTES_ALL_SUCCESS_DRAWRESULT = TEST_STEPS_VOTES_ALL_SUCCESS.concat(ACTION_DRAW_VOTES_RESULT);
const TEST_STEPS_VOTES_ALL_FAIL_DRAWRESULT = TEST_STEPS_VOTES_ALL_FAIL.concat(ACTION_DRAW_VOTES_RESULT);
const TEST_STEPS_ONE_VOTE_ROUND = [ACTION_START_ROUND,ACTION_BUILD_TEAM];
const TEST_STEPS_ONE_VOTE_ROUND_ALL_VOTES_FAIL_DRAWRESULT = TEST_STEPS_ONE_VOTE_ROUND.concat(TEST_STEPS_VOTES_ALL_FAIL).concat(ACTION_DRAW_VOTES_RESULT);

const TEST_STEPS_FIRST_ALL_VOTED_SUCCESS = TEST_STEPS_FIRST_BUILD_TEAM.concat(TEST_STEPS_VOTES_ALL_SUCCESS);
const TEST_STEPS_FIRST_ALL_VOTED_FAIL = TEST_STEPS_FIRST_BUILD_TEAM.concat(TEST_STEPS_VOTES_ALL_FAIL);
const TEST_STEPS_FIRST_DRAWRESULT_SUCCESS = TEST_STEPS_FIRST_ALL_VOTED_SUCCESS.concat(ACTION_DRAW_VOTES_RESULT);
const TEST_STEPS_FIRST_DRAWRESULT_FAIL = TEST_STEPS_FIRST_ALL_VOTED_FAIL.concat(ACTION_DRAW_VOTES_RESULT);

const TEST_STEPS_VOTE_5_FAIL = 
  TEST_STEPS_INIT
  .concat(TEST_STEPS_ONE_VOTE_ROUND_ALL_VOTES_FAIL_DRAWRESULT)
  .concat(TEST_STEPS_ONE_VOTE_ROUND_ALL_VOTES_FAIL_DRAWRESULT)
  .concat(TEST_STEPS_ONE_VOTE_ROUND_ALL_VOTES_FAIL_DRAWRESULT)
  .concat(TEST_STEPS_ONE_VOTE_ROUND_ALL_VOTES_FAIL_DRAWRESULT)
  .concat(TEST_STEPS_ONE_VOTE_ROUND_ALL_VOTES_FAIL_DRAWRESULT)
  .concat(ACTION_START_ROUND);

const reducer = makeFSMReducer(STATE_MAP,ACTIONS);

const testHelper = (state, testSteps) => {
  let _state, _testSteps;

  if ( state !== undefined && testSteps === undefined ) {
    _testSteps = typeof state === 'string' ? [state] : state.slice(0);
    _state = reducer(undefined,{});
  } else {
    _testSteps = typeof testSteps === 'string' ? [testSteps] : testSteps.slice(0);
    _state = Object.assign({},state);
  }

  _testSteps.forEach((el) => {
    _state = reducer(_state,ACTION_MAP[el]);
  })

  return _state;
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
    it('isSetGoddess should be default false',()=>{
      expect(value.config.isSetGoddess).equal(false);
    })
    it('goddessResults should only with the last index',()=>{
      expect(value.goddessResults).deep.equal([6]);
    })
    it('neededKnights should be same as NEEDED_KNIGHTS_LIST',()=>{
      expect(value.neededKnights).deep.equal(NEEDED_KNIGHTS_LIST[7]);
    })
    it('neededFails should be same as NEEDED_FAILED_LIST',()=>{
      expect(value.neededFails).deep.equal(NEEDED_FAILED_LIST[7]);
    })
    it('failedVotes should be 0',()=>{
      expect(value.failedVotes).equal(0);
    })
    it('captain should be -1',()=>{
      expect(value.captain).equal(-1);
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
    it('captain should be 0',()=>{
      expect(value.captain).equal(0);
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

  describe('first round, all user vote failed',() => {
    let state = testHelper(TEST_STEPS_FIRST_ALL_VOTED_FAIL);
    const { status, value } = state; 
    it('status should be team voted',()=>{
      expect(status).equal(STATUS_TEAM_VOTED);
    })
  })

  describe('first round, draw all fail votes result',() => {
    let state = testHelper(TEST_STEPS_FIRST_DRAWRESULT_FAIL);
    const { status, value } = state; 
    it('status should be init',()=>{
      expect(status).equal(STATUS_INIT);
    })
    it('failVotes should all be 1',()=>{
      expect(value.failedVotes).equal(1);
    })
    it('votesResult should be false',()=>{
      expect(value.votesResult).equal(false);
    })
  })

  describe('all fail votes 5 times',() => {
    let state = testHelper(TEST_STEPS_VOTE_5_FAIL);
    const { status, value } = state; 
    it('status should be gameover',()=>{
      expect(status).equal(STATUS_GAMEOVER);
    })
    it('failVotes should all be 5',()=>{
      expect(value.failedVotes).equal(5);
    })
    it('votesResult should be false',()=>{
      expect(value.votesResult).equal(false);
    })
    it('captain should be 5',()=>{
      expect(value.captain).equal(5);
    })
  })

  describe('first round, draw all fail votes result',() => {
    let state = testHelper(TEST_STEPS_FIRST_DRAWRESULT_FAIL);
    const { status, value } = state; 
    it('status should be init',()=>{
      expect(status).equal(STATUS_INIT);
    })
    it('failVotes should all be 1',()=>{
      expect(value.failedVotes).equal(1);
    })
    it('votesResult should be false',()=>{
      expect(value.votesResult).equal(false);
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
    let state = testHelper(TEST_STEPS_FIRST_ALL_VOTED_SUCCESS);
    const { status, value } = state; 
    it('status should be team voted',()=>{
      expect(status).equal(STATUS_TEAM_VOTED);
    })
  })
  
  describe('first round, draw all success votes result',() => {
    let state = testHelper(TEST_STEPS_FIRST_BUILD_TEAM.concat(TEST_STEPS_VOTES_ALL_SUCCESS_DRAWRESULT));
    const { status, value } = state; 
    it('status should be mission',()=>{
      expect(status).equal(STATUS_MISSION);
    })
    it('failVotes should all be 0',()=>{
      expect(value.failedVotes).equal(0);
    })
    it('votesResult should be true',()=>{
      expect(value.votesResult).equal(true);
    })
    it('missions should init to undefined, knights be 0',() => {
      let shouldMissions = TEST_VALUE_DEFAULT_MISSIONS_7.slice(0);
      TEST_VALUE_KNIGHTS_7_1.forEach((el) => { shouldMissions[el] = 0 });
      expect(value.missions).deep.equal(shouldMissions);
    })
  })
  
  describe('excute mission',() => {
    const state = testHelper(TEST_STEPS_FIRST_BUILD_TEAM.concat(TEST_STEPS_VOTES_ALL_SUCCESS_DRAWRESULT));
    describe('do one mission',() => {      
      it('should return correct state',() => {
        const _state = testHelper(state,ACTION_MISSION_2_SUCCESS);
        const { status, value } = _state;
        expect(status).equal(STATUS_MISSION);
        expect(value.missions[0]).equal(0);
        expect(value.missions[1]).equal(1);
        expect(value.missions[2]).equal(undefined);
      })
    })
    describe('do all missions',() => {
      it('should return correct state',() => {
        const _state = testHelper(state,[
          ACTION_MISSION_1_SUCCESS,
          ACTION_MISSION_2_SUCCESS
        ]);
        const { status, value } = _state; 
        expect(status).equal(STATUS_MISSION_FINISHED);
      })
    })
  })

  describe('draw missions result',() => {
    const state = testHelper(TEST_STEPS_FIRST_BUILD_TEAM.concat(TEST_STEPS_VOTES_ALL_SUCCESS_DRAWRESULT));
    describe('mission success',() => {
      const _state = testHelper(state,[
        ACTION_MISSION_1_SUCCESS,
        ACTION_MISSION_2_SUCCESS,
        ACTION_DRAW_MISSIONS_RESULT
      ]);
      it('should return correct state',() => {
        const { status, value } = _state;
        expect(status).equal(STATUS_INIT);
        expect(value.missionResults).deep.equal([{ result : true , failAmount : 0 , successAmount : 2 }]);
      })
    })
    describe('mission fail',() => {
      const _state = testHelper(state,[
        ACTION_MISSION_1_SUCCESS,
        ACTION_MISSION_2_FAIL,
        ACTION_DRAW_MISSIONS_RESULT
      ]);
      it('should return correct state',() => {
        const { status, value } = _state;
        expect(status).equal(STATUS_INIT);
        expect(value.missionResults).deep.equal([{ result : false , failAmount : 1 , successAmount : 1 }]);
      })
    })
  })

  // describe('gameover',() => {
  //   const state = testHelper(TEST_STEPS_FIRST_BUILD_TEAM.concat(TEST_STEPS_VOTES_ALL_SUCCESS_DRAWRESULT));
  //   describe('reach 3 missions fail',() => {
  //     let _state = reducer(state,executeMission({ index : 1 , mission : 1 }));
  //     _state = reducer(_state,executeMission({ index : 0 , mission : 1 }));
  //     _state = reducer(_state,drawMissionsResult());
  //     _state = testHelper(_state,TEST_STEPS_VOTES_ALL_SUCCESS_DRAWRESULT);
  //     //console.log(_state);
  //   })
  // })

})
