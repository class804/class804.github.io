function CMenu(){
    var _pStartPosAudio;
    var _pStartPosCredits;
    var _pStartPosFullscreen;
    var _pStartPosDelete;
	
    var _oBg;
    var _oButPlay;
    var _oAudioToggle;
    var _oButCredits;
    var _oButDeleteSave = null;
    var _oFade;
    var _oAreYouSurePanel;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oLoaderController;
    
    
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
	s_oStage.addChild(_oBg);
	
		

        _oButPlay = new CGfxButton((CANVAS_WIDTH/2) - 200,CANVAS_HEIGHT - 160,s_oSpriteLibrary.getSprite('but_play'),s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlaySingle, this);
        
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2)-10, y: (oSprite.height/2)+10};      
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
		
        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosCredits = {x:(oSprite.width/2) + 10,y:(oSprite.height/2) + 10};
        _oButCredits = new CGfxButton(_pStartPosCredits.x,_pStartPosCredits.y,oSprite,s_oStage);
        _oButCredits.addEventListener(ON_MOUSE_UP, this._onButCreditsRelease, this);
	
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x: _pStartPosCredits.x + oSprite.width/2 + 10,y:_pStartPosCredits.y};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        if(s_bStorageAvailable && getStoredTeamSelected() !== null){
            var oSprite = s_oSpriteLibrary.getSprite("but_delete_save");
            _pStartPosDelete = {x:oSprite.width/2 + 10,y:CANVAS_HEIGHT-oSprite.height/2-10};
            _oButDeleteSave = new CGfxButton(_pStartPosDelete.x,_pStartPosDelete.y,oSprite,s_oStage);
            _oButDeleteSave.addEventListener(ON_MOUSE_UP,this._onDelete,this);
            
            s_iTeamSelected = getStoredTeamSelected();
            s_aTeamSeq = getOpponentSeq();
            s_iLastLevel = getSavedLevel();
            trace("s_iLastLevel "+s_iLastLevel)
        }
        
        if(!s_bStorageAvailable){
            new CAlertSavingBox(TEXT_ERR_LS,s_oStage);
        }
        
        _oAreYouSurePanel = new CAreYouSurePanel();
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,this._onConfirmDelete,this);
        
        _oLoaderController = new CLoaderResourcesPanel(s_oStage);
        _oLoaderController.addEventListener(ON_END_LOADING,this._onEndLoading,this);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 400).call(function(){_oFade.visible = false;}); 
        
        setVolume("soundtrack",1);
	this.refreshButtonPos();		
    };
    
    this.unload = function(){
        _oLoaderController.unload();
        
        _oButPlay.unload(); 
        _oButCredits.unload();
        if(_oButDeleteSave !== null){
            _oButDeleteSave.unload();
        }

        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        s_oStage.removeAllChildren();
	s_oMenu = null;
    };
	
    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
	_oButCredits.setPosition(_pStartPosCredits.x + s_iOffsetX,_pStartPosCredits.y + s_iOffsetY);
        
        if(_oButDeleteSave !== null){
            _oButDeleteSave.setPosition(_pStartPosDelete.x + s_iOffsetX,_pStartPosDelete.y-s_iOffsetY);
        }
    };
    
    this._onButPlaySingle = function(){
        s_oMain.pokiShowCommercial(()=>{
            if(_oButDeleteSave === null){
                s_oMenu.unload();
                s_oMain.gotoChooseMenu();
            }else if(s_aTeamLoaded[s_iTeamSelected]){
                s_oMenu.unload();
                s_oMain.gotoLevelMenu();
            }else{
                var aResources = new Array();
                for(var k=0;k<2;k++){
                    aResources.push({name:"player"+s_iTeamSelected+"_run_"+k,path:"./sprites/player_"+s_iTeamSelected+"/player"+s_iTeamSelected+"_run_"+k+".png"});
                }

                for(var k=0;k<6;k++){
                    aResources.push({name:"player"+s_iTeamSelected+"_touchdown_"+k,path:"./sprites/player_"+s_iTeamSelected+"/player"+s_iTeamSelected+"_touchdown_"+k+".png"});
                }

                for(var k=0;k<7;k++){
                    aResources.push({name:"player"+s_iTeamSelected+"_jump_"+k,path:"./sprites/player_"+s_iTeamSelected+"/player"+s_iTeamSelected+"_jump_"+k+".png"});
                }


                aResources.push({name:"player"+s_iTeamSelected+"_falling",path:"./sprites/player_"+s_iTeamSelected+"/player"+s_iTeamSelected+"_falling.png"});

                _oLoaderController.start(aResources);

            }

            $(s_oMain).trigger("start_session");
        });
            
        
        
    };
    
    this._onEndLoading = function(){
        s_aTeamLoaded[s_iTeamSelected] = true;
        
        s_oMenu.unload();
        s_oMain.gotoLevelMenu();
    };
	
    this._onButCreditsRelease = function(){
        new CCreditsPanel();
    };

    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
	s_bAudioActive = !s_bAudioActive;
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.enabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };

    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    this._onDelete = function(){
        _oAreYouSurePanel.show(TEXT_CONFIRM_DELETE);
    };
    
    this._onConfirmDelete = function(){
        clearLocalStorage();
        _oButDeleteSave.unload();
        _oButDeleteSave = null;
    };
    
    s_oMenu = this;
	
    this._init();
}

var s_oMenu = null;