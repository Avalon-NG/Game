const {
	STATUS_BEFORE_INIT,
	STATUS_INIT,
	STATUS_TEAM_BUILD,
	STATUS_TEAM_VOTING,
	STATUS_TEAM_VOTED,
	STATUS_MISSION,
	STATUS_MISSION_FINISHED,
	STATUS_GAMEOVER,
	STATUS_ASSASSIN,
	ACTION_INIT_GAME,
	ACTION_START_ROUND,
	ACTION_BUILD_TEAM,
	ACTION_VOTE,
	ACTION_DRAW_VOTE_RESULT,
	ACTION_EXECUTE_MISSION,
	ACTION_DRAW_MISSION_RESULT,
	ACTION_ASSASSINATE,
	INIT_MISSION_RESULTS,
	INIT_CAPTAIN,
	INIT_ASSASSINATED,
	INIT_GODDESS_RESULTS,
	NEEDED_FAILED_LIST,
	ROLE_LIST,
	NEEDED_KNIGHTS_LIST
} = require('./config');

const checkEndGame = (state) => {
	if ( state.failedVotes >= 5 ) return STATUS_GAMEOVER;
	const sum = state.missionResults.reduce((total, n) => total + n, 0);
	if ( sum <= -3 ) return STATUS_GAMEOVER; 
	return STATUS_TEAM_BUILD;
}

const AVALON_ACTIONS = {
	[ACTION_INIT_GAME] : (state, { users, isSetGoddess = false }) => {
		const userAmount = users.length;
		return Object.assign({},state,{
			users : users.slice(0),
			goddessResults : ( isSetGoddess === true ) ? [userAmount-1] : [],
			neededKnights : NEEDED_KNIGHTS_LIST[userAmount].slice(0),
			neededFails : NEEDED_FAILED_LIST[userAmount].slice(0)
		});
	},
	[ACTION_START_ROUND] : (state) => {
		const userAmount = state.users.length;
		return Object.assign({},state,{
			votes : new Array(userAmount).fill(0),
			missions : new Array(userAmount).fill(0)
		})
	},
	[ACTION_BUILD_TEAM] : (state,{knights}) => {
		return Object.assign({},state,{knights});
	},
	[ACTION_VOTE] : (state,{ index , vote }) => {
		const votes = state.votes.slice(0);
		votes[index] = vote;
		return Object.assign({},state,{votes});
	},
	[ACTION_DRAW_VOTE_RESULT] : (state) => {
		const sum = state.votes.reduce((total, n) => total + n, 0);
		const failedVotes = state.failedVotes;
		let missions = new Array(state.votes.length).fill(0);
		const knights = state.knights;
		knights.forEach((el)=>{
			missions[el] = -1;
		})
		return Object.assign({},state, {
			failedVotes : ( sum > 0 ) ? 0 : failedVotes + 1,
			votesResult : sum > 0,
			captain : ( state.captain >= state.users.length - 1 ) ? state.captain + 1 : 0,
			missions
		});
	},
	[ACTION_EXECUTE_MISSION] : (state,{ index , mission }) => {

		const missions = state.missions.slice(0);
		missions[index] = mission;

		return Object.assign({},state,{missions});
	},
	[ACTION_DRAW_MISSION_RESULT] : (state) => {
		const round = state.missionResults.length;
		const neededFailAmount = state.neededFails[round];
		const sum = state.missions.reduce((total, n) => total + n, 0);
		
		const missionResults = ( neededFailAmount <= sum ) ? 
			[].concat(state.missionResults, { result : -1,	amount : sum }) :
			[].concat(state.missionResults, { result : 0,	amount : sum })

		return Object.assign({},state,{ missionResults })
	},
	[ACTION_ASSASSINATE] : (state,{assassinated}) => {
		return Object.assign({},state,{assassinated});
	}
};

/*

	init begin start (same value all state)
	missionResults,captain,goddessResults,assassinated

	config begin start
	users,votes,goddessResults,neededKnights,neededFails

	init every round (same value all state)
	knights, votes, votesResult,

	config every round 
	failedVotes,missions,missionResults,captain,goddessResults

*/

const AVALON_STATE_MAP = {
	start : {
		status : STATUS_BEFORE_INIT,
		value : {
			users : [],
			knights : [],
			votes : [], // 0 = waiting ,-1 = reject ,1 = approve
			votesResult : false,
			failedVotes : 0,
			missions : [], // -1 = waiting , 0 = not knight or yes , 1 = no
			missionResults : INIT_MISSION_RESULTS.slice(0), // -1 = fail , 0 = success  
			captain : INIT_CAPTAIN,
			goddessResults : INIT_GODDESS_RESULTS, // if no set, empty
			assassinated : INIT_ASSASSINATED,
			neededKnights : [],
			neededFails : []
		}
	},
	states : {
		[STATUS_BEFORE_INIT] : {
			[ACTION_INIT_GAME] : STATUS_INIT
		},
		[STATUS_INIT] : {
			[ACTION_START_ROUND] : checkEndGame,
		},
		[STATUS_TEAM_BUILD] : {
			[ACTION_BUILD_TEAM] : STATUS_TEAM_VOTING
		},
		[STATUS_TEAM_VOTING] : {
			[ACTION_VOTE] : (state) => {
				const finished = state.votes.indexOf(0) < 0;
				if ( !finished ) return STATUS_TEAM_VOTING;
				return STATUS_TEAM_VOTED;
			}
		},
		[STATUS_TEAM_VOTED] : {
			[ACTION_DRAW_VOTE_RESULT] : (state) => {
				if ( state.votesResult === true )	return STATUS_MISSION; 
				return STATUS_INIT;
			}
		},
		STATUS_MISSION : {
			[ACTION_EXECUTE_MISSION] : (state) => {
				const finished = state.missions.indexOf(-1) < 0;
				if ( !finished ) return STATUS_MISSION;
				return STATUS_MISSION_FINISHED;
			}
		},
		[STATUS_MISSION_FINISHED] : {
			[ACTION_DRAW_MISSION_RESULT] : STATUS_INIT
		},
		ACTION_DRAW_VOTE_RESULT : {
			[ACTION_ASSASSINATE] : STATUS_GAMEOVER
		},
		[STATUS_GAMEOVER] : {
		}
	}
}


module.exports = {
	AVALON_STATE_MAP,
	AVALON_ACTIONS
}
