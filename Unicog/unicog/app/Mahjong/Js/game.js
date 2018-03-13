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
    
    console.log('Assets loaded!')
}

function create () {
    console.log('creating!')
    this.board = new Board(this)
    console.log('Game created!')
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