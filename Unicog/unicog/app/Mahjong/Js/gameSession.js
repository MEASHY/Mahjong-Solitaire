/** JavaScript singleton design pattern for storing game session data */
var GameSession = function () {
    'use strict'
    
    if (!GameSession.instance) {
        console.log('Singleton.instance is undefined. Creating singleton...')

        var _text = 'private'
        
        var public_members = {
            text: 'public',
            
            // Game information
            layout: null,
            tileset: null,
            buttons: null,
            colours: null,
            background: null,
            beginnerMode: false,
            enabledHints: false,
            practiceGame: false,
            timer: null,
            
            // Layout information
            sizeX: 0,
            sizeY: 0,
            scale: 0,
            offsetX: 0,
            offsetY: 0,
        
            logText: function () {
            	// Console log the public member variable
                console.info('Singleton>>Public Member: ' + this.text)
                
                // Console log the private member variable
                console.info('Singleton>>Private Member: ' + _text)
            },
            toString: function () {
                return '[object Singleton]'
            },
            setInstance: function () {
                GameSession.instance = this
            }
        }

        // Set the instance as a reference to the public_members object
        public_members.setInstance()
        return public_members
    }
    else {
        //console.warn("Singleton already has an instance, here it is: " + GameSession.instance);
        return GameSession.instance
    }
};

gameSession = new GameSession()
