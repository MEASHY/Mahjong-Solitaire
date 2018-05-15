/** Class representing a WordSearch board. */
class Board {
    /**
     * Create a Board 
     * <p>
     * Also initializes a layout
     * @param {context} scene - The scene in which the sprite resides.
     * @see Layout
     */

    constructor (levelData) {
        
        this.onWordFound = new Phaser.EventEmitter();
        this.onUpLevel = new Phaser.EventEmitter();
        this.onTileClicked = new Phaser.EventEmitter();
        this.onEvent = new Phaser.EventEmitter();
        this.onSelection = new Phaser.EventEmitter();
        this.onDeselection = new Phaser.EventEmitter();
        this.onFinished = new Phaser.EventEmitter();
        this.onFound = new Phaser.EventEmitter();
        
        this.levelData = levelData
        this.board = [];
        this.group = scene.add.group();
        
        this.directions =  {
            LR: 0,
            UD: 1,
            DU: 2,
            DD: 3,
            NA: 4,
        };        
    }
    
    buildBoard () {
        for (var x = 0; x < this.levelData.columncount; x ++){
            var row = [];
            for (var y = 0; y < this.levelData.rowcount; y ++) {
                var tile = new Tile(y, x, this.group);
                tile.setSprite(this.levelData.rows[y][x])
                tile.sprite.on("onClick", function () {
                    this.eventController();
                },this);
                row.push(tile);
            }
            this.board.push(row);
        }
    }
    
    //this function is used to center the board within the game world
    moveTo (x,y) {
        this.repositionTiles()
    }
    
    eventController (tile) {
        this.onTileClicked.dispatch()
        this.onEvent.dispatch(tile)
        theTile = tile
        conditionController()
    };
    
