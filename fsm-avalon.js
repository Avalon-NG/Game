const {
	STATUS_BEFORE_INIT,
	STATUS_INIT,
	STATUS_TEAM_BUILD,
	STATUS_TEAM_VOTING,
	STATUS_TEAM_VOTED,
	STATUS_MISSION,
	STATUS_MISSION_FINISHED,
	STATUS_GAMEOVER_SUCCESS,
	STATUS_GAMEOVER_FAIL,
	STATUS_ASSASSIN,
	ACTION_INIT_GAME,
	ACTION_START_ROUND,
	ACTION_BUILD_TEAM,
	ACTION_VOTE,
	ACTION_DRAW_VOTES_RESULT,
	ACTION_EXECUTE_MISSION,
	ACTION_DRAW_MISSIONS_RESULT,
	ACTION_ASSASSINATE,
	NEEDED_FAILED_LIST,
	NEEDED_KNIGHTS_LIST,
	ROLE_MERLIN,
	STATUS_GODDESS,
	STATUS_GODDESS_FINISHED,
	ACTION_DRAW_GODDESS_RESULT,
	ACTION_EXECUTE_GODDESS
} = require('./config');

const checkAssassinate = (state) => {
	const { assassinated , users } = state;
	const isCorrect = users[assassinated].role === ROLE_MERLIN;
	return isCorrect ? STATUS_GAMEOVER_FAIL : STATUS_GAMEOVER_SUCCESS;
}

const checkEndGame = (state) => {
	if ( state.failedVotes >= 5 ) return STATUS_GAMEOVER_FAIL;

	const failedMissionsAmount = state.missionResults.filter((el) => el.result === false ).length;
	const succeedMissionsAmount = state.missionResults.filter((el) => el.result === true ).length;
	if ( failedMissionsAmount >= 3 ) return STATUS_GAMEOVER_FAIL; 
	if ( succeedMissionsAmount >= 3 ) return STATUS_ASSASSIN; 

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
		const missions = new Array(userAmount).fill(undefined).map((el,i) => {
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

		return Object.assign({},state,{ 
			missionResults
		 })
	},
	[ACTION_ASSASSINATE] : (state,{ index }) => {
		return Object.assign({},state,{
			assassinated : index 
		});
	}
};

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
			missionResults : [], // -1 = fail , 1 = success  
			captain : -1,
			goddessResults : [], 
			assassinated : -1,
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
		[STATUS_GODDESS] : {
			[ACTION_EXECUTE_GODDESS] : STATUS_GODDESS_FINISHED
		},
		[STATUS_GODDESS_FINISHED] : {
			[ACTION_DRAW_GODDESS_RESULT] : STATUS_TEAM_BUILD
		},
		[STATUS_ASSASSIN] : {
			[ACTION_ASSASSINATE] : checkAssassinate
		},
		[STATUS_GAMEOVER_SUCCESS] : {
		},
		[STATUS_GAMEOVER_FAIL] : {

		}
	}
}

const VALIDATE_MAP = {
	[ACTION_INIT_GAME] : (state, { users, isSetGoddess = false }) => {
		const usersAmount = users.length;
		if ( usersAmount < 5 ){
			return 'users should be greater or qual to 5.';
		} else if ( usersAmount > 10 ){
			return 'users should be less or qual to 10';
		}

		return null;
	},
	[ACTION_BUILD_TEAM] : (state,{knights}) => {
		const { neededKnights, missionResults, users } = state;
		const userAmount = users.length;
		const round = missionResults.length;
		const neededKnight = neededKnights[round];
		if ( knights.length !== neededKnight ){
			return 'error amount of knights';
		}
		if ( new Set(knights).size !== knights.length ){
			return 'cannot have same index';
		}
		if ( knights.filter((el) => el < 0 || el > userAmount - 1 ).length !== 0 ){
			return 'error index';
		}
		
		return null;
	},
	[ACTION_VOTE] : (state,{ index , vote }) => {
		return null;
	},
	[ACTION_DRAW_VOTES_RESULT] : (state) => {
		return null;
	},
	[ACTION_EXECUTE_MISSION] : (state,{ index , mission }) => {
		return null;
	},
	[ACTION_DRAW_MISSIONS_RESULT] : (state) => {
		return null;
	},
	[ACTION_ASSASSINATE] : (state,{ index }) => {
		return null;
	}
};

module.exports = {
	STATE_MAP,
	ACTIONS,
	VALIDATE_MAP
}
