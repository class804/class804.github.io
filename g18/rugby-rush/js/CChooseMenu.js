function CChooseMenu(){
    var _aButFlags;
    var _aTeamPlayer;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosExit;
    
    var _oButPlay;
    var _oButExit;
    var _oText;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oLoaderController;
    var _oContainerFlags;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function(){

        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu_level'));
        s_oStage.addChild(oBg);
        
        _oText = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-420, 120, 580, 100, 
                    100, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_SELECT_TEAM,
                    true, true, true,
                    false );

        
        _oContainerFlags = new createjs.Container();
        _oContainerFlags.x = CANVAS_WIDTH/2-60;
        _oContainerFlags.y = CANVAS_HEIGHT/2+122;
        s_oStage.addChild(_oContainerFlags);
        
        
        _aButFlags = new Array();
        var iX  = 0;
        var iY = 0;
        for(var i=0;i<NUM_TEAMS;i++){
            var oFlag = new CButFlag(iX,iY,i,TEAM_NAMES[i],_oContainerFlags);
            oFlag.addEventListenerWithParams(ON_MOUSE_UP,this._onFlagSelected,this,i);
            
            iX += 150;
            if(i%4 === 3){
                iX = 0;
                iY += 150;
            }
            
            _aButFlags.push(oFlag);
        }
        
        _aButFlags[s_iTeamSelected].select();
                
        _oContainerFlags.regX = _oContainerFlags.getBounds().width/2;
        _oContainerFlags.regY = _oContainerFlags.getBounds().height/2;
        
        _aTeamPlayer = new Array();
        for(var i=0;i<NUM_TEAMS;i++){
            var oSpritePlayer = s_oSpriteLibrary.getSprite("team_"+i);
            var oBmp = createBitmap(oSpritePlayer);
            oBmp.x = CANVAS_WIDTH/2+380;
            oBmp.y = CANVAS_HEIGHT/2;
            oBmp.regX = oSpritePlayer.width/2;
            oBmp.regY = oSpritePlayer.height/2;
            s_oStage.addChild(oBmp);
            
            if(i!==s_iTeamSelected){
                oBmp.visible = false;
            }
            
            _aTeamPlayer.push(oBmp);
        }
        
        _oButPlay = new CTextButton(CANVAS_WIDTH/2+380,CANVAS_HEIGHT/2+235,s_oSpriteLibrary.getSprite("but_go"),TEXT_PLAY,FONT_GAME,"#fff",70,"right",40,s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_UP,this._onPlay,this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.width/2)- 10, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _pStartPosExit.x - (oSprite.width/2)- 10, y: _pStartPosExit.y};            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
  
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x: oSprite.width/4 + 10,y:(oSprite.height/2) + 10};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oLoaderController = new CLoaderResourcesPanel(s_oStage);
        _oLoaderController.addEventListener(ON_END_LOADING,this._onEndLoading,this);
        
        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        s_oStage.addChild(oFade);
        
        createjs.Tween.get(oFade).to({alpha:0}, 500).call(function(){oFade.visible = false;});  
        
        this.refreshButtonPos();
    };
    
    this.unload = function(){
        createjs.Tween.removeAllTweens();
        
        for(var i=0;i<_aButFlags.length;i++){
            _aButFlags[i].unload();
        }
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        _oLoaderController.unload();
        _oButPlay.unload();
        
        s_oStage.removeAllChildren();
        s_oChooseMenu = null;
    };
    
    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
        
        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX,_pStartPosExit.y + s_iOffsetY);
    };

    this._onFlagSelected = function(iFlag){
        _aButFlags[s_iTeamSelected].unselect();
        _aTeamPlayer[s_iTeamSelected].visible=false;
        
        s_iTeamSelected = iFlag;

        
        _aButFlags[s_iTeamSelected].select();
        _aTeamPlayer[s_iTeamSelected].visible=true;
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onEndLoading = function(){
        s_aTeamLoaded[s_iTeamSelected] = true;
        
        s_oChooseMenu.unload();
        s_oMain.gotoLevelMenu();
    };
    
    this._onExit = function(){
        s_oChooseMenu.unload();
        
        s_oMain.gotoMenu();
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
    
    this._onPlay = function(){
        s_oMain.createOpponentSeq();
        
        trace("s_aTeamLoaded["+s_iTeamSelected+"] "+s_aTeamLoaded[s_iTeamSelected])
       if(s_aTeamLoaded[s_iTeamSelected]){
            s_oChooseMenu.unload();
        
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
    };
    
    s_oChooseMenu = this;
    
    this._init();
}

var s_oChooseMenu = null;