function CLevelMenu(){
    var _iCurPage;
    var _iStartY;
    var _iHeightToggle;
    var _aLevelButs;
    var _iCurOpponent;
    var _aContainerPage;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    var _oLoaderController;
    var _oFade;
    var _oContainerPanel;
    var _oButExit;
    var _oAudioToggle;
    var _oArrowRight = null;
    var _oArrowLeft = null;
    var _oTextLevel;
    var _oContainer;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function(){
        _iCurPage = 0;
                
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        var oMainBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu_level'));
        _oContainer.addChild(oMainBg);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;
        _oContainer.addChild(_oFade);
        
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.x = CANVAS_WIDTH/2+90;
        _oContainer.addChild(_oContainerPanel);
        
        _oTextLevel = new CTLText(_oContainerPanel, 
                    0, 0, 600, 46, 
                    80, "center", "#ffffff", FONT_GAME, 1,
                    20, 2,
                    TEXT_SELECT_LEVEL,
                    true, true, true,
                    false );

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
	_pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2)-10,y:(oSprite.height/2)+10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        
        _aLevelButs = new Array();
        var aPos = [{x:0,y:150},{x:200,y:150},{x:400,y:150},{x:600,y:150},{x:0,y:350},{x:200,y:350},{x:400,y:350},{x:600,y:350},{x:100,y:550},{x:300,y:550},{x:500,y:550}];
        for(var i=0;i<NUM_LEVELS;i++){
            var oBut = new CLevelBut(aPos[i].x, aPos[i].y,s_aTeamSeq[i], i+1, getLevelScore(i+1),(i+1)>s_iLastLevel?false:true,_oContainerPanel);
            oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onButLevelRelease, this,i);
            _aLevelButs.push(oBut);
        }
        
        _oContainerPanel.regX = _oContainerPanel.getBounds().width/2;
        _oContainerPanel.regY = _oContainerPanel.getBounds().height/2;
        
        _iStartY = -_oContainerPanel.getBounds().height/2;
        _iHeightToggle = oSprite.height;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _pStartPosExit.x -(oSprite.width/2) - 10, y: _pStartPosExit.y};
            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
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
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x:oSprite.width/4 + 10,y:(oSprite.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }
        
        
        _oLoaderController = new CLoaderResourcesPanel(s_oStage);
        _oLoaderController.addEventListener(ON_END_LOADING,this._onEndLoading,this);
        
        
        this.refreshButtonPos();	
        
        _oFade.alpha = 0;
        _oContainerPanel.y = _iStartY;
        _oContainer.visible = true;
        
        createjs.Tween.get(_oFade).to({alpha:0.7}, 500);
        createjs.Tween.get(_oContainerPanel).to({y:CANVAS_HEIGHT/2}, 500,createjs.Ease.cubicOut);
    };
    
    this.unload = function(){
        for(var i=0;i<_aLevelButs.length;i++){
            _aLevelButs[i].unload();
        }  
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        _oLoaderController.unload();
        if(_oArrowLeft !== null){
            _oArrowLeft.unload();
            _oArrowRight.unload();
        }
        
        s_oStage.removeAllChildren();
        s_oLevelMenu = null;
    };
    
    this.refreshButtonPos = function(){

        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX,_pStartPosExit.y + s_iOffsetY);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }        
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX, _pStartPosFullscreen.y + s_iOffsetY);
        }
    };

    
    this._onRight = function(){
        _aContainerPage[_iCurPage].visible = false;
        
        _iCurPage++;
        if(_iCurPage >=  _aContainerPage.length){
            _iCurPage = 0;
        }
        
        _aContainerPage[_iCurPage].visible = true;
    };
    
    this._onLeft = function(){
        _aContainerPage[_iCurPage].visible = false;
        
        _iCurPage--;
        if(_iCurPage <  0){
            _iCurPage =_aContainerPage.length-1;
        }
        
        _aContainerPage[_iCurPage].visible = true;
    };
    
    this._onButLevelRelease = function(iLevel){
        
        _iCurOpponent = s_aTeamSeq[iLevel];
        s_oMain.levelSelected(iLevel+1);
        if(s_aTeamLoaded[_iCurOpponent]){
            s_oLevelMenu.unload();
            s_oMain.gotoGame(); 
        }else{
            var aResources = new Array();
           
            //LOAD RUN AHEAD ANIM
            for(var j=0;j<18;j++){
                aResources.push({name:"player"+_iCurOpponent+"_run_ahead_"+j,
                                 path:"./sprites/player_"+_iCurOpponent+"/enemy/running/player"+_iCurOpponent+"_run_ahead_"+j+".png"});
            }
            //LOAD TACKLE ANIM
            for(var j=0;j<18;j++){
                aResources.push({name:"player"+_iCurOpponent+"_tackle_"+j,
                                 path:"./sprites/player_"+_iCurOpponent+"/enemy/tackle/player"+_iCurOpponent+"_tackle_"+j+".png"});
            }
                
            _oLoaderController.start(aResources);
        }
        
    };
    
    this._onEndLoading = function(){
        s_aTeamLoaded[_iCurOpponent] = true;
        
        s_oLevelMenu.unload();
        s_oMain.gotoGame(); 
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
    
    this._onExit = function(){
        s_oLevelMenu.unload();
        s_oMain.gotoMenu();
    };

    s_oLevelMenu = this;
    this._init();
}

var s_oLevelMenu = null;