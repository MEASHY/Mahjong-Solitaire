var gameConfig = {
    width: 1600,
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
        this.load.image('tile'+i, '/Assets/Tilesets/'+session.tileset.name+'/'+tiles[i])
    }

    // Load all of the button images
    var quitButton
    this.load.image('quitButton','/Assets/Tilesets/Buttons/Button.png')
    this.load.image('overlay','/Assets/Tilesets/Buttons/Overlay.png')
    
    console.log('Assets loaded!')
}
function create () {
    console.log('creating!')
    this.board = new Board(this)
    console.log('Game created!')
    var test = this.add.sprite(300, 50, 'quitButton').setInteractive()
    test.on('pointerdown', function() {
        var overlay = this.add.sprite(500, 50, 'overlay').setInteractive()
        overlay.setDepth(20000000000)
        console.log('hello')
    },this)
}

function triggerQuit() {
    console.log('quit triggered!')
}


function update () {
}

function startGame () {    
    var game = new Phaser.Game(gameConfig)
}

function endGame () {
    // TODO
    // This will have to close the game when that is implemented, it's a placeholder for now
    showLobby()
}