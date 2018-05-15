var gameProperties = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    
    tileWidth: 268,
    tileHeight: 268,

    scaleRatio: window.devicePixelRatio/3,

    setScaleRatio: function(num){
        this.scaleRatio =  this.scaleRatio *(10/num);
    },

    revertScaleRatio: function(num){
        this.scaleRatio = this.scaleRatio / (10/num);
    },

    level: 'Level1',

    prev: 'Level1',

    vers: '0',

    attempt: 0,

    upAttempt: function(){
        this.attempt = this.attempt + 1;
    },

    upLevel: function(){
        if (this.attempt != 15){
           if (this.level == 'Level1'){
               this.prev = 'Level1';
               this.level = 'Level2';
           }
           else if (this.level == 'Level2'){
               this.prev = 'Level2';
               this.level = 'Level3';
           }
           else if (this.level == 'Level3'){
               this.prev = 'Level3';
               this.level = 'Level4';
           }
           else if (this.level == 'Level4'){
               this.prev = 'Level4';
               this.level = 'Level5';
           }
           else if (this.level == 'Level5'){
               this.prev = 'Level5';
               this.level = 'Level6';
           }
           else if (this.level == 'Level6'){
               this.prev = 'Level6';
               this.level = 'Level7';
           }
           else if (this.level == 'Level7'){
               this.prev = 'Level7';
               this.level = 'Level8';
           }
           else if (this.level == 'Level8'){
               this.prev = 'Level8';
               this.level = 'Level9';
           }
           else if (this.level == 'Level9'){
               this.prev = 'Level9';
               this.level = 'Level10';
           }
           else if (this.level == 'Level10'){
               this.prev = 'Level10';
               this.level = 'Level11';
           }
           else if (this.level == 'Level11'){
               this.prev = 'Level11';
               this.level = 'Level12';
           }
           else if (this.level == 'Level12'){
               this.prev = 'Level12';
               this.level = 'Level13';
           }
           else if (this.level == 'Level13'){
               this.prev = 'Level13';
               this.level = 'Level14';
           }
           else if (this.level == 'Level14'){
               this.prev = 'Level14';
               this.level = 'Level15';
           }
       }
       else {
            this.prev = 'Level15';
       }
       
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

var states = {
    game: "game",
    stats: "stats",
};

var graphicAssets = {
    tiles:{URL: 'assets/tiles.png', name:'tiles', frames: 96},
};

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

gameState.prototype = {
    
    init: function() {

       
        
    },
    
    preload: function () {
        

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

        var modVersion = gameProperties.vers % 250;

        var levelS = levelString + grade+ "/" +grade+"_version"+modVersion;

        game.load.text('the_level', levelS);

        game.load.image("A", '/static/wsAssets/tile1_268_pixels/tile1_A_268.png');
        game.load.image("B", '/static/wsAssets/tile1_268_pixels/tile1_B_268.png');
        game.load.image("C", '/static/wsAssets/tile1_268_pixels/tile1_C_268.png');
        game.load.image("D", '/static/wsAssets/tile1_268_pixels/tile1_D_268.png');
        game.load.image("E", '/static/wsAssets/tile1_268_pixels/tile1_E_268.png');
        game.load.image("F", '/static/wsAssets/tile1_268_pixels/tile1_F_268.png');
        game.load.image("G", '/static/wsAssets/tile1_268_pixels/tile1_G_268.png');
        game.load.image("H", '/static/wsAssets/tile1_268_pixels/tile1_H_268.png');
        game.load.image("I", '/static/wsAssets/tile1_268_pixels/tile1_I_268.png');
        game.load.image("J", '/static/wsAssets/tile1_268_pixels/tile1_J_268.png');
        game.load.image("K", '/static/wsAssets/tile1_268_pixels/tile1_K_268.png');
        game.load.image("L", '/static/wsAssets/tile1_268_pixels/tile1_L_268.png');
        game.load.image("M", '/static/wsAssets/tile1_268_pixels/tile1_M_268.png');
        game.load.image("N", '/static/wsAssets/tile1_268_pixels/tile1_N_268.png');
        game.load.image("O", '/static/wsAssets/tile1_268_pixels/tile1_O_268.png');
        game.load.image("P", '/static/wsAssets/tile1_268_pixels/tile1_P_268.png');
        game.load.image("Q", '/static/wsAssets/tile1_268_pixels/tile1_Q_268.png');
        game.load.image("R", '/static/wsAssets/tile1_268_pixels/tile1_R_268.png');
        game.load.image("S", '/static/wsAssets/tile1_268_pixels/tile1_S_268.png');
        game.load.image("T", '/static/wsAssets/tile1_268_pixels/tile1_T_268.png');
        game.load.image("U", '/static/wsAssets/tile1_268_pixels/tile1_U_268.png');
        game.load.image("V", '/static/wsAssets/tile1_268_pixels/tile1_V_268.png');
        game.load.image("W", '/static/wsAssets/tile1_268_pixels/tile1_W_268.png');
        game.load.image("X", '/static/wsAssets/tile1_268_pixels/tile1_X_268.png');
        game.load.image("Y", '/static/wsAssets/tile1_268_pixels/tile1_Y_268.png');
        game.load.image("Z", '/static/wsAssets/tile1_268_pixels/tile1_Z_268.png');
        game.load.image("selA", '/static/wsAssets/tile_select/tile1_A_268.png');
        game.load.image("selB", '/static/wsAssets/tile_select/tile1_B_268.png');
        game.load.image("selC", '/static/wsAssets/tile_select/tile1_C_268.png');
        game.load.image("selD", '/static/wsAssets/tile_select/tile1_D_268.png');
        game.load.image("selE", '/static/wsAssets/tile_select/tile1_E_268.png');
        game.load.image("selF", '/static/wsAssets/tile_select/tile1_F_268.png');
        game.load.image("selG", '/static/wsAssets/tile_select/tile1_G_268.png');
        game.load.image("selH", '/static/wsAssets/tile_select/tile1_H_268.png');
        game.load.image("selI", '/static/wsAssets/tile_select/tile1_I_268.png');
        game.load.image("selJ", '/static/wsAssets/tile_select/tile1_J_268.png');
        game.load.image("selK", '/static/wsAssets/tile_select/tile1_K_268.png');
        game.load.image("selL", '/static/wsAssets/tile_select/tile1_L_268.png');
        game.load.image("selM", '/static/wsAssets/tile_select/tile1_M_268.png');
        game.load.image("selN", '/static/wsAssets/tile_select/tile1_N_268.png');
        game.load.image("selO", '/static/wsAssets/tile_select/tile1_O_268.png');
        game.load.image("selP", '/static/wsAssets/tile_select/tile1_P_268.png');
        game.load.image("selQ", '/static/wsAssets/tile_select/tile1_Q_268.png');
        game.load.image("selR", '/static/wsAssets/tile_select/tile1_R_268.png');
        game.load.image("selS", '/static/wsAssets/tile_select/tile1_S_268.png');
        game.load.image("selT", '/static/wsAssets/tile_select/tile1_T_268.png');
        game.load.image("selU", '/static/wsAssets/tile_select/tile1_U_268.png');
        game.load.image("selV", '/static/wsAssets/tile_select/tile1_V_268.png');
        game.load.image("selW", '/static/wsAssets/tile_select/tile1_W_268.png');
        game.load.image("selX", '/static/wsAssets/tile_select/tile1_X_268.png');
        game.load.image("selY", '/static/wsAssets/tile_select/tile1_Y_268.png');
        game.load.image("selZ", '/static/wsAssets/tile_select/tile1_Z_268.png');
        game.load.image("lockA", '/static/wsAssets/tile_lock/tile1_A_268.png');
        game.load.image("lockB", '/static/wsAssets/tile_lock/tile1_B_268.png');
        game.load.image("lockC", '/static/wsAssets/tile_lock/tile1_C_268.png');
        game.load.image("lockD", '/static/wsAssets/tile_lock/tile1_D_268.png');
        game.load.image("lockE", '/static/wsAssets/tile_lock/tile1_E_268.png');
        game.load.image("lockF", '/static/wsAssets/tile_lock/tile1_F_268.png');
        game.load.image("lockG", '/static/wsAssets/tile_lock/tile1_G_268.png');
        game.load.image("lockH", '/static/wsAssets/tile_lock/tile1_H_268.png');
        game.load.image("lockI", '/static/wsAssets/tile_lock/tile1_I_268.png');
        game.load.image("lockJ", '/static/wsAssets/tile_lock/tile1_J_268.png');
        game.load.image("lockK", '/static/wsAssets/tile_lock/tile1_K_268.png');
        game.load.image("lockL", '/static/wsAssets/tile_lock/tile1_L_268.png');
        game.load.image("lockM", '/static/wsAssets/tile_lock/tile1_M_268.png');
        game.load.image("lockN", '/static/wsAssets/tile_lock/tile1_N_268.png');
        game.load.image("lockO", '/static/wsAssets/tile_lock/tile1_O_268.png');
        game.load.image("lockP", '/static/wsAssets/tile_lock/tile1_P_268.png');
        game.load.image("lockQ", '/static/wsAssets/tile_lock/tile1_Q_268.png');
        game.load.image("lockR", '/static/wsAssets/tile_lock/tile1_R_268.png');
        game.load.image("lockS", '/static/wsAssets/tile_lock/tile1_S_268.png');
        game.load.image("lockT", '/static/wsAssets/tile_lock/tile1_T_268.png');
        game.load.image("lockU", '/static/wsAssets/tile_lock/tile1_U_268.png');
        game.load.image("lockV", '/static/wsAssets/tile_lock/tile1_V_268.png');
        game.load.image("lockW", '/static/wsAssets/tile_lock/tile1_W_268.png');
        game.load.image("lockX", '/static/wsAssets/tile_lock/tile1_X_268.png');
        game.load.image("lockY", '/static/wsAssets/tile_lock/tile1_Y_268.png');
        game.load.image("lockZ", '/static/wsAssets/tile_lock/tile1_Z_268.png');
        
    },
    
    create: function () {


        var toPrint = game.cache.getText("the_level");
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
        gameProperties.boardTop = (gameProperties.screenHeight - (gameProperties.tileHeight * gameProperties.scaleRatio * this.levelData.row)) * 0.5;
        gameProperties.boardLeft = (gameProperties.screenWidth - (gameProperties.tileWidth * gameProperties.scaleRatio *this.levelData.columns)) * 0.5;
        

        //console.log("Scale ratio (dpr/3) " + gameProperties.scaleRatio);
        //console.log("Screen height " + gameProperties.screenHeight);
        //console.log("Screen Width " + gameProperties.screenWidth);
       

        this.initBoard();
        this.initUI();
        this.game.stage.backgroundColor = '#FFFFFF';


    },

    update: function () {
        
    },
    
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
