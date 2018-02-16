var Tile = function (x, y, depth, img) {
    

    this.x = x * 255;
    this.y = y * 255;
    this.z = depth;
    this.selectable = false;
    this.selected = false;
    this.generated = false;
    this.img = img;

    //event signal
    this.onClick = new Phaser.Signal();
    
    var tile = this;
    
    var sprite = game.add.sprite(this.x, this.y, this.img);
    
    
    
    var init = function () {        
        sprite.inputEnabled = true;
        sprite.input.useHandCursor = true;
        //event listener
        sprite.events.onInputDown.add(click, this);
        //sprite.scale.setTo(gameProperties.scaleRatio, gameProperties.scaleRatio);
    };
    
    //action
    var click = function () {
        
        console.log("congrats on your click!")
        //condition
        if(this.selectable){
            //if not selected
                //select tile
                //change texture to selected
            //if selected
                //deselect
        }
    }

    this.updateTile = function () {
        tile.reveal();
    }

    init();
};