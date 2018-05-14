var Tile = function(column, row, group, value, top, left) {

    this.isTerm = false;
    this.column = column;
    this.row = row;
    this.x = left + column * gameProperties.tileWidth * gameProperties.scaleRatio;
    this.y = top + row * gameProperties.tileHeight * gameProperties.scaleRatio;
    this.crc = false;
    
    this.onClick = new Phaser.Signal();


    
    var tile = this;
    var currentState = value;
    //var sprite = game.add.sprite(this.x, this.y,  graphicAssets.tiles.name, currentState, group);
    //sprite.scale.setTo(gameProperties.scaleWidthRatio, gameProperties.scaleHeightRatio);
    names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    selNames = ['selA', 'selB', 'selC', 'selD', 'selE', 'selF', 'selG', 'selH', 'selI', 'selJ', 'selK', 'selL', 'selM', 'selN', 'selO', 'selP', 'selQ', 'selR', 'selS', 'selT', 'selU', 'selV', 'selW', 'selX', 'selY', 'selZ'];
    lockNames = ['lockA', 'lockB', 'lockC', 'lockD', 'lockE', 'lockF', 'lockG', 'lockH', 'lockI', 'lockJ', 'lockK', 'lockL', 'lockM', 'lockN', 'lockO', 'lockP', 'lockQ', 'lockR', 'lockS', 'lockT', 'lockU', 'lockV', 'lockW', 'lockX', 'lockY', 'lockZ'];

    this.tileIndex = names.indexOf(value);
    this.status = 0;

    var sprite = game.add.sprite(this.x, this.y, value, group);
    sprite.scale.setTo(gameProperties.scaleRatio, gameProperties.scaleRatio);
    
    var init = function() {
        
        sprite.inputEnabled = true;
        sprite.input.useHandCursor = true;
        sprite.events.onInputOut.add(rollOut, this);
        sprite.events.onInputOver.add(rollOver, this);
        sprite.events.onInputDown.add(check, this);
    };
    
    var rollOver = function() {/*
        var tween = game.add.tween(sprite);
        tween.to({x:tile.x-3, y:tile.y-3}, 100, Phaser.Easing.Exponential.easeOut);
        tween.start();
        */
        //console.log("rollover");
        
    };
    
    var rollOut = function() {
        //console.log("rollOut");
        /*var tween = game.add.tween(sprite);
        tween.to({x:tile.x, y:tile.y}, 100, Phaser.Easing.Exponential.easeOut);
        tween.start();
        */
        
    };
    
    var check = function(){
        tile.onClick.dispatch(tile);
        click();
    };
    
    var click = function() {
        if(sprite.inputEnabled){
            if (!tile.status){
                    tile.status = 1;
                    currentState = selNames[tile.tileIndex];
            } else if (tile.status ==1 && tile.isTerm){
                tile.isTerm = false;
                currentState = names[tile.tileIndex];
                tile.status = 0;
            }
            sprite.loadTexture(currentState);
        }
    };
    
    this.enable = function (enable) {
        sprite.inputEnabled = enable;
    };
    
    // current state for Z should be 66
    this.correct = function(correct){
        currentState = lockNames[tile.tileIndex];
        tile.status = 3;
        sprite.loadTexture(currentState);
        
        tile.enable(false);
        tile.crc = true;
    }
    init();
}