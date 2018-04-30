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
        
        var public_members = {
            layoutX: null,
            layoutY: null,
            tiles: {
                'main': [],
                'alt': [],
                'effects': []
            },
            layout: {
                'header':{
                    'name': null,
                    'package': null,
                    'size': 0,
                    'height': 0,
                    'uniqueTiles': null,
                    'maxDuplicates': null,
                    'numChildren': null
                }
            },
            tileset: null,
            visible: true,
        
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
        //console.warn('Singleton already has an instance, here it is: ' + StudioSession.instance)
        return StudioSession.instance
    }
}

var gameSession = new StudioSession()
