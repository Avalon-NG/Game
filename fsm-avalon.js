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
	ACTION_DRAW_VOTES_RESULT,
	ACTION_EXECUTE_MISSION,
	ACTION_DRAW_MISSIONS_RESULT,
	ACTION_ASSASSINATE,
	INIT_MISSION_RESULTS,
	INIT_CAPTAIN,
	INIT_FAIL_VOTES,
	INIT_ASSASSINATED,
	INIT_GODDESS_RESULTS,
	NEEDED_FAILED_LIST,
	ROLE_LIST,
	NEEDED_KNIGHTS_LIST
} = require('./config');

const checkEndGame = (state) => {
	if ( state.failedVotes >= 5 ) return STATUS_GAMEOVER;
	const failedMissionsAmount = state.missionResults.filter((el) => el.result === false ).length;

	if ( failedMissionsAmount >= 3 ) return STATUS_GAMEOVER; 
	return STATUS_TEAM_BUILD;
}

const ACTIONS = {
	[ACTION_INIT_GAME] : (state, { users, isSetGoddess = false }) => {
		const userAmount = users.length;
		return Object.assign({},state,{
			users : users.slice(0),
			config : {
				isSetGoddess
			},
			goddessResults : [userAmount-1],
			neededKnights : NEEDED_KNIGHTS_LIST[userAmount].slice(0),
			neededFails : NEEDED_FAILED_LIST[userAmount].slice(0),
			failVotes : 0,
			captain : -1
		});
	},
	[ACTION_START_ROUND] : (state) => {
		const userAmount = state.users.length;
		return Object.assign({},state,{
			votes : new Array(userAmount).fill(0),
			missions : new Array(userAmount).fill(0),
			captain : (state.captain + 1) % userAmount
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
	[ACTION_DRAW_VOTES_RESULT] : (state) => {
		const { failedVotes, knights, users , captain, votes } = state;
		const voteSum = votes.reduce((total, n) => total + n, 0);
		const userAmount = users.length;
		let missions = new Array(userAmount).fill(undefined).map((el,i) => {
			return knights.indexOf(i) >= 0 ? 0 : undefined ;
		});
		return Object.assign({},state, {
			failedVotes : ( voteSum > 0 ) ? 0 : failedVotes + 1,
			votesResult : voteSum > 0,
			missions
		});
	},
	[ACTION_EXECUTE_MISSION] : (state,{ index , mission }) => {

		let missions = state.missions.slice(0);
		missions[index] = mission;

		return Object.assign({},state,{missions});
	},
	[ACTION_DRAW_MISSIONS_RESULT] : (state) => {
		const round = state.missionResults.length;
		const neededFailAmount = state.neededFails[round];
		const failAmount = state.missions.filter((el) => el === -1 ).reduce((total, n) => total - n, 0);
		const successAmount = state.missions.filter((el) => el === 1 ).reduce((total, n) => total + n, 0);
		const missionResults = state.missionResults.concat({
			failAmount,
			successAmount,
			result : neededFailAmount > failAmount
		});

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

const STATE_MAP = {
	start : {
		status : STATUS_BEFORE_INIT,
		value : {
			users : [],
			knights : [],
			votes : [], // 0 = waiting ,-1 = reject ,1 = approve
			votesResult : false,
			failedVotes : 0,
			missions : [], // undefined = no , 0 = waiting, -1 = fail , 1 = success , 
			missionResults : INIT_MISSION_RESULTS.slice(0), // -1 = fail , 1 = success  
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
			[ACTION_DRAW_VOTES_RESULT] : (state) => {
				if ( state.votesResult === true )	return STATUS_MISSION; 
				return STATUS_INIT;
			}
		},
		[STATUS_MISSION] : {
			[ACTION_EXECUTE_MISSION] : (state) => {
				const finished = state.missions.indexOf(0) < 0;
				if ( !finished ) return STATUS_MISSION;
				return STATUS_MISSION_FINISHED;
			}
		},
		[STATUS_MISSION_FINISHED] : {
			[ACTION_DRAW_MISSIONS_RESULT] : STATUS_INIT
		},
		[STATUS_ASSASSIN] : {
			[ACTION_ASSASSINATE] : STATUS_GAMEOVER
		},
		[STATUS_GAMEOVER] : {
		}
	}
}


module.exports = {
	STATE_MAP,
	ACTIONS
}
