const checkEndGame = (state) => {
	if ( state.failedVotes >= 5 ) return 'GAMEOVER';
	const sum = state.missionResults.reduce((total, n) => total + n, 0);
	if ( sum <= -3 ) return 'GAMEOVER'; 
	return 'TEAM_BUILD';
}

const actions = {
	START_ROUND : () => {},
	BUILD_TEAM : (state,{knights}) => {
		return Object.assign({},state,{knights});
	},
	VOTE : (state,{ index , vote }) => {
		const votes = state.votes.slice(0);
		votes[index] = vote;

		return Object.assign({},state,{votes});
	},
	DRAW_VOTE_RESULT : (state) => {
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
	EXECUTE_MISSION : (state,{ index , mission }) => {

		const missions = state.missions.slice(0);
		missions[index] = mission;

		return Object.assign({},state,{missions});
	},
	DRAW_MISSION_RESULT : (state) => {
		const round = state.missionResults.length;
		const neededFailAmount = state.neededFails[round];
		const sum = state.missions.reduce((total, n) => total + n, 0);
		
		const missionResults = ( neededFailAmount <= sum ) ? 
			[].concat(state.missionResults, { result : -1,	amount : sum }) :
			[].concat(state.missionResults, { result : 0,	amount : sum })

		return Object.assign({},state,{ missionResults })
	},
	ASSASSINATE : (state,{assassinated}) => {
		return Object.assign({},state,{assassinated});
	}
};

const stateMap = {
	start : {
		status : 'INIT',
		value : {
			users : [],
			knights : [],
			votes : [0,0,0,0,0], // 0 = waiting ,-1 = reject ,1 = approve
			votesResult : false,
			failedVotes : 0,
			missions : [0,0,0,0,0], // -1 = waiting , 0 = not knight or yes , 1 = no
			missionResults : [], // -1 = fail , 0 = success  
			captain : 0,
			goddessResults : [6],
			assassinated : -1,
			neededKnights : [2,3,2,3,3],
			neededFails : [1,1,1,2,1]
		}
	},
	states : {
		INIT : {
			START_ROUND : checkEndGame,
		},
		TEAM_BUILD : {
			BUILD_TEAM : 'TEAM_VOTING'
		},
		TEAM_VOTING : {
			VOTE : (state) => {
				const finished = state.votes.indexOf(0) < 0;
				if ( !finished ) return 'TEAM_VOTING';
				return 'TEAM_VOTED';
			}
		},
		TEAM_VOTED : {
			DRAW_VOTE_RESULT : (state) => {
				if ( state.votesResult === true )	return 'MISSION'; 
				return 'INIT';
			}
		},
		MISSION : {
			EXECUTE_MISSION : (state) => {
				const finished = state.missions.indexOf(-1) < 0;
				if ( !finished ) return 'MISSION';
				return 'MISSION_FINISHED';
			}
		},
		MISSION_FINISHED : {
			DRAW_MISSION_RESULT : 'INIT'
		},
		ASSASSIN : {
			ASSASSINATE : 'GAMEOVER'
		},
		GAMEOVER : {
		}
	}
}

module.exports = {
	stateMap,
	actions
}
