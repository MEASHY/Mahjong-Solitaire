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

$.getJSON('Assets/Tilesets/studioTiles/tiles.json', function ( tileset ) {
    gameSession.tileset = tileset
})

/**
 * Loads all necessary assets for the game
 * @function Preload
 */
function preload () {
    var session = new StudioSession();
    
    this.load.image('tile', 'Assets/Tilesets/studioTiles/tile.png')
    this.load.image('overlay' ,'Assets/Buttons/Overlay.png')
    this.load.image('quit' ,'Assets/Buttons/Quit.png')
    this.load.image('save' ,'Assets/Buttons/Save.png')
    this.load.image('toggle' ,'Assets/Buttons/Toggle.png')
    
    console.log('Assets loaded!')
}
/**
 * initializes the necessary data stuctures, resizes the game to match the viewing window and begins the Phaser Game 
 * @function Create
 */
function create () {
    console.log('Creating!')
    this.board = new StudioBoard(this)
    this.buttons = loadButtons(this)
    resizeGame()
    game.scene.scenes[0].board.layout.positionSprites()
    for (item in this.buttons) {
        if (item === 'overlay') {
            this.buttons[item].fillScreen()
            continue
        }
        this.buttons[item].setSpritePosition()
    }
    
    var buttons = this.buttons
    window.onresize = function () {
        resizeGame()
        game.scene.scenes[0].board.layout.positionSprites()

        for (item in buttons) {
            if (item === 'overlay') {
                buttons[item].fillScreen()
                continue
            }
            buttons[item].setSpritePosition()
        }
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
    
    var buttons = {}
    
    buttons.overlay = new Button(scope, 50, 50, 5, false)
    buttons.overlay.setSprite('overlay')
    buttons.overlay.fillScreen()
    
    
    buttons.quit = new Button(scope, 10, 10, 0, true)
    buttons.quit.setSprite('quit')
    buttons.quit.sprite.on('pointerdown', function() {
        endGame()
    })
    
    buttons.save = new Button(scope, 10, 30, 0, true)
    buttons.save.setSprite('save')
    buttons.save.sprite.on('pointerdown', function() {
        var layout = scope.board.layout
        if (layout.size === 0) {
            alert("There must be at least two tiles in a layout.")
            return
        }
        if (layout.size%2 !== 0) {
            alert("There must be an even number of tiles in a layout")
            return
        }
        gameSession.layout.header.size = layout.size
        for (var i = 1; i <= layout.height; i++) {
            json = layout.getLayerAsJSON(i)
            if(json !== null && json.length !== 0) {
                console.log(JSON.stringify(json))
                gameSession.layout["layer"+i] = json
                gameSession.layout.header.height = i
            } 
        }
        scope.buttons.overlay.toggleVisibility()
        showSave()
    }, scope)
    
    buttons.toggle = new Button(scope, 10, 40, 0, true)
    buttons.toggle.setSprite('toggle')
    buttons.toggle.sprite.setOrigin(0.39, 0.5)
    buttons.toggle.sprite.on('pointerdown', function() {
        scope.board.layout.toggleVisible()
    }, scope)
    
    buttons.sizeText = new Button(scope, 10, 50, 10)
    buttons.sizeText.sprite = scope.add.text(0, 0, "Size: 0", { font: '48px Arial', fill: '#ffff00', align: 'center'})
    buttons.sizeText.sprite.setOrigin(0.5,0.5)
    buttons.sizeText.sprite.setDepth(buttons.sizeText.depth)
    
    return buttons
}
/**
 * resizes the game by editing the game renderer.
 * @function resizeGame
 */
function resizeGame() {
    var session = gameSession
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
    layoutWidth = (session.layoutX-1) * session.tileset.tileFaceX + session.tileset.tileX
    layoutHeight = (session.layoutY-1) * session.tileset.tileFaceY + session.tileset.tileY
    
    //calculate the optimal tile scaling and necessary offset to center
    scale = Math.min((height * 0.9) / Math.max(layoutWidth, layoutHeight), 1)
    session.scale = scale   
    session.offsetX = (width / 2) - ((layoutWidth * scale) / 2) 
                        + (session.tileset.tileFaceX * scale / 2) 
    session.offsetY = (height / 2) - ((layoutHeight * scale) / 2) 
                        + (session.tileset.tileFaceY * scale / 2)
}

/**
 * Create a new Game object
 * @function startGame
 */
function startGame () {
    game = new Phaser.Game(gameConfig, 'NL')
    console.log(game)
}
/**
 * destroys the game object and shows the lobby
 * @function endGame
 */
function endGame () {
    this.game.destroy(true)
    showLobby()
}
