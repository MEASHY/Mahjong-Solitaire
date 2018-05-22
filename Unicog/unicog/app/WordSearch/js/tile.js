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
     
     
    constructor(column, row) {

        this.isTerm = false,
        this.value = "",
        this.y = row,
        this.x = column,
        this.xPos = gameProperties.leftOffset + this.x * gameProperties.tileWidth * gameProperties.scaleRatio,
        this.yPos = gameProperties.topOffset + this.y * gameProperties.tileHeight * gameProperties.scaleRatio,
        this.correct = false,
        this.selected = false,
        this.onSelect = new Phaser.EventEmitter(),
        this.onEnter = new Phaser.EventEmitter(),
        this.onSubmit = new Phaser.EventEmitter(),
        this.sprite
    }
    
    setSprite (value) {
        this.value = value
        this.sprite = scene.add.sprite(this.xPos, this.yPos, value).setOrigin(0).setInteractive()
        this.sprite.setScale(gameProperties.scaleRatio)
        this.sprite.on('pointerdown', function () { 
            console.log("Ponterdown") 
            emitter.emit("tileSelect", this)
        }, this)
        this.sprite.on('pointerover', function () {  
            //console.log("Enter Tile")
            emitter.emit("tileEnter", this)
        }, this)
        this.sprite.on('pointerup', function () {  
            //console.log("Submit")
            emitter.emit("tileSubmit")
        }, this)
    }
    //depreciated old even function
    click() {
        if (!this.selected){
            this.selected = true
            this.sprite.setTexture("sel"+this.value)
            this.isTerm = true
        } else if (this.selected && this.isTerm){
            this.isTerm = false
            this.sprite.setTexture(this.value)
            this.selected = false
        }

    }
    
    select(select = true) {
        if(select){
            this.sprite.setTexture("sel"+this.value)
        } else {
            if(this.correct) {
                this.sprite.setTexture("lock"+this.value)        
            } else {
                this.sprite.setTexture(this.value)            
            }
        }   
    }

    correct (correct) {
        currentState = lockNames[tile.tileIndex];
        sprite.loadTexture(currentState);
        
        tile.enable(false);
        tile.correct = true;
    }
    
    updatePosition () {
        this.xPos = this.x * gameProperties.tileWidth * gameProperties.scaleRatio + gameProperties.leftOffset
        this.yPos = this.y * gameProperties.tileHeight * gameProperties.scaleRatio + gameProperties.topOffset
        this.sprite.setPosition(this.xPos, this.yPos)
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
