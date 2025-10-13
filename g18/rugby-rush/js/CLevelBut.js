function CLevelBut(iXPos, iYPos, iFlag,szTextMatch, szTextScore,bActive,oParentContainer) {
    var _bActive;
    var _aCbCompleted;
    var _aCbOwner;
    var _aButton = new Array();
    var _aParams = [];
    
    var _oFlag;
    var _oLevelTextOutline;
    var _oLevelText;
    var _oScoreTextOutline;
    var _oScoreText;
    var _oButton;
    var _oContainer;
    var _oParentContainer;

    this._init = function (iXPos, iYPos,iFlag, szTextMatch, szTextScore,bActive) {
        _aCbCompleted = new Array();
        _aCbOwner = new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
        _oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("but_level");
        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: oSprite.width / 2, height: oSprite.height, regX: (oSprite.width / 2) / 2, regY: oSprite.height / 2},
            animations: {state_true: [0], state_false: [1]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _bActive = bActive;
        _oButton = createSprite(oSpriteSheet, "state_" + _bActive, (oSprite.width / 2) / 2, oSprite.height / 2, oSprite.width / 2, oSprite.height);
		
        if (!s_bMobile){
            _oContainer.cursor = "pointer";
        }
        
        _oContainer.addChild(_oButton);
        _aButton.push(_oButton);
        
        var iColorText = "#fff";
        if(_bActive === false){
            iColorText = "#cacaca";
        }
        _oLevelTextOutline = new CTLText(_oContainer, 
                    -80, -80, 160, 30, 
                    30, "center", "#00397a", FONT_GAME, 1,
                    0, 0,
                    TEXT_LEVEL+" "+szTextMatch,
                    true, true, true,
                    false );
                   
        _oLevelTextOutline.setOutline(4);           

        _oLevelText = new CTLText(_oContainer, 
                    -80, -80, 160, 30, 
                    30, "center", iColorText, FONT_GAME, 1,
                    0, 0,
                    TEXT_LEVEL+" "+szTextMatch,
                    true, true, true,
                    false );

   
        var oData = {
            images: [s_oSpriteLibrary.getSprite("but_flag_"+iFlag)],
            // width, height & registration point of each sprite
            frames: {width: 124, height: 98, regX: 62, regY: 49},
            animations: {state_true: [0], state_false: [1]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oFlag = createSprite(oSpriteSheet,"state_" + _bActive,62,62,124,98);
        _oFlag.y = 4;
        _oContainer.addChild(_oFlag);
        
        if(szTextScore>0){
            _oScoreTextOutline = new CTLText(_oContainer, 
                        -84, 64, 168, 20, 
                        20, "center", "#00397a", FONT_GAME, 1,
                        0, 0,
                        TEXT_SCORE+" "+szTextScore,
                        true, true, true,
                        false );

            _oScoreTextOutline.setOutline(4);           

            _oScoreText = new CTLText(_oContainer, 
                        -84, 64, 168, 20, 
                        20, "center", iColorText, FONT_GAME, 1,
                        0, 0,
                        TEXT_SCORE+" "+szTextScore,
                        true, true, true,
                        false );
        }
        this._initListener();
    };

    this.unload = function () {
        _oContainer.off("mousedown", this.buttonDown);
        _oContainer.off("pressup", this.buttonRelease);

        _oContainer.removeChild(_oButton);
    };

    this._initListener = function () {
        _oContainer.on("mousedown", this.buttonDown);
        _oContainer.on("pressup", this.buttonRelease);
    };

    this.viewBut = function (oButton) {
        _oContainer.addChild(oButton);
    };

    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.addEventListenerWithParams = function (iEvent, cbCompleted, cbOwner, aParams) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };

    this.ifClickable = function () {
        if (_oContainer.mouseEnabled === true) {
            return 1;
        }
        return 0;
    };

    this.setActive = function (iLevel, bActive) {
        _bActive = bActive;
        _aButton[iLevel].gotoAndStop("state_" + _bActive);
        _aButton[iLevel].mouseEnabled = true;
        
    };

    this.buttonRelease = function () {
        if(!_bActive){
            return;
        }
        playSound("click", 1, false);

        if (_aCbCompleted[ON_MOUSE_UP]) {
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP], _aParams);
        }
    };

    this.buttonDown = function () {
        if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN], _aParams);
        }
    };

    this.setPosition = function (iXPos, iYPos) {
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
    };

    this.setVisible = function (bVisible) {
        _oContainer.visible = bVisible;
    };
    
    _oParentContainer = oParentContainer;
    this._init(iXPos, iYPos, iFlag,szTextMatch, szTextScore,bActive,oParentContainer);
}