    repositionTiles () {
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                //console.log(i +"  "+j)
                //console.log(this.board[i][j].sprite.texture.key)
                //console.log(this.board[i][j].row +"  "+this.board[i][j].column)
                this.board[i][j].updatePosition()
            }
        }
    }
}
/*

var Board = function (columns, rows, top, left, levelData) {

    console.log(levelData)
    //initialize Signals
    this.onWordFound = new Phaser.EventEmitter();
    this.onUpLevel = new Phaser.EventEmitter();
    this.onTileClicked = new Phaser.EventEmitter();
    this.onEvent = new Phaser.EventEmitter();
    this.onSelection = new Phaser.EventEmitter();
    this.onDeselection = new Phaser.EventEmitter();
    this.onFinished = new Phaser.EventEmitter();
    this.onFound = new Phaser.EventEmitter();

    //initialize direction properties
    this.directions =  {
        LR: 0,
        UD: 1,
        DU: 2,
        DD: 3,
        NA: 4,
    };
    
    //setting up variables for properties of events
    var theTile;

    //this holds the direction of selection (default is NA)
    var direction = this.directions.NA;

    //this holds a list of selected tiles
    var selectedTiles = [];

    //this holds a newly selected tile while it is being compared to the tiles in selectedTiles
    var possibleTile;

    var words = levelData.words;
    var self = this;
    
    var board = [];
    
    
    // this is how we code the tile value of the tiles in the board
    // this would have to be replaced for multiple levels
    var row = [];
    var tile;
    var one = ["I", "X", "N", "D", "S", "C", "R", "E", "E", "N"];
    var two = ["M", "T", "H", "T", "I", "N", "Y", "I", "M", "C"];
    var three = ["W", "R", "M", "M", "A", "A", "V", "X", "R", "U"];
    var four = ["V", "K", "F", "W", "H", "J", "L", "W", "A", "B"];
    var five = ["I", "P", "F", "E", "D", "E", "T", "O", "G", "I"];
    var six = ["M", "W", "I", "I", "D", "W", "I", "D", "G", "C"];
    var seven = ["A", "I", "S", "X", "G", "B", "J", "G", "Y", "B"];
    var eight = ["G", "D", "I", "P", "E", "U", "H", "T", "H", "J"];
    var nine = ["E", "T", "Z", "M", "B", "L", "R", "J", "W", "T"];
    var ten = ["Q", "H", "E", "G", "L", "Q", "A", "E", "O", "W"];
   
    this.group;
    var temp = "";
    var temp1 = "";
    var clues = [];
    for (var x = 0; x < levelData.wordcount; x ++){
        temp1 = "clue" + x;
        //console.log(temp);
        //console.log(levelData[temp]);
        clues.push(levelData[temp1]);
    }
    //console.log(levelData.clue0);
    //console.log(boardlines);
   
    //var boardlines = [one,two,three,four,five,six,seven,eight,nine,ten];

    var init = function(){
      group = scene.add.group();
      for (var x = 0; x < levelData.columncount; x ++){
        for (var y = 0; y < levelData.rowcount; y ++) {
          tile = new Tile(y, x, this.group, levelData.rows[y][x]);
          tile.onClick.on("onClick", eventController);
          row.push(tile);
        }
        board.push(row);
        row = [];
      }
    };

    //this function is used to center the board within the game world
    this.moveTo = function(x,y) {
        console.log(this.group)
        this.group.setXY(x,y);
    };

    var eventController = function (tile) {
        self.onTileClicked.dispatch();
        self.onEvent.dispatch(tile);
        theTile = tile;
        conditionController();
    };

    var conditionController = function(){
        if (theTile.isTerm){
            self.onDeselection.dispatch();
            tileSelected --;
            var index = selectedTiles.indexOf(theTile);
            selectedTiles.splice(index, 1);
        } else {
            self.onSelection.dispatch();
            selectedTiles.push(theTile);
            tileSelected ++;
        }
        lockTiles();
        //console.log("number of tiles Selected" + tileSelected);
        findDirection(theTile);
        unlockSelected(selectedTiles);
        findTerm();
        checkAns();
        self.onFinished.dispatch();
    };

    //returns a list of surrounding tiles given a tile
    //Event Condition or Action?
    var getSurroundingTiles = function (tile) {
        
        var tileList = [];
        var targetTile;
        var column;
        var row;
        
        for (var y=-1; y <= 1; y++) {
            for (var x =-1; x <=1; x ++) {
                column = tile.column + x;
                row = tile.row + y;
                
                // logic to check that we aren't trying to go outside of the game world
                // for example the last tile in a row will only return tiles within the board
                if (row < 0 || row >= rows || column < 0 || column >= columns){
                    continue;
                }
                
                targetTile = board[row][column];
                
                tileList.push(targetTile);
             }
        }
        
        return tileList;
    };
    
    //Returns the direction of selection by comparing the row, column values of the first
    //two selected tiles
    //This would be a property of an Event
    //this is later used as a condition check for the next selection
    var findDirection = function(tile){

        if (!tileSelected){
            direction = self.directions.NA;
        } else {

        var x2 = tile.column;
        var y2 = tile.row;
        
        var x1 = selectedTiles[0].column;
        var y1 = selectedTiles[0].row;
        }

        if (selectedTiles.length == 1){
            direction = self.directions.NA;
        } else if ((y2 > y1 && x2> x1 )|| (y1 > y2 && x1 > x2)){
            direction = self.directions.DD;
        } else if (( y2 > y1 && x2 < x1)||(y2 < y1 && x2 > x1 )){
            direction = self.directions.DU;
        } else if (x2 - x1 == 0){
            direction = self.directions.UD;
        } else {
            direction = self.directions.LR;
        }
    }
    
    //Checks the selection list versus the list of hidden words
    //just checks the start and end of a line + length
    var checkAns = function () {
        var lenSel = selectedTiles.length;
        var firstCheck = 0;
        var lastCheck = 0;
        
        //Condition checking logic

        //for each answer in answers
        var wordnum;
        //console.log(clues);
        for(var i = 0; i < clues.length; i ++){

            // dont bother checking unless you've selected the length of the answer
            if (lenSel == clues[i][0]){
                //for each tile in selected tile (since it's unordered and you can start in the middle of the word);
                for (var j = 0; j< lenSel; j++){
                    //compare the x and y values of the tile to the starting tile of the answer
                    if (selectedTiles[j].column == clues[i][1] && selectedTiles[j].row == clues[i][2]){
                        firstCheck = 1;
                    }
                    // same but last tile of answer
                    if(selectedTiles[j].column == clues[i][3] && selectedTiles[j].row == clues[i][4]){
                        lastCheck = 1;
                    }
                }
            }
            if ( firstCheck && lastCheck){
                wordnum = i;
                self.onFound.dispatch(wordnum);
                // Action
                unlockAll();
                for(var x = 0; x < lenSel; x ++){
                    //makes correct word locked for rest of game
                    selectedTiles[x].correct(true);
                }
                //resets list of selected tiles
                selectedTiles = [];
                tileSelected = 0;
                direction = self.directions.NA;
                words = words - 1;
                //signals that a word has been found
                self.onWordFound.dispatch(words);
                //Condition
                if(!(words)){
                    endGame();
                }
                break    
            }
        
        //Condition is met
        }
    }
    
    //unlocks tiles
    var unlock = function(tile) {
        if(!(tile.crc)){
            tile.enable(true);
        }
        if (tile == possibleTile){
            selectedTiles.push(possibleTile);
            tileSelected++;
        }
    };

    var unlockSelected = function(tileList){
        for ( var y = 0; y < tileList.length; y ++){
            unlockTile(selectedTiles[y]);
        }
        if (!tileSelected){
            unlockAll();
        }
    };

    var unlockNA = function (tile) {
        var tileList = [];
        tileList = getSurroundingTiles(tile);
        for (var i = 0; i < tileList.length; i ++) {
            unlock(tileList[i]);
        }
        tile.term = true;
    };

    var unlockLR = function (tile) {
        var x1 = tile.column + 1;
        var x2 = tile.column - 1;

        if (!( x1 >= columns)){
            unlock(board[tile.row][x1]);
        }
        if (!(x2 < 0 )){
            unlock(board[tile.row][x2]);
        }

    };

    var unlockUD = function (tile) {
        var y1 = tile.row + 1;
        var y2 = tile.row - 1;
            
        if (!( y1 >= rows)){
            unlock(board[y1][tile.column]);
        }
        if (!(y2 < 0 )){
            unlock(board[y2][tile.column]);
        }
    };

    var unlockDD = function (tile) {
        var x1 = tile.column + 1;
        var y1 = tile.row + 1;
            
        var x2 = tile.column - 1;
        var y2 = tile.row -1;
            
        if(!(x1 >= columns || y1 >= rows)){
            unlock(board[y1][x1]);
        }
            
        if(!(x2< 0|| y2 < 0)) {
            unlock(board[y2][x2]);
        }
    };

    var unlockDU = function (tile) {
        var x1 = tile.column - 1;
        var y1 = tile.row + 1;
            
        var x2 = tile.column + 1;
        var y2 = tile.row -1;
            
        if (!(x1 < 0 || y1 >= rows)){
            unlock(board[y1][x1]);
        }
        if (!(x2 >= columns || y2 < 0)){
            unlock(board[y2][x2]);
        }
    };

    var unlockTile = function(tile){
        if (direction == self.directions.NA){
            unlockNA(tile);
        } else if ( direction == self.directions.LR) {
            unlockLR(tile);
        } else if ( direction == self.directions.UD) {
            unlockUD(tile);
        } else if ( direction == self.directions.DD) {
            unlockDD(tile);
        } else {
            unlockDU(tile);
        }
    };
    
    // Action
    var lockTiles = function () {
        for (var i = 0; i < columns; i ++ ){
            for( var x = 0; x < rows; x ++){
                board[x][i].enable(false);
            }
        }
    };
    
    // Action
    var unlockAll = function () {
        for (var i = 0; i < columns; i ++ ){
            for( var x = 0; x < rows; x ++){
                if (!board[x][i].crc){
                    unlock(board[x][i]);
                }
            }
        }
    };
    
    // Action / Condition
    var lockNonTerm = function() {
        for (var x = 0; x < selectedTiles.length; x ++){
            if (!(selectedTiles[x].isTerm)){
                selectedTiles[x].enable(false);
            }
        }
    }
    
    // Finds the end points of a selected line.
    // This way only terminal points will be unlocked and you 
    // cant de-select a tile in the middle of your selection
    // creating two lines.
    var findTerm = function () {
        var min = selectedTiles[0];
        var max = selectedTiles[0];
        var len = selectedTiles.length;
        
        for (var x = 0; x < len; x ++){
            selectedTiles[x].isTerm = false;
        }
        
        if (len > 1){
            if (direction == self.directions.LR) {
                for ( var i = 0; i < len; i++) {
                    if (min.column > selectedTiles[i].column){
                        min = selectedTiles[i];
                    }
                    if (max.column < selectedTiles[i].column){
                        max = selectedTiles[i];
                    }
                }
            }else {
                for ( var i = 0; i < len; i ++) {
                    if (min.row > selectedTiles[i].row){
                        min = selectedTiles[i];
                    }
                    if (max.row < selectedTiles[i].row){
                        max = selectedTiles[i];
                    }
                }
            }

            min.isTerm = true;
            max.isTerm = true;
            
        } else if (len == 1) {
           selectedTiles[0].isTerm = true;
        }
        lockNonTerm();
    };
    
    // Signal's the end of the game when words are found
    // Event controller?
    var endGame = function() {
        self.onUpLevel.dispatch();
    }
    
    init();
}
*/