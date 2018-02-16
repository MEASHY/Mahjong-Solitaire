var Board = function (columns, rows, top, left) {

    this.onScored = new Phaser.Signal();
    this.onEndGame = new Phaser.Signal();
    this.onTileClicked = new Phaser.Signal();
    this.onEvent = new Phaser.Signal();
    this.onFinished = new Phaser.Signal();
    this.onSelection = new Phaser.Signal();
    this.onDeselection = new Phaser.Signal();
    this.onSwap = new Phaser.Signal();
    this.onFault = new Phaser.Signal();

    this.aTime = 0;
    this.startingScore = 0;
    this.endingScore = 0;
   
    

    var self = this;
    var board = [];
    var group = game.add.group();


    var currentEvent;

    var busy = 0;

    var checkBusy = function(val){
        busy = busy + val;
        //console.log("the value of busy is " + busy);
        if (busy <= 0){
            unlockAllTile();
            self.onFinished.dispatch();
        } else {
            lockTiles();
        }
    }


    var tileSelected = 0;
    var firstSelected;
    var secondSelected;
    var scoreable = 0;
    var gameStarted = 0;

    var init = function (top, left) {
        
        for (var y=0; y<rows; y++) {

            var row = [];

            for (var x=0; x<columns; x++) {
                
                var b = top;
                var c = left;
                var temp = Math.floor(Math.random() * gameProperties.tileTypes);
                var tile = new Tile(x, y, group, temp, b, c);
                tile.onClick.add(checkMove, this);
                row.push(tile);
            }
            
            board.push(row);
        }
        while (checkHorizontal() || checkVertical());
        gameStarted = 1;
    };

    this.moveTo = function (x, y) {
        group.x = x;
        group.y = y;
    };


    var chackMatch = function (tile){
        var tileList = [];
        var targetTile;
        var column;
        var row;

        for (var y =-1; y <= 1; y ++){
            for ( var x = -1; x <= 1; x ++){
                if ( x + y == 0 || x + y == 2 || x + y == -2) {
                    continue;
                } 

                column = tile.column + x;
                row = tile.row + y;

                if (row < 0 || row >= rows || column < 0 || column >= columns){
                    continue;
                }

                tileList.push(board[row][column]);


            }
        }
        return tileList;
    };

    var checkMove = function(tile) {
        self.onTileClicked.dispatch();
        scoreable = 1;
        self.onEvent.dispatch(tile);
        
        if(!tileSelected){
            self.onSelection.dispatch();
            tileSelected = 1;
            tile.first = true;
            lockTiles();
            unlockTile(tile);
            var swappable = getSwappableTiles(tile);
            unlockSelected(swappable);
            firstSelected = tile;
            self.onFinished.dispatch();

        } else if (tile == firstSelected){
            self.onDeselection.dispatch();
            tileSelected = 0;
            tile.first = false;
            unlockAllTile();
            self.onFinished.dispatch();

        } else {
            secondSelected = tile;
            swap(firstSelected,secondSelected);
            tileSelected = 0;
            unlockAllTile();
            firstSelected = null;
            secondSelected = null;
            tile.swap = 1;
        }
        //console.log(game.time.events.length);
        //self.onFinished.dispatch();
    };

    var findDirection = function(tile, match){
        var x1 = tile.column;
        var y1 = tile.row;

        var x2 = match.column;
        var y2 = match.row;

        var direction;

        if (x2 - x1 == 0){
            direction = self.directions.UD; // UD
        } else {
            direction = self.directions.LR; // LR
        }

        return direction;
    };

    var checkUDStart = function (tile){
        var update = 0;
        var max = tile;
        var column = tile.column;
        var row = tile.row - 1;

        if (! (row < 0)) {
            if (tile.currentValue == board[row][column].currentValue){
                max = board[row][column];
                update = 1;
            }
        }
        if (update){
           return checkUDStart(max);
        }
        return max;
    };

    var checkUDEnd = function (tile){
        var update = 0;
        var max = tile;
        var column = tile.column;
        var row = tile.row + 1;

        if (row < rows) {
            if (tile.currentValue == board[row][column].currentValue){
                max = board[row][column];
                update = 1;
            }
        }
        if (update){
            return checkUDEnd(max);
        }
        return max;
    };

    var checkLRStart = function (tile){
        var update = 0;
        var max = tile;

        var column = tile.column - 1;
        var row = tile.row;
        if (column >= 0) {
            if (tile.currentValue == board[row][column].currentValue){
                max = board[row][column];
                update = 1;
            }
        }
        if (update){
           return checkLRStart(max);
        }
        return max;
    };


    var checkLREnd = function (tile){
        var update = 0;
        var max = tile;
        var column = tile.column + 1;
        var row = tile.row;
        if (column < columns) {
            if (tile.currentValue == board[row][column].currentValue){
                max = board[row][column];
                update = 1;
            }
        }
        if (update){
            return checkLREnd(max);
        }
        return max;
    };

    var checkSwap = function (tile){
        var tileList = getSwappableTiles(tile);
        var score;
        var lr;
        var ud;
        var min;
        var max;
        var direction;
        var success = false;
        for (var i = 0; i < tileList.length; i ++) {
            if (tile.currentValue == tileList[i].currentValue){
                var dir = findDirection(tile, tileList[i]);
                var start;
                var end;
                var diff;
                var astart;
                var aend;
                lr = 0;
                ud = 0;
                if (dir == self.directions.UD){
                    if (tileList[i].row > tile.row){
                        start = tile;
                        end = tileList[i];
                    } else {
                        start = tileList[i];
                        end = tile;
                    }
                    astart = checkUDStart(start);
                    aend = checkUDEnd(end);
                } else {
                    if (tileList[i].column > tile.column){
                        start = tile;
                        end = tileList[i];
                    } else {
                        start = tileList[i];
                        end = tile;
                    }
                    astart = checkLRStart(start);
                    aend = checkLREnd(end);
                }
                diff = aend.column - astart.column + aend.row - astart.row;
                //console.log(astart.row +  " = the start row " );
                //console.log(aend.row + " = the end row" );
                //console.log(diff + " = the difference between the start and end");
                if (diff >= 2){
                    direction = dir;
                    min = astart;
                    max = aend;
                    if (dir == self.directions.LR){
                            lr = diff;
                    } else if( dir == self.directions.UD) {
                            ud = diff;
                    }
                    //maybe not necessary
                    if (lr >=2 && ud >= 2){
                        score = lr + ud;
                    } else if ( lr >= 2 ){
                        score = lr + 1;
                    } else if ( ud >= 2) {
                        score = ud + 1;
                    } else {
                        score = 0;
                    }
                    backgroundTiles(min,max,direction,score);
                    
                    success = true;
                }
            } 
        }
        return success;
    }
    var tempmin;
    var tempmax;
    var tempdir;
    var timedEvent = 0;
    var whiteout = function(){
        for(var i = 0; i < rows; i++){
            for (var j = 0; j < columns; j++){
                if(board[i][j].isBlack){
                    board[i][j].backWhite();
                }
            }
        }
    }

    var replaceTilesCont = function(score){
        //console.log("timed event called");
        replaceTiles(tempmin,tempmax,tempdir,score);
    }

    var backgroundTiles = function(min, max, dir, score){
        if (gameStarted){
            if (dir == self.directions.UD){
            for (var i = min.row; i <= max.row; i ++){
                board[i][min.column].backgroundChange();
                board[i][min.column].backgroundChange();

            }
                if (timedEvent == 0){
                    tempmin = min;
                    tempmax = max;
                    tempdir = dir;
                    if (gameStarted){
                        checkBusy(1);
                    }
                    game.time.events.add(800, replaceTilesCont, game, score);
                    timedEvent = 1;
                    //console.log("created timed event");
                }
            } else {
                for( var i = min.column; i <= max.column; i ++) {
                    board[min.row][i].backgroundChange();
                    board[min.row][i].backgroundChange();
                }
                if (timedEvent == 0){
                    tempmin = min;
                    tempmax = max;
                    tempdir = dir;
                    if (gameStarted){
                        checkBusy(1);
                    }
                    game.time.events.add(800, replaceTilesCont, game, score);
                    timedEvent = 1;
                    //console.log("created timed event");
                }
            }
        } else {
            replaceTiles(min,max,dir, 0);
        }
    }

    var replaceTiles = function (min, max, dir, score){
        if (dir == self.directions.UD){
            if (min.row == 0) {
                for (var i = 0; i <= max.row; i ++) {
                    board[i][min.column].currentValue = Math.floor(Math.random() * gameProperties.tileTypes);
                    board[i][min.column].updateTile();
                }
            } else {
                max.currentValue = board[min.row -1][min.column].currentValue;
                min = board[min.row-1][min.column];
                max.updateTile();
                max = board[max.row-1][max.column];
                replaceTiles(min, max, dir, 0);
            }
        } else {
            for( var i = min.column; i <= max.column; i ++) {
                for (var y = min.row; y > 0; y --) {
                    board[y][i].currentValue = board[y-1][i].currentValue;
                    board[y][i].updateTile();
                }
                board[0][i].currentValue = Math.floor(Math.random() * gameProperties.tileTypes);
                board[0][i].updateTile(); 
            }
        }
        if (score > 0){
            timedEvent = 0;
            console.log("start = (" + min.column + ", " + min.row +"), end = ("+max.column + ", "+ max.row  + "), score  = "+ score);
            self.onScored.dispatch(score);
        }
        whiteout();
        checkHorizontal();
        checkVertical();
        if(score >0 ){
            checkBusy(-1);
        }
        
    };
    var swap = function (first, second){
        var temp = first.currentValue;
        var checkOne;
        var checkTwo;
        first.currentValue = second.currentValue;
        second.currentValue = temp;
        first.currentState = 0;
        second.currentState = 0;
        first.reveal();
        second.reveal();
        checkOne = checkSwap(first);
        checkTwo = checkSwap(second);
        self.onSwap.dispatch();
        if(! (checkOne || checkTwo)){
            reverse(first, second);
            self.onFault.dispatch();
        }
    };

    var checkHorizontal = function () {
        var start = board[0][0];
        var end = board[0][0];
        var dir = self.directions.LR;
        var change = 0;
        for(var i = 0; i < rows; i ++) {
            for (var j = 0; j < columns - 1; j++) {
                for (var k = j+1; k < columns; k ++) {
                    if (board[i][j].currentValue == board[i][k].currentValue){
                        start = board[i][j];
                        end = board[i][k];
                    } else if((k-j - 1) >1){
                        
                        change = 1;
                        if (scoreable){
                            var score = k-j;
                            backgroundTiles(start,end,dir,score);
                        }
                        backgroundTiles(start,end,dir,0);
                        j = k;
                    } else {
                        j = k;
                    }
                    if(end.column == 7 && start.column < 6){
                           
                            change = 1;
                        if (scoreable){
                            var score = end.column - start.column + 1;
                            backgroundTiles(start,end,dir,score);
                        }
                         backgroundTiles(start,end,dir,0);
                    }
                }
            }
        }
        return change;
    };

    var checkVertical = function () {
        var start = board[0][0];
        var end = board[0][0];
        var dir = self.directions.UD;
        var change = 0;
        for (var i = 0; i < columns; i ++) {
            for (var j = 0; j < rows -1; j ++) {
                for (var k = j + 1; k < rows; k ++) {
                    if (board[j][i].currentValue == board[k][i].currentValue){
                        start = board[j][i];
                        end = board[k][i];
                    } else if ((k - j -1) > 1) {
                        
                        change = 1;
                        if (scoreable){
                            var score = k - j;
                            backgroundTiles(start,end,dir,score);
                        }
                        backgroundTiles(start,end,dir,0);
                        j = k;
                    } else {
                        j = k;
                    }
                    if(end.row == 7 && start.row < 6){
                            change = 1;
                            
                        if (scoreable){
                            var score = end.row - start.row + 1;
                            backgroundTiles(start,end,dir,score);
                        }
                        backgroundTiles(start,end,dir,0);
                    }
                }
            }
        }
        return change;
    };

    var reverse = function (first, second){
        var temp = first.currentValue;
        first.currentValue = second.currentValue;
        second.currentValue = temp;
        first.currentState = 0;
        second.currentState = 0;
        first.reveal();
        second.reveal();
    };

    var unlockSelected = function (tileList){
        for (var i = 0; i < tileList.length; i ++){
            unlockTile(tileList[i]);
        }
    };

    var unlockTile = function (tile){
        tile.enable(true);
    };

    var unlockAllTile = function () {
        for (var i = 0; i < columns; i ++) {
            for (var j = 0; j < rows; j ++) {
                board[j][i].enable(true);
            }
        }
        //console.log("tiles are unlocked");
    };

    var lockTiles = function () {
        for (var i = 0; i < columns; i ++) {
            for (var x = 0; x < rows; x ++) {
                board[x][i].enable(false);
            }
        }
        //console.log("Tiles are locked");
    };
    
    var endGame = function() {
        self.onEndGame.dispatch();
    };

    init(top, left);
};