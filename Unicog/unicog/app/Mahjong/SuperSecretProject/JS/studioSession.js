/** JavaScript singleton design pattern for storing Studio Data */
var StudioSession = function () {
    'use strict'
    
    if (!StudioSession.instance) {
        console.log('Singleton.instance is undefined. Creating singleton...')

        var _text = 'private'
        var tiles = {
            'main': [],
            'alt': [],
            'effects': []
        }
        
        //tileset config details
        var layoutX = null
        var layoutY = null
        
        var public_members = {
            tiles: {
                'main': [],
                'alt': [],
                'effects': []
            },
            layout: {
                "header":{
                    "size": null,
                    "height": null,
                    "uniqueTiles": null,
                    "maxDuplicates": null,
                    "numChildren": null
                }
            },
            tileset: null,
        
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
                StudioSession.instance = this
            }
        }

        // Set the instance as a reference to the public_members object
        public_members.setInstance()
        return public_members
    }
    else {
        //console.warn("Singleton already has an instance, here it is: " + StudioSession.instance);
        return StudioSession.instance
    }
}

gameSession = StudioSession
