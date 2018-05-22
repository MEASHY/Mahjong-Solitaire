var game;
var scene;
var gameProperties = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    
    tileWidth: 268,
    tileHeight: 268,

    scaleRatio: window.devicePixelRatio/3,
    topOffset: 0,
    leftOffset: 0,
    levelData: "",

    setScaleRatio: function(num){
        this.scaleRatio =  this.scaleRatio *(10/num);
    },

    revertScaleRatio: function(num){
        this.scaleRatio = this.scaleRatio / (10/num);
    },
    
    sideOffset: 0,

    level: 1,

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

var emitter = new Phaser.EventEmitter();

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

window.onload = function(){
    var gameConfig = {
    width: screen.width,
    height: screen.height,
    backgroundColor: '#FFFFFF',
    type: Phaser.AUTO,
    parent: 'gameDiv',
    scene: [play]
    }
    game = new Phaser.Game(gameConfig);
}


var play = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function play(){
        Phaser.Scene.call(this, {key: "play"});
    },
    
    preload: function() {
        var levelString = '/wordsearch/assets/level/';
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
        
        this.load.json("levelData", "/wordsearch/assets/level/Level1/Level"+grade+
                                    "_version"+ver["version"]);
        
        var alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

        console.log(this);
        for (i in alph) {
            this.load.image(alph[i], '/wordsearch/assets/tile1_268_pixels/tile1_'+alph[i]+'_268.png');
            this.load.image('sel'+alph[i], '/wordsearch/assets/tile_select/tile1_'+alph[i]+'_268.png');
            this.load.image('lock'+alph[i], '/wordsearch/assets/tile_lock/tile1_'+alph[i]+'_268.png');
        }
    },
    
    create: function () {
        
        scene = this

        this.levelData = game.cache.json.get("levelData");
        //console.log(this.levelData.clue0);

        //these are awfully specific numbers...
        if (gameProperties.scaleRatio == 0.875){
            gameProperties.scaleRatio = (gameProperties.screenWidth)/3216;
        }
        else if (gameProperties.screenWidth < gameProperties.screenHeight){
            gameProperties.scaleRatio =  (gameProperties.screenWidth )/3216;
        }
        else {
            gameProperties.scaleRatio = (gameProperties.screenHeight)/3216;
        }
        console.log("Scale ratio (dpr/3) " + gameProperties.scaleRatio);
        gameProperties.setScaleRatio(this.levelData.rowcount);
        gameProperties.topOffset = (gameProperties.screenHeight - (gameProperties.tileHeight * gameProperties.scaleRatio * this.levelData.rowcount)) * 0.5;
        gameProperties.leftOffset = (gameProperties.screenWidth - (gameProperties.tileWidth * gameProperties.scaleRatio *this.levelData.columncount)) * 0.5;
        

        //console.log("Scale ratio (dpr/3) " + gameProperties.scaleRatio);
        //console.log("Screen height " + gameProperties.screenHeight);
        //console.log("Screen Width " + gameProperties.screenWidth);
       
        console.log(game)
        
        this.initBoard();
        this.initUI();
        resize()
        window.onresize =  function () {
            resize() 
        };
        //this.input.on('pointerdown', function (pointer) {

            //console.log(this.board)

        //}, this);

    },
    
    initBoard: function() {
        
        this.board = new Board(this.levelData);
        this.board.buildBoard();
        console.log("offsets: "+gameProperties.topOffset+"   "+gameProperties.leftOffset)
        this.board.repositionTiles();
        console.log(this.board.onTileClicked)
        this.board.onTileClicked.on("tileClick", this.startGame);
        this.board.onUpLevel.once("levelUp", this.updateLevel, this);
        this.board.onWordFound.emit("wordFound", this.updateWords, this);
        this.board.onEvent.emit("onEvent", this.newEvent, this);
        this.board.onSelection.emit("select", this.typeSelect, this);
        this.board.onDeselection.emit("deselect", this.typeDeSel, this);
        this.board.onFinished.emit("finish", this.finished, this);
        this.board.onFound.emit("found", this.found, this);
        
    },
    
    initUI: function() {
        var top = gameProperties.topOffset -20;
        var left = gameProperties.leftOffset;
        var right = left + (this.levelData.columns * gameProperties.scaleRatio* gameProperties.tileWidth);
        var wordBank = left * 0.25;
        
        this.timer = new Timer(left, top);
        this.counter = new Counter(right, top, this.levelData.words);
        
        this.tf_replay = scene.add.text(left + gameProperties.scaleRatio * gameProperties.tileWidth * 5, top, "Replay?", fontStyles.counterFontStyle);
        //this.tf_replay.anchor.set(0.5, 0.5);
        //this.tf_replay.inputEnabled = true;
        //this.tf_replay.input.useHandCursor = true;
        //this.tf_replay.events.onInputDown.add(this.restartGame, this);
        this.tf_replay.visible = false;
        
        this.uiElements = [];
        
        this.clues = scene.add.text(wordBank, top, "Clues:", fontStyles.clueFontStyle);
        this.uiElements.push(this.clues)
        console.log(this.levelData.words)
        for (var i = 0; i < this.levelData.wordcount; i++) {
            temp = "word" + i;
            this.uiElements.push(scene.add.text(wordBank, top + (35 * (1+ i)), this.levelData.words[i], fontStyles.clueFontStyle))
            
        }
        this.timer.start();
        
    },
    
    startGame: function () {
        //chillout man
    },

    updateLevel: function(){
        gameProperties.upLevel();
        this.timer.pause();
        game.state.start(states.stats);
    },
    
    endGame: function () {
        this.timer.pause();
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
        //var temp = "word" + word;
        game.add.text(wordBank, (this.boardTop -20) + (35 * (1+word)), this.levelData[temp], fontStyles.foundFontStyle);
    }
});

function resize() {
    var width;
    var height;
    if (window.innerWidth < window.innerHeight) {
        width = window.innerWidth;
        height = window.innerWidth;
    } else {
       width = window.innerHeight;
       height = window.innerHeight;
    }
    game.renderer.resize(window.innerWidth, height-20, 1)
    game.config.width = window.innerWidth
    game.config.height = height -20
    console.log(width+" "+height)
    
    var board = scene.board
    var uiElements = scene.uiElements
    gameProperties.screenHeight = height
    gameProperties.screenWidth = window.innerWidth
    
    //these are awfully specific numbers...
    if (gameProperties.scaleRatio == 0.875){
        gameProperties.scaleRatio = (gameProperties.screenWidth)/3216;
    }
    else if (gameProperties.screenWidth < gameProperties.screenHeight){
        gameProperties.scaleRatio =  (gameProperties.screenWidth )/3216;
    }
    else {
        gameProperties.scaleRatio = (gameProperties.screenHeight)/3216;
    }
    gameProperties.setScaleRatio(board.levelData.rowcount);
        
    gameProperties.topOffset = (gameProperties.screenHeight - (gameProperties.tileHeight * gameProperties.scaleRatio * board.levelData.rowcount)) * 0.5;
    gameProperties.leftOffset = (gameProperties.screenWidth - (gameProperties.tileWidth * gameProperties.scaleRatio * board.levelData.columncount)) * 0.5;
    
    board.repositionTiles()
    scene.timer.repositionTimer()
    
    for (i = 0; i < uiElements.length; i++){
        //console.log(uiElements[i])
        uiElements[i].setX(gameProperties.leftOffset * 0.25)
        uiElements[i].setY(gameProperties.topOffset + (35 * (i)))
    }
    
}
