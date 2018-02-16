var gameProperties = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    
    tileWidth: 256,
    tileHeight: 256,
        
    boardWidth: 8,
    boardHeight: 8,
    
    startingScore: 0,

    scaleRatio: window.devicePixelRatio/3,

    tileTypes: 5,

    targetScore: 50,

    attempt: 0,

    level: 1,

    prev: 1,

    prevTile: 5,

    prevTarget: 50,

    setTileTypes: function(num){
        this.tileTypes = num;
    },

    upAttempt: function(){
        this.attempt = this.attempt + 1;
    },

    setTarget: function(num){
        this.targetScore = num;
    },

    upLevel: function(){
        this.prev = this.level;
        this.level = this.level + 1;

        this.prevTile = this.tileTypes;
        this.prevTarget = this.targetScore;
    },

    setLevel: function(num){
        this.level = num; 
    },

    setPrev: function(num){
        this.prev = num;
    }

};

var timeSinceUpdate = 0;

var events = [];

var states = {
    game: "game",
    menu: "menu",
    stat: "stats",
};

var fontStyles = {
    counterFontStyle:{font: '20px Arial', fill : '#000000'},
};

var currentEvent = 0;
var startingScore;
var endingScore;

var gameState = function(game){
    this.boardTop;
    this.boardLeft;
    this.board;
    this.timer;
    this.counter;
    this.tf_replay;
    this.tileTypes;
};

