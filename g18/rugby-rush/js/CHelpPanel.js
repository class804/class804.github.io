function CHelpPanel(){
    var _bHandState;
    var _iIntervalId;
    var _oListener;
    
    var _oFade;
    var _oKey0;
    var _oKey1;
    var _oKey2;
    var _oButStart;
    var _oRunningPlayer;
    var _oJumpingPlayer;
    var _oContainer;
    
    var _oThis = this;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oListener = _oFade.on("click",function(){});
        _oContainer.addChild(_oFade);
        
        var oSprite = s_oSpriteLibrary.getSprite("msg_box_wide");
        var oBg = createBitmap(oSprite);
        oBg.regX = oSprite.width/2;
        oBg.regY = oSprite.height/2;
        oBg.x = CANVAS_WIDTH/2;
        oBg.y = CANVAS_HEIGHT/2; 
        _oContainer.addChild(oBg);


        var oSpriteKey0;
        var oSpriteKey1;
        var oSpriteKey2;
        if(s_bMobile){
            oSpriteKey0 = s_oSpriteLibrary.getSprite("but_left");
            oSpriteKey1 = s_oSpriteLibrary.getSprite("but_right");
            oSpriteKey2 = s_oSpriteLibrary.getSprite("but_jump");
            
            _oKey2 = new CTextButton(CANVAS_WIDTH/2 + 240,CANVAS_HEIGHT/2 + 130,oSpriteKey2,TEXT_JUMP,FONT_GAME,"#fff",100,"center",0,_oContainer);
            _oKey2.setScale(0.65);
        }else{
            oSpriteKey0 = s_oSpriteLibrary.getSprite("key_0");
            oSpriteKey1 = s_oSpriteLibrary.getSprite("key_1");
            oSpriteKey2 = s_oSpriteLibrary.getSprite("key_2");
            
            _oKey2 = createBitmap(oSpriteKey2);
            _oKey2.regX = oSpriteKey2.width/2;
            _oKey2.regY = oSpriteKey2.height/2;
            _oKey2.x = CANVAS_WIDTH/2 + 240;
            _oKey2.y = CANVAS_HEIGHT/2 + 130;
            _oContainer.addChild(_oKey2);

        }

        _oKey0 = createBitmap(oSpriteKey0);
        _oKey0.regX = oSpriteKey0.width/2;
        _oKey0.regY = oSpriteKey0.height/2;
        _oKey0.x = CANVAS_WIDTH/2 - 310;
        _oKey0.y = CANVAS_HEIGHT/2 + 130;
        _oContainer.addChild(_oKey0);


        _oKey1 = createBitmap(oSpriteKey1);
        _oKey1.regX = oSpriteKey1.width/2;
        _oKey1.regY = oSpriteKey1.height/2;
        _oKey1.x = CANVAS_WIDTH/2 - 190;
        _oKey1.y = CANVAS_HEIGHT/2 + 130;
        _oContainer.addChild(_oKey1);


            
        _oRunningPlayer = this._attachPlayerRun();
        _oRunningPlayer.gotoAndPlay("anim");
        
        

        
        _oJumpingPlayer = this._attachPlayerJump();
        _oJumpingPlayer.on("animationend",this._onEndJump,this);
        
        _oButStart = new CGfxButton(CANVAS_WIDTH/2,CANVAS_HEIGHT/2,s_oSpriteLibrary.getSprite("but_next"),_oContainer);
        _oButStart.addEventListener(ON_MOUSE_UP,this._onStart,this);
        
        
        this._playAnims();
    };
    
    this.unload = function(){
        _oFade.off("click",_oListener);
    };
    
    this.show = function(){
        _bHandState = true;
        
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha:1},500);
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha:0} , 500,createjs.Ease.cubicOut).call(function(){
                                                                                    clearInterval(_iIntervalId);
                                                                                    _oContainer.visible = false;
                                                                                });
    };
    
    this._attachPlayerRun = function(){
        var iPlayerWidth = 609;
        var iPlayerHeight = 448;
        
        var oData = {
            images: [s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_run_0'),s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_run_1')],
            // width, height & registration point of each sprite
           "frames": [
                        [1, 1, 609, 448, 0, 0, 0],
                        [612, 1, 609, 448, 0, 0, 0],
                        [1223, 1, 609, 448, 0, 0, 0],
                        [1, 451, 609, 448, 0, 0, 0],
                        [612, 451, 609, 448, 0, 0, 0],
                        [1223, 451, 609, 448, 0, 0, 0],
                        [1, 901, 609, 448, 0, 0, 0],
                        [612, 901, 609, 448, 0, 0, 0],
                        [1223, 901, 609, 448, 0, 0, 0],
                        [1, 1351, 609, 448, 0, 0, 0],
                        [612, 1351, 609, 448, 0, 0, 0],
                        [1223, 1351, 609, 448, 0, 0, 0],
                        [1, 1, 609, 448, 1, 0, 0],
                        [612, 1, 609, 448, 1, 0, 0],
                        [1223, 1, 609, 448, 1, 0, 0],
                        [1, 451, 609, 448, 1, 0, 0],
                        [612, 451, 609, 448, 1, 0, 0],
                        [1223, 451, 609, 448, 1, 0, 0]
                    ],
            animations: {start: 0, anim: [0,17]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        var oSprite = new createjs.Sprite(oSpriteSheet,"start");
        oSprite.scaleX = oSprite.scaleY = 0.4;
        oSprite.x = CANVAS_WIDTH/2 - 320;
        oSprite.y = CANVAS_HEIGHT/2 + 70;
        oSprite.regX = iPlayerWidth/2;
        oSprite.regY = iPlayerHeight;
        _oContainer.addChild(oSprite);
        
        return oSprite;
    };
    
    this._attachPlayerJump = function(iX,iY){
        var iPlayerWidth = 609;
        var iPlayerHeight = 448;
        
        var oData = {
            images: [s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_jump_0'),
                     s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_jump_1'),
                     s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_jump_2'),
                     s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_jump_3'),
                     s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_jump_4'),
                     s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_jump_5'),
                     s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_jump_6')],
            // width, height & registration point of each sprite
           "frames": [
                        [1, 1, 993, 712, 0, 0, 0],
                        [996, 1, 993, 712, 0, 0, 0],
                        [1, 715, 993, 712, 0, 0, 0],
                        [996, 715, 993, 712, 0, 0, 0],
                        [1, 1, 993, 712, 1, 0, 0],
                        [996, 1, 993, 712, 1, 0, 0],
                        [1, 715, 993, 712, 1, 0, 0],
                        [996, 715, 993, 712, 1, 0, 0],
                        [1, 1, 993, 712, 2, 0, 0],
                        [996, 1, 993, 712, 2, 0, 0],
                        [1, 715, 993, 712, 2, 0, 0],
                        [996, 715, 993, 712, 2, 0, 0],
                        [1, 1, 993, 712, 3, 0, 0],
                        [996, 1, 993, 712, 3, 0, 0],
                        [1, 715, 993, 712, 3, 0, 0],
                        [996, 715, 993, 712, 3, 0, 0],
                        [1, 1, 993, 712, 4, 0, 0],
                        [996, 1, 993, 712, 4, 0, 0],
                        [1, 715, 993, 712, 4, 0, 0],
                        [996, 715, 993, 712, 4, 0, 0],
                        [1, 1, 993, 712, 5, 0, 0],
                        [996, 1, 993, 712, 5, 0, 0],
                        [1, 715, 993, 712, 5, 0, 0],
                        [996, 715, 993, 712, 5, 0, 0],
                        [1, 1, 993, 712, 6, 0, 0],
                        [996, 1, 993, 712, 6, 0, 0]
                    ],
            animations: {start: 0, anim: [0,25,"stop_anim"],stop_anim:25}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        var oSprite = new createjs.Sprite(oSpriteSheet,"start");
        oSprite.scaleX = oSprite.scaleY = 0.4;
        oSprite.x = CANVAS_WIDTH/2 + 180;
        oSprite.y = CANVAS_HEIGHT/2 - 35;
        oSprite.regX = iPlayerWidth/2;
        oSprite.regY = iPlayerHeight;
        _oContainer.addChild(oSprite);
        
        return oSprite;
    };
    
    this._playAnims = function(){
        var iRightX = _oRunningPlayer.x + 130;
        var iLeftX = _oRunningPlayer.x;
        
        _oKey1.scaleX = _oKey1.scaleY = 0.9;
        createjs.Tween.get(_oRunningPlayer,{loop:true}).to({x: iRightX}, 2000, createjs.Ease.cubicOut).call(function(){
                                                                _oKey1.scaleX = _oKey1.scaleY = 1;
                                                                _oKey0.scaleX = _oKey0.scaleY = 0.9;
                                                    }).to({x: iLeftX}, 2000, createjs.Ease.cubicOut).call(function(){
                                                                _oKey0.scaleX = _oKey0.scaleY = 1;
                                                                _oKey1.scaleX = _oKey1.scaleY = 0.9;
                                                    });
                                                    
                                                    
                                                    
        _iIntervalId = setInterval(function(){
                                    if(s_bMobile){
                                        _oKey2.setScale(0.6);
                                    }else{
                                        _oKey2.scaleX = _oKey2.scaleY = 0.9;
                                    }
                                    
                                    _oJumpingPlayer.gotoAndPlay("anim");
                                },3000);
    };
    
    this._onEndJump = function(evt){
        if(evt.currentTarget.currentAnimation === "anim"){
            if(s_bMobile){
                _oKey2.setScale(0.65);
            }else{
                _oKey2.scaleX = _oKey2.scaleY = 1;
            }
            
        }
    };
    
    this._onStart = function(){
        s_oInterface.removeKeyListener();
        _oButStart.disable();
        
        _oThis.hide();
        s_oGame.startCountdown();
    };
    
    this.isVisible = function(){
        return _oContainer.visible;
    };
    
    this._init();
}