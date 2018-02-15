var Tile = function (column, row, group, value, top, left) {
    

    this.column = column;
    this.row = row;
    this.x = left + column * gameProperties.tileWidth * gameProperties.scaleRatio;
    this.y = top + row * gameProperties.tileHeight * gameProperties.scaleRatio;
    this.first = false;
    this.swap = 0;
    this.isBlack = 0;

    //event signal
    this.onClick = new Phaser.Signal();
    
    var tile = this;
    //Actor property
    this.currentState = 0;
    this.currentValue = value;
    var names = ['red1', 'blue1', 'green1', 'purple1', 'white1', 'orange1', 'yellow1'];
    var alts = ['red2', 'blue2', 'green2', 'purple2', 'white2', 'orange2', 'yellow2'];
    var black = ['redb', 'blueb', 'greenb', 'purpleb', 'whiteb', 'orangeb', 'yellowb'];
    var sprite = game.add.sprite(this.x, this.y, names[value], group);
    
    
    
    var init = function () {        
        sprite.inputEnabled = true;
        sprite.input.useHandCursor = true;
        //event listener
        sprite.events.onInputDown.add(click, this);
        sprite.scale.setTo(gameProperties.scaleRatio, gameProperties.scaleRatio);
    };
    
        //action
    var click = function () {
        //event dispatch
        //console.log(tile.x + " " + tile.y);
        tile.onClick.dispatch(tile);
        //console.log("onClick dispached with tile");

        //condition
        if(sprite.inputEnabled){
            if(tile.swap){
                tile.swap = 0;
            } else if(tile.first){
                tile.currentState = 1;
                sprite.loadTexture(alts[tile.currentValue])
            } else if (tile.currentState){
                tile.currentState = 0;
                sprite.loadTexture(names[tile.currentValue]);
            }
        }
        tile.reveal();
    }
    
    this.backgroundChange = function() {
        this.isBlack = 1;
        sprite.loadTexture(black[tile.currentValue]);
    };

    this.backWhite = function(){
        sprite.loadTexture(names[tile.currentValue]);
        this.isBlack = 0;
    }

    this.reveal = function () {
        if (tile.currentState){
            sprite.loadTexture(alts[tile.currentValue]);
        } else if (tile.currentState == 0){
            sprite.loadTexture(names[tile.currentValue]);
        }
        if (tile.isBlack) {
            sprite.loadTexture(black[tile.currentValue]);
        }
        //this.enable(false);
    };

    this.updateTile = function () {
        tile.reveal();
    }

    this.enable = function (enable) {
        sprite.inputEnabled = enable;
    };
    


    init();
};