var game

var gameConfig = {
    width: screen.width,
    height: screen.height,
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

    // load UI elements
    var theme = gameSession.theme
    this.load.image('background' ,'/Assets/Themes/' + theme + '/Background.png')
    this.load.image('resume' ,'/Assets/Themes/' + theme + '/Resume.png')
    this.load.image('continue' ,'/Assets/Themes/' + theme + '/Continue.png')
    this.load.image('finish' ,'/Assets/Themes/' + theme + '/Finish.png')
    this.load.image('hint' ,'/Assets/Themes/' + theme + '/Hint.png')
    this.load.image('overlay' ,'/Assets/Themes/' + theme + '/Overlay.png')
    this.load.image('pause' ,'/Assets/Themes/' + theme + '/Pause.png')
    this.load.image('quit' ,'/Assets/Themes/' + theme + '/Quit.png')
    this.load.image('shuffle' ,'/Assets/Themes/' + theme + '/Shuffle.png')
    this.load.spritesheet('sound','/Assets/Themes/' + theme + '/Sound.png',{ frameWidth: 100, frameHeight: 100 })

    console.log('Assets loaded!')

    //load the sound files
    this.load.audio('correct', '/Assets/Audio/correct.mp3')
    this.load.audio('incorrect', '/Assets/Audio/incorrect.mp3')
    this.load.audio('click', '/Assets/Audio/click.mp3')
    this.load.audio('hint', '/Assets/Audio/hint.mp3')
    this.load.audio('shuffle', '/Assets/Audio/shuffle.mp3')
    this.load.audio('finishGame', 'Assets/Audio/finish_game.mp3')
}
/**
 * initializes the necessary data stuctures, resizes the game to match the viewing window and begins the Phaser Game 
 * @function Create
 */
