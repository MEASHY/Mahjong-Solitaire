/** Class representing a WordSearch tile position. */
class Tile {
    /**
     * Create a TileNode
     * @param {context} state - The scene in which the sprite resides.
     * @param {number} x           - The x position of the TileNode in the Layout.
     * @param {number} y           - The y position of the TileNode in the Layout.
     * @param {number} height      - The height of the TileNode in the Layout.
     * @param {number} numChildren - The number of children this TileNode will have.
     * @see Layout
     */
     
     
    constructor(column, row, group) {

        this.isTerm = false,
        this.column = column,
        this.row = row,
        //console.log(gameProperties.topOffset+"   "+ gameProperties.leftOffset)
        this.x = gameProperties.leftOffset + column * gameProperties.tileWidth * gameProperties.scaleRatio,
        this.y = gameProperties.topOffset + row * gameProperties.tileHeight * gameProperties.scaleRatio,
        this.crc = false,
        //console.log(this.x),
        this.onClick = new Phaser.EventEmitter(),
        this.sprite,
        this.group = group
    }

    check () {
        tile.onClick.dispatch(tile)
        click()
    }
    
    setSprite (value) {
        this.sprite = scene.add.sprite(this.x, this.y, value).setOrigin(0)
        //console.log(this.sprite)
        this.group.add(this.sprite)
        this.sprite.setScale(gameProperties.scaleRatio)
        this.sprite.inputEnabled = true;
        this.sprite.on('pointerdown', function () {  
            this.check()
        }, this)
    }
    
    updatePosition () {
        this.x = this.column * gameProperties.tileWidth * gameProperties.scaleRatio + gameProperties.leftOffset
        this.y = this.row * gameProperties.tileHeight * gameProperties.scaleRatio + gameProperties.topOffset
        this.sprite.setPosition(this.x, this.y)
        this.sprite.setScale(gameProperties.scaleRatio)
    }
}
/*
var Tile = function(column, row, group, value) {

    this.isTerm = false;
    this.column = column;
    this.row = row;
    this.x = column * gameProperties.tileWidth// * gameProperties.scaleRatio;
    this.y = row * gameProperties.tileHeight //* gameProperties.scaleRatio;
    this.crc = false;
    console.log(this.x)
    this.onClick = new Phaser.EventEmitter();


    
    var tile = this;
    var currentState = value;
    //var sprite = game.add.sprite(this.x, this.y,  graphicAssets.tiles.name, currentState, group);
    //sprite.scale.setTo(gameProperties.scaleWidthRatio, gameProperties.scaleHeightRatio);
    names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    selNames = ['selA', 'selB', 'selC', 'selD', 'selE', 'selF', 'selG', 'selH', 'selI', 'selJ', 'selK', 'selL', 'selM', 'selN', 'selO', 'selP', 'selQ', 'selR', 'selS', 'selT', 'selU', 'selV', 'selW', 'selX', 'selY', 'selZ'];
    lockNames = ['lockA', 'lockB', 'lockC', 'lockD', 'lockE', 'lockF', 'lockG', 'lockH', 'lockI', 'lockJ', 'lockK', 'lockL', 'lockM', 'lockN', 'lockO', 'lockP', 'lockQ', 'lockR', 'lockS', 'lockT', 'lockU', 'lockV', 'lockW', 'lockX', 'lockY', 'lockZ'];

    this.tileIndex = names.indexOf(value);
    this.status = 0;
    var init = function() {
        console.log(this)
        this.sprite = scene.add.sprite(this.x, this.y, value, group);
        console.log(this.x)
       // console.log(gameProperties.scaleRatio)
       // this.sprite.setScale(gameProperties.scaleRatio);
        this.sprite.inputEnabled = true;
        this.sprite.on('pointerdown', function () {  
            check()
        }, this)
    };
    
    var rollOver = function() {
        var tween = game.add.tween(sprite);
        tween.to({x:tile.x-3, y:tile.y-3}, 100, Phaser.Easing.Exponential.easeOut);
        tween.start();
        
        //console.log("rollover");
        
    };
    
    var rollOut = function() {
        //console.log("rollOut");
        var tween = game.add.tween(sprite);
        tween.to({x:tile.x, y:tile.y}, 100, Phaser.Easing.Exponential.easeOut);
        tween.start();
        
        
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
*/