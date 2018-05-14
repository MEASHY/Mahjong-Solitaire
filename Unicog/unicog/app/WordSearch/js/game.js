var game

var gameProperties = {
    
    tileWidth: 268,
    tileHeight: 268,

    scaleRatio: window.devicePixelRatio/3,

    setScaleRatio: function(num){
        this.scaleRatio =  this.scaleRatio *(10/num);
    },

    revertScaleRatio: function(num){
        this.scaleRatio = this.scaleRatio / (10/num);
    },

    level: 0,

    vers: '0',

    attempt: 0,

    upAttempt: function(){
        this.attempt = this.attempt + 1;
    },

    setPrev: function(str){
        this.prev = str;
    },

    setVersion: function(num){
        this.vers = num;
    },

    setLevel: function(str){
        this.level = str;
    }
    
};

var events = [];
var currentEvent;
var startingScore;
var endingScore;

var fontStyles = {
    counterFontStyle:{font: '20px Arial', fill : '#000000'},
    clueFontStyle:{font: "bold 30px Arial", fill: "#000"},
    foundFontStyle:{font: "bold 30px Arial", fill: "#FFF"},
};

var gameState = function(game){
    this.boardTop;
    this.boardLeft;
    this.board;
    this.timer;
    this.counter;
    this.tf_replay;
    this.clues;
    this.screen;
    this.cubic;
    this.size;
    this.figure;
    this.height;
    this.width;
    this.pixel;
    this.image;
    this.dialog;
    this.levelData;
    
};

var gameConfig = {
    width: screen.width,
    height: screen.height,
    backgroundColor: '#000000',
    type: Phaser.AUTO,
    parent: 'gameDiv',
    scene: [
        game,
        stats
    ]
}


var game = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function game(){
        Phaser.Scene.call(this, {key: "game"});
    },
    
    preload: function() {
        var levelString = '/static/wsAssets/level/';
        var grade = gameProperties.level;
        var xhr = new XMLHttpRequest();
        var url = "/api/v1/get_level_version";
        xhr.open("POST", url, false);
        xhr.withCredentials = "true";
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.send(JSON.stringify({
        "user_id": user,
        "level": grade
        }));
    

        var version = xhr.responseText;

        console.log(version);
        var ver = JSON.parse(version);

        gameProperties.setVersion(ver["version"]);
        
        var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split();

        for (letter in letters) {
            this.load.image(letter, '/static/wsAssets/tile1_268_pixels/tile1_'+letter+'_268.png');
            this.load.image('sel'+letter, '/static/wsAssets/tile_select/tile1_'+letter+'_268.png');
            this.load.image('lock'+letter, '/static/wsAssets/tile_lock/tile1_'+letter+'_268.png');
        }
    }
    
    create: function () {


        //var toPrint = game.cache.getText("the_level");
        //console.log(toPrint);
        this.levelData = JSON.parse(this.game.cache.getText("the_level"));
        //console.log(this.levelData);

        //console.log(this.levelData.clue0);

        if (gameProperties.scaleRatio == 0.875){
            gameProperties.scaleRatio = (gameProperties.screenWidth)/3216;
        }
        else if (gameProperties.screenWidth < gameProperties.screenHeight){
            gameProperties.scaleRatio =  (gameProperties.screenWidth )/3216;
        }
        else {
            gameProperties.scaleRatio = (gameProperties.screenHeight)/3216;
        }
        //console.log("Scale ratio (dpr/3) " + gameProperties.scaleRatio);
        gameProperties.setScaleRatio(this.levelData.row);
        this.boardTop = (gameProperties.screenHeight - (gameProperties.tileHeight * gameProperties.scaleRatio * this.levelData.row)) * 0.5;
        this.boardLeft = (gameProperties.screenWidth - (gameProperties.tileWidth * gameProperties.scaleRatio *this.levelData.columns)) * 0.5;
        

        //console.log("Scale ratio (dpr/3) " + gameProperties.scaleRatio);
        //console.log("Screen height " + gameProperties.screenHeight);
        //console.log("Screen Width " + gameProperties.screenWidth);
       

        this.initBoard();
        this.initUI();
        this.game.stage.backgroundColor = '#FFFFFF';


    },

    update: function () {},
    
    initBoard: function() {
        
        this.board = new Board(this.levelData.columns, this.levelData.row, this.boardTop, this.boardLeft, this.levelData);
        this.board.moveTo(this.boardLeft, this.boardTop);
        this.board.onTileClicked.addOnce(this.startGame, this);
        this.board.onUpLevel.addOnce(this.updateLevel, this);
        this.board.onWordFound.add(this.updateWords, this);
        this.board.onEvent.add(this.newEvent, this);
        this.board.onSelection.add(this.typeSelect, this);
        this.board.onDeselection.add(this.typeDeSel, this);
        this.board.onFinished.add(this.finished, this);
        this.board.onFound.add(this.found, this);
        
    },
    
    initUI: function() {
        var top = this.boardTop -20;
        var left = this.boardLeft;
        var right = left + (this.levelData.columns * gameProperties.scaleRatio* gameProperties.tileWidth);
        var wordBank = left * 0.25;
        
        this.timer = new Timer(left, top);
        this.timer.onTimeUp.add(this.endGame, this);
        this.counter = new Counter(right, top, this.levelData.words);
        
        this.tf_replay = game.add.text(left + gameProperties.scaleRatio * gameProperties.tileWidth * 5, top, "Replay?", fontStyles.counterFontStyle);
        //this.tf_replay.anchor.set(0.5, 0.5);
        this.tf_replay.inputEnabled = true;
        this.tf_replay.input.useHandCursor = true;
        this.tf_replay.events.onInputDown.add(this.restartGame, this);
        this.tf_replay.visible = false;
        
        this.clues = game.add.text(wordBank, top, "Clues:", fontStyles.clueFontStyle);
        var temp = "";
        for (var i = 0; i < this.levelData.words; i ++) {
            temp = "word" + i;
            game.add.text(wordBank, top + (35 * (1+ i)), this.levelData[temp], fontStyles.clueFontStyle);
        }
        this.timer.start();
        
    },
    
    startGame: function () {
        //chillout man
    },

    updateLevel: function(){
        gameProperties.upLevel();
        this.timer.stop();
        game.state.start(states.stats);
    },
    
    endGame: function () {
        this.timer.stop();
        gameProperties.prev = gameProperties.level;
        //this.tf_replay.visible = true;
        game.state.start(states.stats);
    },
    typeSelect: function() {
        currentEvent.setAType("SELECTION");
    },

    typeDeSel: function() {
        currentEvent.setAType("DESELECTION");
    },
    
    restartGame: function () {
        game.state.start(states.game);
    },
    
    updateWords: function (value) {
        this.counter.update(value);
    },

    finished: function() {
        endingScore = this.counter.getScore();
        currentEvent.setAScore(endingScore - startingScore);
        //console.log("Current event . Ascore = " + currentEvent.aScore);
        events.push(currentEvent);
        currentEvent = 0;

        //console.log(endingScore + " = endingScore");

    },

    newEvent: function(tile){
        currentEvent = new Event(tile, Math.floor(Date.now()));
        startingScore = this.counter.getScore();
        //console.log(startingScore + " = startingScore");
    },

    found: function(word){
        var wordBank = this.boardLeft * 0.25;
        var temp = "word" + word;
        game.add.text(wordBank, (this.boardTop -20) + (35 * (1+word)), this.levelData[temp], fontStyles.foundFontStyle);
    }
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.add(states.stats, stats);
game.state.start(states.stats);
