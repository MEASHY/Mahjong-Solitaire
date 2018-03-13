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

function preload () {
    var session = new GameSession();
    
    var tiles = session.tileset.main
    for (var i = 0; i < tiles.length; i++) {
        var index 
        if(i < 10) {
            var index = '0'+i.toString()
        } else {
            var index = i.toString()
        }
        this.load.image('tile'+index, '/Assets/Tilesets/'+session.tileset.name+'/'+tiles[i])
        console.log('tile'+index)
    }
    
    console.log('Assets loaded!')
}

function create () {
    console.log('creating!')
    this.board = new Board(this)
    console.log("Game created!")
    
    resizeGame()
    game.scene.scenes[0].board.layout.positionSprites()
    window.onresize = function () {
        resizeGame()
        game.scene.scenes[0].board.layout.positionSprites()
    }
}

function update () {
}

function resizeGame() {
    var session = new GameSession()
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
    layoutWidth = (session.sizeX-1) * session.tileset.tileFaceX + session.tileset.tileX
    layoutHeight = (session.sizeY-1) * session.tileset.tileFaceY + session.tileset.tileY
    
    //calculate the optimal tile scaling and necessary offset to center
    scale = Math.min((height * 0.9) / Math.max(layoutWidth, layoutHeight), 1)
    session.scale = scale   
    session.offsetX = (width / 2) - ((layoutWidth * scale) / 2) 
                        + (session.tileset.tileFaceX * scale / 2) 
    session.offsetY = (height / 2) - ((layoutHeight * scale) / 2) 
                        + (session.tileset.tileFaceY * scale / 2)
}


function startGame () {
    game = new Phaser.Game(gameConfig)
    console.log(game)
}

function endGame () {
    // TODO
    // This will have to close the game when that is implemented, it's a placeholder for now
    showLobby()
}