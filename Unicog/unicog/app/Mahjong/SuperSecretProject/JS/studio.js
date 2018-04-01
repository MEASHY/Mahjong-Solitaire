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

$.getJSON('/Assets/Tilesets/MahjongTiles1/tiles.json', function ( tileset ) {
    var session = new StudioSession()
    session.tileset = tileset
})
var session = new StudioSession()
session.layout.header.numChildren = 4
session.layoutX = 4
session.layoutY = 4

/**
 * Loads all necessary assets for the game
 * @function Preload
 */
function preload () {
    var session = new StudioSession();
    
    var tiles = session.tileset.main
    for (var i = 0; i < tiles.length; i++) {
        var index 
        if(i < 10) {
            var index = '0'+i.toString()
        } else {
            var index = i.toString()
        }
        this.load.image('tile'+index, '/Assets/Tilesets/'+session.tileset.name+'/'+tiles[i])
        //console.log('tile'+index)
    }
    
    console.log('Assets loaded!')
}
/**
 * initializes the necessary data stuctures, resizes the game to match the viewing window and begins the Phaser Game 
 * @function Create
 */
function create () {
    console.log('Creating!')
    this.board = new StudioBoard(this)

    console.log('Game created!')
    loadButtons(this)
    resizeGame()
    game.scene.scenes[0].board.layout.positionSprites()
    window.onresize = function () {
        resizeGame()
        game.scene.scenes[0].board.layout.positionSprites()
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
    var test = scope.add.sprite(100, 50, 'quit').setInteractive()
    test.on('pointerdown', function() {
        var studioSession = new StudioSession()
        var layout = scope.board.layout
        studioSession.layout.header.size = layout.size
        for (var i = 1; i <= layout.height; i++) {
            json = layout.getJSONLayer(i)
            if(json !== null && json.length !== 0) {
                console.log(JSON.stringify(json))
                studioSession.layout["layer"+i] = json
                studioSession.layout.header.height = i
            } 
        }
        console.log(prettyLayout(4))
    }, scope)  
}
function prettyLayout (indent) {
    //var studioSession = new StudioSession()
    var layout = (new StudioSession()).layout
    var str = ""
    var s = " ".repeat(indent)
    str += "{\n" + s + '"header":'
    str += JSON.stringify(layout.header,null,indent*2).slice(0,-1)
    str += s+"}"
    for (var i = 1; i <= layout.header.height; i++) {
        str += ",\n" + s + '"layer' + i + '":[\n'
        for(var j = 0; j < layout["layer"+i].length; j++) {
            str += s.repeat(2) + JSON.stringify(layout["layer"+i][j])+",\n"
        }
        str = str.slice(0,-2)+"\n"+s+"]"
    }
    str += "\n}"
    return str
}
/**
 * resizes the game by editing the game renderer.
 * @function resizeGame
 */
function resizeGame() {
    var session = new gameSession
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