var gameConfig = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'gameDiv',
    scene: {
        preload: preload,
        create: create
    },
    callbacks: {
        preBoot: function () { console.log('I get called before all of the Game systems are created, but after Device is available')},
        postBoot: function () { console.log('I get called after all of the Game systems are running, immediately before raf starts')}
    }

}

function preload() {
    this.load.image('1Dot', '/Assets/Tilesets/Test/Mahjong-Dot-1.jpg')
}

function create() {
    console.log("creating!")
    this.board = new Board(this)
    //this.add.sprite(100,100,"1Dot")
}

function update() {

}

var game = new Phaser.Game(gameConfig)
console.log(game)