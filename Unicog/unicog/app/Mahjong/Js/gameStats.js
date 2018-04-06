/** JavaScript singleton design pattern for storing game statistics data */
var GameStats = function () {
    'use strict'
    
    if (!GameStats.instance) {
        console.log('Singleton.instance is undefined. Creating singleton...')
        
        var gameNumber = 1
        
        var statistics = {
            gameNumber: 1,
            package: null,
            layout: null,
            selections: 0,
            deselections: 0,
            correctMatches: 0,
            incorrectMatches: 0,
            hintsEnabled: false,
            hintsUsed: 0,
            timesShuffled: 0,
            completion: null,
            startGameTime: 0,
            endGameTime: 0,
            user: null,
            researcher: null,

            setInstance: function () {
                GameStats.instance = this
            },
            
            resetGameStats: function() {
                this.gameNumber += 1 
                this.package = null
                this.layout = null
                this.selections = 0
                this.deselections = 0
                this.correctMatches = 0
                this.incorrectMatches = 0
                this.hintsEnabled = false
                this.hintsUsed = 0
                this.timesShuffled = 0
                this.completion = null
                this.startGameTime = 0
                this.endGameTime = 0
            }
        }

        // Set the instance as a reference to the statistics object
        statistics.setInstance()
        return statistics
        
    }
    else {
        //console.warn("Singleton already has an instance, here it is: " + GameStats.instance);
        return GameStats.instance
    }
};

var gameStats = new GameStats()