gameState.prototype = {
    
    init: function () {
        this.scale.forceLandscape = true;
	if (gameProperties.screenWidth > gameProperties.screenHeight) {
		gameProperties.scaleRatio = ( gameProperties.screenHeight) / (gameProperties.tileHeight * (gameProperties.boardHeight + 2));
	} else if ( gameProperties.screenWidth < gameProperties.screenHeight) {
		gameProperties.scaleRatio = ( gameProperties.screenWidth) / (gameProperties.tileWidth * (gameProperties.boardWidth + 2));
	}
        this.boardTop = (gameProperties.screenHeight - (gameProperties.tileHeight * gameProperties.scaleRatio * gameProperties.boardHeight)) * 0.5;
        this.boardLeft = (gameProperties.screenWidth - (gameProperties.tileWidth * gameProperties.scaleRatio *gameProperties.boardWidth)) * 0.5;
        
    },
    
    preload: function () {

        game.load.image('blue1', '/static/bAssets/blue1.png');
        game.load.image('blue2', '/static/bAssets/blue2.png');
        game.load.image('blueb', '/static/bAssets/blueb.png');
        game.load.image('red1', '/static/bAssets/red1.png');
        game.load.image('red2', '/static/bAssets/red2.png');
        game.load.image('redb', '/static/bAssets/redb.png');
        game.load.image('green1', '/static/bAssets/green1.png');
        game.load.image('green2', '/static/bAssets/green2.png');
        game.load.image('greenb', '/static/bAssets/greenb.png');
        game.load.image('orange1', '/static/bAssets/orange1.png');
        game.load.image('orange2', '/static/bAssets/orange2.png');
        game.load.image('orangeb', '/static/bAssets/orangeb.png');
        game.load.image('yellow1', '/static/bAssets/yellow1.png');
        game.load.image('yellow2', '/static/bAssets/yellow2.png');
        game.load.image('yellowb', '/static/bAssets/yellowb.png');
        game.load.image('purple1', '/static/bAssets/purple1.png');
        game.load.image('purpleb', '/static/bAssets/purpleb.png');
        game.load.image('purple2', '/static/bAssets/purple2.png');
        game.load.image('white1', '/static/bAssets/white1.png');
        game.load.image('whiteb', '/static/bAssets/whiteb.png');
        game.load.image('white2', '/static/bAssets/white2.png');
        game.load.image('bg1', "/static/bAssets/bgame1.png");
        game.load.image('bg2', "/static/bAssets/bgame2.png");
        game.load.image('bg3', "/static/bAssets/bgame3.png");
        game.load.image('bg4', "/static/bAssets/bgame4.png");
        game.load.image('bg5', "/static/bAssets/bgame5.png");
        game.load.image('bg6', "/static/bAssets/bgame6.png");
        game.load.image('bg7', "/static/bAssets/bgame7.png");
        game.load.image('bg8', "/static/bAssets/bgame8.png");
        game.load.image('bg9', "/static/bAssets/bgame9.png");
        game.load.image('bg10', "/static/bAssets/bgame10.png");
        game.load.image('bg11', "/static/bAssets/bgame11.png");
        game.load.image('bg12', "/static/bAssets/bgame12.png");
        game.load.image('bg13', "/static/bAssets/bgame13.png");
        game.load.image('bg14', "/static/bAssets/bgame14.png");
        game.load.image('bg15', "/static/bAssets/bgame15.png");
        
    },
    
    create: function () {
        this.initBoard();
        this.initUI();
	    this.game.stage.backgroundColor = '#FFFFFF';
    },

    /*update: function () {
        
    },
    */
    
    initBoard: function () {
        this.board = new Board(gameProperties.boardWidth, gameProperties.boardHeight, this.boardTop, this.boardLeft);
        this.board.moveTo(this.boardLeft, this.boardTop);
        this.board.onTileClicked.addOnce(this.startGame, this);
        this.board.onEndGame.addOnce(this.endGame, this);
        this.board.onScored.add(this.updateScore, this);
        this.board.onEvent.add(this.newEvent, this);
        this.board.onFinished.add(this.finished, this);
        this.board.onSelection.add(this.typeSelect, this);
        this.board.onDeselection.add(this.typeDeSel, this);
        this.board.onSwap.add(this.typeSwap, this);
        this.board.onFault.add(this.typeFault, this);
    },

    initUI: function() {
        var top = this.boardTop -20;
        var left = this.boardLeft;
        var right = left + (gameProperties.boardWidth * gameProperties.tileWidth * gameProperties.scaleRatio);

        this.timer = new Timer(left,top);
        this.timer.onTimeUp.add(this.endGame, this);
        this.counter = new Counter(right, top, gameProperties.startingScore, gameProperties.targetScore);
        this.counter.goalAchieved.add(this.nextLevel, this)
    },

    startGame: function() {
        this.timer.start();
    },

    endGame: function () {
        this.timer.stop();
        //gameProperties.upAttempt();
        gameProperties.setPrev(gameProperties.level);
        game.state.start(states.stat);
    },
    typeSelect: function() {
        if (currentEvent){
            currentEvent.setAType("SELECTION");
        }
    },

    typeDeSel: function() {
        if (currentEvent){
            currentEvent.setAType("DESELECTION");
        }
    },  

    typeSwap: function() {
        if (currentEvent){
            currentEvent.setAType("SWAP");
        }
    },

    typeFault: function() {
        if (currentEvent){
            currentEvent.setAType("FAULT");
        }
    },

    finished: function() {
        try {
        endingScore = this.counter.getScore();
        currentEvent.setAScore(endingScore - startingScore);
        events.push(currentEvent);
        }
        catch (err) {
            //timer was stoped because of score update 
        }
        this.counter.check();
    },

    newEvent: function(tile){
        if (currentEvent != 0){
            events.push(currentEvent);
        }
        currentEvent = new Event(tile, Math.floor(Date.now()));
        startingScore = this.counter.getScore();
        
    },

    updateScore: function (value) {
        this.counter.update(value);
    },

    nextLevel: function() {
        var seconds = new Date().getTime()
        var delta = seconds - timeSinceUpdate;
        //console.log("updating level not past time check");
        if (delta > 5000){
            timeSinceUpdate = seconds;
            //gameProperties.upAttempt();
            //console.log(gameProperties.attempt);
            if (gameProperties.attempt <= 15){
                //console.log(gameProperties.level + "this is the level before upgrading.");
                gameProperties.upLevel();
                if (gameProperties.level == 2){
                    gameProperties.setTarget(60);
                }
                else if (gameProperties.level == 3){
                    gameProperties.setTarget(70);
                }

                else if (gameProperties.level == 4){
                    gameProperties.setTarget(80);
                }
                else if (gameProperties.level == 5){
                    gameProperties.setTarget(90);
                }
                else if (gameProperties.level == 6){
                    gameProperties.setTileTypes(6);
                    gameProperties.setTarget(60);
                }
                else if (gameProperties.level == 7){
                    gameProperties.setTarget(70);
                }
                else if (gameProperties.level == 8){
                    gameProperties.setTarget(80);
                }
                else if (gameProperties.level == 9){
                    gameProperties.setTarget(90);
                }
                else if (gameProperties.level == 10){
                    gameProperties.setTarget(100); 
                }
                else if (gameProperties.level == 11){
                    gameProperties.setTileTypes(7);
                    gameProperties.setTarget(70);
                }
                else if (gameProperties.level == 12){
                    gameProperties.setTarget(80);
                }
                else if (gameProperties.level == 13){
                    gameProperties.setTarget(90);
                }
                else if (gameProperties.level == 14){
                    gameProperties.setTarget(100);
                }
                else if (gameProperties.level == 15){
                    gameProperties.setTarget(110);
                }
                this.timer.stop();
                game.state.start(states.stat);
            }else{
                // Go to a final menu screen for last session.
                gameProperties.level = 1;
                gameProperties.attempt = 0;
                this.timer.stop();
                game.state.start(states.stat);
            }
        } else {
            timeSinceUpdate = seconds;
            }
        }
    
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.CANVAS, 'gameDiv');
game.state.add(states.game, gameState);
game.state.add(states.stat, stats);
game.state.start(states.stat);