function create () {
    console.log('Creating!')
    var s = gameSession
    var background = this.add.sprite(0, 0, 'background').setOrigin(0, 0)
    this.board = new Board(this)
    this.buttons = loadButtons(this)
    
    if (gameSession.timer !== null) {
        gameSession.timer.board = this.board
    }
    
    resizeGame(background)
    game.scene.scenes[0].board.layout.positionSprites()
    console.log(this.buttons)
    for (item in this.buttons) {
        if (item === 'overlay') {
            this.buttons[item].fillScreen()
            continue
        }
        this.buttons[item].setSpritePosition()
    }
    
    var buttons = this.buttons
    window.onresize = function () {
        resizeGame(background)
        game.scene.scenes[0].board.layout.positionSprites()

        for (item in buttons) {
            if (item === 'overlay') {
                buttons[item].fillScreen()
                continue
            }
            buttons[item].setSpritePosition()
        }
    }

    //add the sound effects to the game.
    this.sound.add('correct')
    this.sound.add('incorrect')
    this.sound.add('click')
    this.sound.add('hint')
    this.sound.add('shuffle')
    this.sound.add('finishGame')
    
    if (!gameSession.practiceGame) {
        // Everything is loaded, so now start the timer
        gameSession.timer.resumeTimer()
    }
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
    
    const UIDepth = 20000000001
    var s = gameSession
    
    var buttons = {}
    
    
    buttons.hint = new Button(scope, 87, 50, 0, false)
    buttons.hint.setSprite('hint')
    buttons.hint.sprite.on('pointerdown', function() {
            this.tileSelected.unhighlightTile()
            this.currentSelection.unhighlightTile()
            this.currentSelection = null
            this.tileSelected = null
            
            this.hintedTiles = this.layout.getMatch()
            this.hintedTiles[0].highlightTile(gameSession.colours.hint)
            this.hintedTiles[1].highlightTile(gameSession.colours.hint)
            this.pulsateTile(this.hintedTiles[0])
            this.pulsateTile(this.hintedTiles[1])
            
            this.failedMatches = 0
            buttons.hint.toggleVisibility()
            
            if (!gameSession.practiceGame) {
                // Statistics for giving hint
                gameStats.hintsUsed += 1
                console.log("Hint: ",gameStats.hintsUsed)
            }
            
        },scope.board)
    
    buttons.shuffle = new Button(scope, 50, 65, 10, false)
    buttons.shuffle.setSprite('shuffle')
    buttons.shuffle.sprite.on('pointerdown', function () {
        buttons.shuffle.toggleVisibility()
        buttons.overlay.toggleVisibility()
        buttons.shuffleText.toggleVisibility()
        this.layout.shuffle()
        this.playSound('shuffle')
        this.failedMatches = 0
        
        if (!gameSession.practiceGame) {
            // Statistics for shuffling
            gameStats.timesShuffled += 1
            console.log('Shuffle: ',gameStats.timesShuffled)
        }
    }, scope.board)

    //sound button
    buttons.sound = new Button(scope, 94, 7, 0, true)
    buttons.sound.setSprite('sound')
    if (s.sound) {
        buttons.sound.sprite.setFrame(0)
    } else {
        buttons.sound.sprite.setFrame(1)
    }
    
    buttons.sound.sprite.on('pointerdown', function () {
        if (s.sound) {
            s.sound = false
            this.setFrame(1)
        } else {
            s.sound = true
            this.setFrame(0)
        }
    })
    
    buttons.overlay = new Button(scope, 50, 50, 5, false)
    buttons.overlay.setSprite('overlay')
    buttons.overlay.fillScreen()
    
    
    buttons.pause = new Button(scope, 5, 7, 0, true)
    buttons.pause.setSprite('pause')
    buttons.pause.sprite.on('pointerdown', function() {
        if (!gameSession.practiceGame) {
            gameSession.timer.pauseTimer()
        }
        
        scope.buttons.overlay.toggleVisibility()
        scope.buttons.resume.toggleVisibility()
        scope.buttons.quit.toggleVisibility()
        scope.buttons.pauseText.toggleVisibility()        

    }, scope)
    
    buttons.resume = new Button(scope, 33, 60, 10, false)
    buttons.resume.setSprite('resume')
    buttons.resume.sprite.on('pointerdown', function() {
        if (!gameSession.practiceGame) {
            gameSession.timer.resumeTimer()
        }
        
        scope.buttons.overlay.toggleVisibility()
        scope.buttons.quit.toggleVisibility()
        scope.buttons.resume.toggleVisibility()
        scope.buttons.pauseText.toggleVisibility()
    },scope)
        
    buttons.quit = new Button(scope, 66, 60, 10, false)
    buttons.quit.setSprite('quit')
    buttons.quit.sprite.on('pointerdown', function () {
        if (!gameSession.practiceGame) {
            // Statistics for time taken to complete game
            gameStats.endGameTime = gameSession.timer.timeLeft
            console.log("Duration: ", gameStats.startGameTime - gameStats.endGameTime)
            
            gameStats.completion = 'Quit'
        }
        endGame(false)
    }, scope)
        
    buttons.next = new Button(scope, 50, 70, 10, false)
    buttons.next.setSprite('continue')
    buttons.next.sprite.on('pointerdown', function() {
        if (!gameSession.practiceGame) {
            gameStats.completion = 'Finished'
        }
        endGame(false)
    })
    
    buttons.finish = new Button(scope, 50, 70, 10, false)
    buttons.finish.setSprite('finish')
    buttons.finish.sprite.on('pointerdown', function() {
        if (!gameSession.practiceGame) {
            gameStats.completion = 'Session Ended'
        }
        endGame(true)
    })
        
    buttons.pauseText = new Button(scope, 50, 40, 10)
    buttons.pauseText.sprite = scope.add.text(0, 0, 'Would you like to quit?', { font: '64px Arial', fill: '#000000'})
    buttons.pauseText.sprite.setVisible(false)
    buttons.pauseText.sprite.setOrigin(0.5,0.5)
    buttons.pauseText.sprite.setDepth(buttons.pauseText.depth)
    
    buttons.shuffleText = new Button(scope, 50, 40, 10)
    buttons.shuffleText.sprite = scope.add.text(0, 0, 'There are no moves remaining.', { font: '64px Arial', fill: '#000000'})
    buttons.shuffleText.sprite.setVisible(false)
    buttons.shuffleText.sprite.setOrigin(0.5,0.5)
    buttons.shuffleText.sprite.setDepth(buttons.shuffleText.depth)
    
    buttons.endText = new Button(scope, 50, 30, 10)
    buttons.endText.sprite = scope.add.text(0, 0, "Congratulations!", { font: '64px Arial', fill: '#000000'})
    buttons.endText.sprite.setVisible(false)
    buttons.endText.sprite.setOrigin(0.5,0.5)
    buttons.endText.sprite.setDepth(buttons.endText.depth)
    
    buttons.scoreText = new Button(scope, 50, 50, 10)
    buttons.scoreText.sprite = scope.add.text(0, 0, "", { font: '64px Arial', fill: '#000000', align: 'center'})
    buttons.scoreText.sprite.setVisible(false)
    buttons.scoreText.sprite.setOrigin(0.5,0.5)
    buttons.scoreText.sprite.setDepth(buttons.scoreText.depth)
    
    return buttons
}
/**
 * resizes the game by editing the game renderer.
 * @function resizeGame
 */
function resizeGame (background) {
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
    
    background.scaleX = width / background.width
    background.scaleY = height / background.height
}

/**
 * Create a new Game object
 * @function startGame
 */
function startGame () {
    game = new Phaser.Game(gameConfig, 'NL')
    if (!gameSession.practiceGame) {
        console.log("Game: ", gameStats.gameNumber)
        gameStats.startGameTime = gameSession.timer.timeLeft
    }
    console.log(game)
}
/**
 * destroys the game object and shows the lobby
 * @function endGame
 */
function endGame (timerDone) {
    this.game.destroy(true)
    window.onresize = null
    if (!gameSession.practiceGame) {
        postData()
        gameStats.resetGameStats()
    }
    
    if (timerDone) {
        window.location.replace('player_login.html')
    } else {
        showLobby()
    }
}

function postData() {
    // method taken off of https://stackoverflow.com/questions/14873443/sending-an-http-post-using-javascript-triggered-event
    var url = "http://199.116.235.91:5000/api/v1/create_mahjong_session"
    var method = "POST"
    var postData = JSON.stringify(gameStats)
    var shouldBeAsync = true;
    var request = new XMLHttpRequest()
    request.open(method, url, shouldBeAsync)
    request.setRequestHeader("JSON", "application/json;charset=UTF-8")
    request.send(postData)

}