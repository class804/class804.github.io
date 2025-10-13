function CCountdownController(iX,iY,oParentContainer){
    var _iCurSprite;
    var _aSprites;
    
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oContainer;
    var _oParentContainer = oParentContainer;
    var _oThis = this;
    
    this._init = function(iX,iY){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        _aSprites = new Array();
        
        for(var i=0;i<4;i++){
            var oSprite = s_oSpriteLibrary.getSprite("countdown_"+(4-i-1));
            var oNumber = createBitmap(oSprite);
            oNumber.regX = oSprite.width/2;
            oNumber.regY = oSprite.height/2;
            _oContainer.addChild(oNumber);

            _aSprites.push(oNumber);
        }
        
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.reset = function(){
        for(var i=0;i<_aSprites.length;i++){
            _aSprites[i].scaleX = _aSprites[i].scaleY = 0.1;
            _aSprites[i].alpha = 0;
        }
    };
    
    this.start = function(){
        _iCurSprite = 0;
        _oContainer.visible = true;
        this._playAnim();
    };
    
    this._playAnim = function(){
        if(_iCurSprite > 0){
             createjs.Tween.get(_aSprites[_iCurSprite-1]).to({alpha: 0}, 300, createjs.Ease.cubicOut);
        }
        
        if(_iCurSprite === _aSprites.length){
            if(_aCbCompleted[ON_END_COUNTDOWN]){
                _aCbCompleted[ON_END_COUNTDOWN].call(_aCbOwner[ON_END_COUNTDOWN]);
            }
        }else{
            createjs.Tween.get(_aSprites[_iCurSprite]).to({alpha: 1}, 300, createjs.Ease.cubicOut).call(function(){
                if(_iCurSprite === _aSprites.length-1){
                    playSound("go",1,false);
                }else{
                    playSound("countdown_"+(3-_iCurSprite),1,false);
                }
                
            });
            createjs.Tween.get(_aSprites[_iCurSprite]).to({scaleX: 1,scaleY:1}, 1000, createjs.Ease.quartOut).call(function(){
                                                                                                                _iCurSprite++;
                                                                                                                _oThis._playAnim();
                                                                                                            });
        }
        
        
    };
    
    this._init(iX,iY);
}