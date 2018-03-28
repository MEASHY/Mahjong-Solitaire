var game

var gameConfig = {
    width: 1400,
    height: 1000,
    backgroundColor: '#00422c',
    type: Phaser.AUTO,
    parent: 'gameDiv',
    scene: {
        preload: preload,
        create: create
    }
}
/**
 * Loads all necessary assets for the game
 * @function Preload
 */
function preload () {
    
    var tiles = gameSession.tileset.main
    for (var i = 0; i < tiles.length; i++) {
        var index 
        if(i < 10) {
            var index = '0'+i.toString()
        } else {
            var index = i.toString()
        }
        this.load.image('tile'+index, '/Assets/Tilesets/'+gameSession.tileset.name+'/'+tiles[i])
        console.log('tile'+index)
    }

    // Load all of the button images
    var buttonList = gameSession.buttons.main
    for (var i = 0; i < buttonList.length; i++) {
        this.load.image(buttonList[i].name, '/Assets/Buttons/'+buttonList[i].file)
        console.log(buttonList[i].name)
    }
    
    console.log('Assets loaded!')

    //load the sound files
    this.load.audio('correct', '/Assets/Audio/correct.mp3')
    this.load.audio('error', '/Assets/Audio/error.wav')
}
/**
 * initializes the necessary data stuctures, resizes the game to match the viewing window and begins the Phaser Game 
 * @function Create
 */
function create () {
    console.log('Creating!')
    this.board = new Board(this)

    console.log('Game created!')
    
    resizeGame()
    game.scene.scenes[0].board.layout.positionSprites()
    window.onresize = function () {
        resizeGame()
        game.scene.scenes[0].board.layout.positionSprites()
    }

    //placing buttons. This will need cleaning up later on
    loadButtons(this)

    //add the sound effects to the game.
    this.sound.add('correct')
    this.sound.add('error')
}
/**
 * Ends The game
 * @function triggerQuit
 */
function triggerQuit () {
    console.log('Quit triggered!')
}
/**
 * Loads button assets for the game
 * @function loadButtons
 * @param {context} scope - The scene that the buttons reside 
 */
function loadButtons (scope) {
    var test = scope.add.sprite(100, 50, 'quit').setInteractive()
    test.on('pointerdown', function() {
        overlay = scope.add.sprite(500, 500, 'overlay').setInteractive()
        overlay.setScale(10)
        overlay.setDepth(20000000000)

        cancel = scope.add.sprite(400, 500, 'cancel').setInteractive()
        cancel.setDepth(20000000001)
        cancel.on('pointerdown', function() {
            overlay.destroy()
            quit.destroy()
            cancel.destroy()
        },scope)

        quit = scope.add.sprite(700, 500, 'quit-blue').setInteractive()
        quit.setDepth(20000000001)
        quit.on('pointerdown', function () {
            
            // Statistics for time taken to complete game
            gameStats.endGameTime = gameSession.timer.timeLeft
            console.log("Duration: ", gameStats.startGameTime - gameStats.endGameTime)
            
            endGame()
        }, scope)
    }, scope)  
}
/**
 * resizes the game by editing the game renderer.
 * @function resizeGame
 */
function resizeGame() {
    var s = gameSession
    var width
    var height

    //determine maximum games size while maintaining a 4:3 ratio
    if (window.innerWidth < window.innerHeight) {
        width = window.innerWidth-16
        height = window.innerWidth * (0.75) - 16
    } 
    if (window.innerWidth > window.innerHeight) {
        width = Math.min(window.innerHeight * (4/3), window.innerWidth) -16
        height = width * (3/4) - 16
    }
    
    game.renderer.resize(width, height, 1);
    game.config.width = width
    game.config.height = height

    //calculate the overall size of the layout
    layoutWidth = (s.sizeX-1) * s.tileset.tileFaceX + s.tileset.tileX
    layoutHeight = (s.sizeY-1) * s.tileset.tileFaceY + s.tileset.tileY
    
    //calculate the optimal tile scaling and necessary offset to center
    scale = Math.min((height * 0.9) / Math.max(layoutWidth, layoutHeight), 1)
    s.scale = scale   
    s.offsetX = (width / 2) - ((layoutWidth * scale) / 2) 
                        + (s.tileset.tileFaceX * scale / 2) 
    s.offsetY = (height / 2) - ((layoutHeight * scale) / 2) 
                        + (s.tileset.tileFaceY * scale / 2)
}

/**
 * Create a new Game object
 * @function startGame
 */
function startGame () {
    game = new Phaser.Game(gameConfig, 'NL')
    console.log("Game: ", gameStats.gameNumber)
    gameStats.startGameTime = gameSession.timer.timeLeft
    console.log(game)
}
/**
 * destroys the game object and shows the lobby
 * @function endGame
 */
function endGame () {
    this.game.destroy(true)
    gameStats.resetGameStats()
    showLobby()
}