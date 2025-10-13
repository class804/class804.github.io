function clearLocalStorage(){
    s_iLastLevel = 1;
    s_iTeamSelected = 0;
    s_aTeamSeq = [];
    for(var i=0;i<NUM_TEAMS;i++){
        s_aTeamLoaded[i] = false;
    }
    
    if(s_bStorageAvailable){
        var iCont = 0;
        while(iCont < localStorage.length){
            var szKey = localStorage.key(iCont);
 
            if(szKey.indexOf(LOCALSTORAGE_STRING) !== -1){
                localStorage.removeItem(szKey);
            }else{
                iCont++;
            }
        }
    }
};

//localStorage.clear();
function setLocalStorageLevel(iLevel){
    if(!s_bStorageAvailable){
        return;
    }
    var iSavedLevel = getItem(LOCALSTORAGE_STRING+"level");
    if(iSavedLevel === null || iSavedLevel < iLevel){
        s_iLastLevel = iLevel;
        saveItem(LOCALSTORAGE_STRING+"level", s_iLastLevel);
    }
};

function setLocalStorageScore(iCurScore,iLevel){
    if(!s_bStorageAvailable){
        return;
    }
    saveItem(LOCALSTORAGE_STRING+"score_level_"+iLevel, iCurScore);
};

function setOpponentSeq(){
    if(!s_bStorageAvailable){
        return;
    }
    saveItem(LOCALSTORAGE_STRING+"opponent_seq", JSON.stringify(s_aTeamSeq));
};

function setTeam(){
    saveItem(LOCALSTORAGE_STRING+"team",s_iTeamSelected);
};




function getLevelScore(iLevel){
    if(!s_bStorageAvailable){
        return 0;
    }
    
    var iScore = getItem(LOCALSTORAGE_STRING+"score_level_"+iLevel );
    if(iScore){
        return iScore;
    }else{
        return 0;
    }
}

function getScoreTillLevel(iLevel){
    if(!s_bStorageAvailable){
        return 0;
    }

    var iScore = 0;
    for(var i=0;i<iLevel-1;i++){
        iScore += parseInt(getItem(LOCALSTORAGE_STRING+"score_level_"+(i+1) ));
    }

    return iScore;
};
    
function getSavedLevel(){
    if(!s_bStorageAvailable){
        return 1;
    }

    var iSavedLevel = getItem(LOCALSTORAGE_STRING+"level");
    if(iSavedLevel === null){
        return 1;
    }else{
        return iSavedLevel;
    }
};

function getOpponentSeq(){
    if(!s_bStorageAvailable){
        return [];
    }
    
    return JSON.parse(getItem(LOCALSTORAGE_STRING+"opponent_seq"));
};

function getStoredTeamSelected(){
    if(!s_bStorageAvailable){
        return 0;
    }
    
    return getItem(LOCALSTORAGE_STRING+"team");

};