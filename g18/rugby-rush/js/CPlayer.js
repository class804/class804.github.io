function CPlayer(iX,iY,oParentContainer){
    var _bUpdate = false;
    var _bJumping;
    var _bLeft = false;
    var _bRight = false;
    var _iCurAnim;
    var _iPlayerWidth;
    var _iPlayerHeight;
    var _iStartX;
    var _iStartY;
    var _iCurAcceleration;
    var _iCurMaxSpeed;
    var _iXMove;
    var _iWidthSprite;
    var _iHeightSprite;
    var _aAnim;
    var _aAnimNumFrames;
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oThis = this;
    var _oContainer;
    var _oParentContainer;
    
    this._init = function(iX,iY){
        _bJumping = false;
        _iStartX = iX;
        _iStartY = iY;
        _iXMove = 0;
        _iPlayerWidth = 609;
        _iPlayerHeight = 448;
        _iCurAcceleration = HERO_ACCELERATION;
        _iCurMaxSpeed = MAX_HERO_SPEED;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
       
        _aAnim = new Array();
        _aAnimNumFrames = new Array();
        _aAnimNumFrames[PLAYER_ANIM_RUN] = 18;
        _aAnimNumFrames[PLAYER_ANIM_FALL] = 9;
        _aAnimNumFrames[PLAYER_ANIM_TOUCHDOWN] = 50;
        _aAnimNumFrames[PLAYER_ANIM_JUMP] = 26;
        
       
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
            animations: {start: 0, anim: [0,_aAnimNumFrames[PLAYER_ANIM_RUN]-1]}
        };

        var oSpriteSheetRun = new createjs.SpriteSheet(oData);
        _aAnim[PLAYER_ANIM_RUN] = new createjs.Sprite(oSpriteSheetRun,"start");
        _aAnim[PLAYER_ANIM_RUN].regX = _iPlayerWidth/2;
        _aAnim[PLAYER_ANIM_RUN].regY = _iPlayerHeight;

        _oContainer.addChild(_aAnim[PLAYER_ANIM_RUN]);
        
        
        var oData = {
            images: [s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_falling')],
            // width, height & registration point of each sprite
           frames: {width:611, height:450},
            animations: {start: 0, anim: [0,_aAnimNumFrames[PLAYER_ANIM_FALL]-1,"stop_anim"],stop_anim:_aAnimNumFrames[PLAYER_ANIM_FALL]}
        };

        var oSpriteSheetFall = new createjs.SpriteSheet(oData);
        _aAnim[PLAYER_ANIM_FALL] = new createjs.Sprite(oSpriteSheetFall,"start");
        _aAnim[PLAYER_ANIM_FALL].on("animationend",this._onPlayerFall,this);
        _aAnim[PLAYER_ANIM_FALL].visible = false;
        _aAnim[PLAYER_ANIM_FALL].regX = _iPlayerWidth/2;
        _aAnim[PLAYER_ANIM_FALL].regY = _iPlayerHeight;
        _oContainer.addChild(_aAnim[PLAYER_ANIM_FALL]);
        
        

        var oData = {
            images: [s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_touchdown_0'),
                    s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_touchdown_1'),
                    s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_touchdown_2'),
                    s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_touchdown_3'),
                    s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_touchdown_4'),
                    s_oSpriteLibrary.getSprite('player'+s_iTeamSelected+'_touchdown_5')],
            // width, height & registration point of each sprite
            frames: {width:611, height:450},
            animations: {start: 0, anim: [0,_aAnimNumFrames[PLAYER_ANIM_TOUCHDOWN]-1,"stop_anim"],stop_anim:_aAnimNumFrames[PLAYER_ANIM_TOUCHDOWN]-1}
        };

        var oSpriteSheetTouchdown = new createjs.SpriteSheet(oData);
        _aAnim[PLAYER_ANIM_TOUCHDOWN] = new createjs.Sprite(oSpriteSheetTouchdown,"start");
        _aAnim[PLAYER_ANIM_TOUCHDOWN].on("animationend",this._onPlayerTouchdown,this);
        _aAnim[PLAYER_ANIM_TOUCHDOWN].visible = false;
        _aAnim[PLAYER_ANIM_TOUCHDOWN].regX = _iPlayerWidth/2;
        _aAnim[PLAYER_ANIM_TOUCHDOWN].regY = _iPlayerHeight;
        _oContainer.addChild(_aAnim[PLAYER_ANIM_TOUCHDOWN]);
        
        
        
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
            animations: {start: 0, anim: [0,_aAnimNumFrames[PLAYER_ANIM_JUMP]-1,"stop_anim"],stop_anim:_aAnimNumFrames[PLAYER_ANIM_JUMP]}
        };

        var oSpriteSheetJump = new createjs.SpriteSheet(oData);
        _aAnim[PLAYER_ANIM_JUMP] = new createjs.Sprite(oSpriteSheetJump,"start");
        _aAnim[PLAYER_ANIM_JUMP].on("animationend",this._onPlayerJump);
        _aAnim[PLAYER_ANIM_JUMP].visible = false;
        _aAnim[PLAYER_ANIM_JUMP].x = -200;
        _aAnim[PLAYER_ANIM_JUMP].y = -220
        _aAnim[PLAYER_ANIM_JUMP].regX = _iPlayerWidth/2;
        _aAnim[PLAYER_ANIM_JUMP].regY = _iPlayerHeight;
        _oContainer.addChild(_aAnim[PLAYER_ANIM_JUMP]);
        

        _iCurAnim = PLAYER_ANIM_RUN;
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.show = function(){

        _aAnim[_iCurAnim].visible = true;
        _aAnim[_iCurAnim].gotoAndPlay("anim");
        
        _oContainer.visible = true;
        
        _iWidthSprite = _oContainer.getBounds().width-300;
        _iHeightSprite = _oContainer.getBounds().height;
        /*
        var oShapeRect = new createjs.Shape();
        oShapeRect.graphics.beginFill("blue").drawRect(-_iWidthSprite/2, -_iHeightSprite, _iWidthSprite,_iHeightSprite);
        oShapeRect.alpha = 0.5;
        _oContainer.addChild(oShapeRect);
        
       */
       _bUpdate = true;
    };
    
    this.hide = function(){
        _bUpdate = false;
        _oContainer.visible = false;
    };
    
    this.reset = function(){
        _bUpdate = false;
        _bJumping = false;
        _bLeft = false;
        _bRight = false;
        _iXMove = 0;
        _iCurAcceleration = HERO_ACCELERATION;
        _iCurMaxSpeed = MAX_HERO_SPEED;
        
        _oContainer.alpha = 1;
        _oContainer.x = _iStartX;
        _oContainer.y = _iStartY;

        _aAnim[PLAYER_ANIM_RUN].visible = false
        _aAnim[PLAYER_ANIM_FALL].visible = false;
        _aAnim[PLAYER_ANIM_TOUCHDOWN].visible = false;
        _aAnim[PLAYER_ANIM_JUMP].visible = false;
        
        
        _iCurAnim = PLAYER_ANIM_RUN;
    };
    
    this.changeAnim = function(iAnim){
        if(_iCurAnim === -1){
            return;
        }
        
        _aAnim[_iCurAnim].visible = false;
        _aAnim[_iCurAnim].gotoAndStop("start");
        _iCurAnim = iAnim;
        _aAnim[_iCurAnim].visible = true;
        _aAnim[_iCurAnim].gotoAndPlay("anim");
    };
    
    this.jump = function(){
        _bJumping = true;
        this.changeAnim(PLAYER_ANIM_JUMP);
    };
    
    this.moveLeft = function(bLeft){
        _bLeft = bLeft;
    };

    this.moveRight = function(bRight){
        _bRight = bRight;
    };
    
    this.setAcceleration = function(iAcceleration,iMax){
        _iCurAcceleration = iAcceleration;
        _iCurMaxSpeed = iMax;
    };
    
    this.setY = function(iY){
        _oContainer.y = iY;
    };
    
    this._onPlayerFall = function(evt){
        if(evt.currentTarget.currentAnimation === "anim"){
            _oThis.hide();
            if(_aCbCompleted[ON_PLAYER_TACKLED]){
                 _aCbCompleted[ON_PLAYER_TACKLED].call(_aCbOwner[ON_PLAYER_TACKLED]);
            }
        }
    };
    
    this._onPlayerTouchdown = function(evt){
        if(evt.currentTarget.currentAnimation === "anim"){
            new createjs.Tween.get(_oContainer).to({alpha:0},500);
            if(_aCbCompleted[ON_PLAYER_TOUCHDOWN]){
                 _aCbCompleted[ON_PLAYER_TOUCHDOWN].call(_aCbOwner[ON_PLAYER_TOUCHDOWN]);
            }
            _iCurAnim = -1;
        }
        
    };
    
    this._onPlayerJump = function(evt){
        if(evt.currentTarget.currentAnimation === "anim"){
            _bJumping = false;
            _oThis.changeAnim(PLAYER_ANIM_RUN);
        }  
    };
    
    this.getRect = function(){
        return new createjs.Rectangle(_oContainer.x-_iWidthSprite/2,_oContainer.y -_iHeightSprite,_iWidthSprite,_iHeightSprite);
    };
    
    this.isJumping = function(){
        return _bJumping;
    };
    
    this.getCurAnim = function(){
        return _iCurAnim;
    };
    
    this.getX = function(){
        return _oContainer.x;
    };
    
    this._updateMove = function(){
        if(_iCurAnim !== PLAYER_ANIM_RUN){
            return;
        }

        if(_bLeft){
            _iXMove -= _iCurAcceleration;
        }
        if(_bRight){
            _iXMove += _iCurAcceleration;
        }

        _oContainer.x += _iXMove;

        _iXMove *= HERO_FRICTION;
        if (_iXMove > _iCurMaxSpeed) {
                _iXMove = _iCurMaxSpeed;
        }
        
        if (_iXMove < -_iCurMaxSpeed) {
                _iXMove = -_iCurMaxSpeed;
        }

        if ( Math.abs(_iXMove) < 0.1 ) {
                _iXMove = 0;
        }
		
	if( ((_oContainer.x  + _iXMove) > CANVAS_WIDTH-s_iOffsetX)){  
            _oContainer.x = CANVAS_WIDTH  - _iXMove-s_iOffsetX;
        }
        
        if((_oContainer.x -  _iXMove)<s_iOffsetX) {
            _oContainer.x = _iXMove+s_iOffsetX;
        }
    };
            
    this.update = function(){
        if(_bUpdate === false){
            return;
        }

        this._updateMove();
    };
    
    _oParentContainer = oParentContainer;
    this._init(iX,iY);
}