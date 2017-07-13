const { 
  ROLE_LIST, 
  NEEDED_KNIGHTS_LIST, 
  NEEDED_FAILED_LIST,
  STATUS_BEFORE_INIT,
	STATUS_INIT,
	STATUS_TEAM_BUILD,
	STATUS_VOTING,
	STATUS_VOTED,
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
	INIT_ASSASSINATED,
	INIT_GODDESS_RESULTS
} = require('./config');

const initGame = ({ users, isSetGoddess = false }) => {
	return {
		type : ACTION_INIT_GAME,
		users,
		isSetGoddess
	}
}

const startRound = () => {
	return {
		type : ACTION_START_ROUND
	}
}

const buildTeam = ({ knights }) => {
	return {
		type : ACTION_BUILD_TEAM,
		knights 
	}
}

const vote = ({ index , vote }) => {
	return {
		type : ACTION_VOTE,
		index,
		vote
	}
}

const drawVotesResult = () => {
	return {
		type : ACTION_DRAW_VOTES_RESULT
	}
}

const executeMission = ({ index, mission }) => {
	return {
		type : ACTION_EXECUTE_MISSION,
		index,
		mission
	}
}

const drawMissionsResult = () => {
	return {
		type : ACTION_DRAW_MISSIONS_RESULT
	}
}

module.exports = {
	initGame,
	startRound,
	buildTeam,
	vote,
	drawVotesResult,
	executeMission,
	drawMissionsResult
}