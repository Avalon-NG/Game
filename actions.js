const { 
  ACTION_INIT_GAME,
	ACTION_START_ROUND,
	ACTION_BUILD_TEAM,
	ACTION_VOTE,
	ACTION_DRAW_VOTES_RESULT,
	ACTION_EXECUTE_MISSION,
	ACTION_DRAW_MISSIONS_RESULT,
	ACTION_ASSASSINATE,
	ACTION_DRAW_GODDESS_RESULT,
	ACTION_EXECUTE_GODDESS
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

const assassin = ( index ) => {
	return {
		type : ACTION_ASSASSINATE,
		index
	}
}

const executeGoddess = ( index ) => {
	return {
		type : ACTION_EXECUTE_GODDESS,
		index
	}
}

const drawGoddessResult = () => {
	return {
		type : ACTION_DRAW_GODDESS_RESULT
	}
}

module.exports = {
	initGame,
	startRound,
	buildTeam,
	vote,
	drawVotesResult,
	executeMission,
	drawMissionsResult,
	assassin,
	executeGoddess,
	drawGoddessResult
}