//JavaScript singleton design pattern

var GameSession = function() {
    "use strict";
    
    if (!GameSession.instance) {
        console.log("Singleton.instance is undefined. Creating singleton...");

        var _text = 'private';
        var tiles = {
            "main": [],
            "alt": [],
            "effects": []
        }
        
        //tileset config details
        var name = null
        var size = null
        var difficulty = null
        var beginnerMode = false
        
        var public_members = {
            text: 'public',
            tiles: {
                "main": [],
                "alt": [],
                "effects": []
            },
        
            logText: function() {
            	// Console log the public member variable
                console.info("Singleton>>Public Member: " + this.text);
                
                // Console log the private member variable
                console.info("Singleton>>Private Member: " + _text);
            },
            toString: function() {
                return "[object Singleton]";
            },
            setInstance: function() {
                GameSession.instance = this;
            }
        };

        // Set the instance as a reference to the public_members object
        public_members.setInstance();
        return public_members;
    }
    else {
        //console.warn("Singleton already has an instance, here it is: " + GameSession.instance);
        return GameSession.instance;
    }
};
