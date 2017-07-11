const validate = () => {

}

const validateBuildTeam = (state, { knights }) => {
  if ( knights.length !== state.neededKnights[state.missionResults.length]) return false;
  return true ;
}

const validateMission = (state, { index , mission }) => {
    if ( !index 
      || index > state.missions.length 
      || index < 0
      || ( mission !== 0 && mission !== 1 )
    )  return false ;
    return true ;
}