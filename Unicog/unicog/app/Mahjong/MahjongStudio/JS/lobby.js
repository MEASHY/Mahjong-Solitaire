/**
 * Initializes the lobby with values from assets
 * @function initLobby
 */
function initLobby () {
    $.getJSON('/Assets/Layouts/PackageList.json', function ( packages ) {
        fillDropBox(packages, 'packageDropBox')
        $.getJSON('/Assets/Layouts/'+packages[0]+'/layouts.json', function ( layouts ) {
            fillDropBox(layouts, 'layoutDropBox')
        })
    })
    
    $.getJSON('/Assets/Tilesets/SetList.json', function ( tilesets ) {
        fillDropBox(tilesets, 'tilesetDropBox')
    })
    
    // TODO
    //$.getJSON('/Assets/Themes/???.json', initBackgrounds)
    
    document.getElementById('timerMinuteField').addEventListener('input', changeTimer)
    document.getElementById('timerSecondField').addEventListener('input', changeTimer)
}
/**
 * generic dropBox filling function. takes an element and populates it with the elements of a json array
 * @function fillDropBox
 * @param {json[]} json - json array of options 
 * @param {string} elementId - element to modify
 */
function fillDropBox ( json, elementId ) {
    var dropBox = document.getElementById(elementId).options
    for (i = 0; i < json.length; i++) {
        dropBox.add(new Option (json[i], json[i]), i)
    }
}
/**
 * When a user selects a new package load which layouts are available in that package and display them
 * @function changePackage
 * @param {string} name - the name of the package selected
 */
function changePackage (name) {
    $('#layoutDropBox').empty()
    $.getJSON('/Assets/Layouts/'+name+'/layouts.json', function ( layouts ) {
        fillDropBox(layouts, 'layoutDropBox')
    })
}
/**
 * Constrains the values available to the user to 1-59 minutes
 * @function changeTimer
 */
function changeTimer () {
    var minuteField = document.getElementById('timerMinuteField')
    var minutes = minuteField.value
    if (!minutes || minutes < 0 || minutes > 59) {
        minutes = 15
        minuteField.value = minutes
    }
    
    var secondField = document.getElementById('timerSecondField').value
    var seconds = secondField.value
    if (!seconds || seconds < 0 || seconds > 59) {
        seconds = 0
        secondField.value = seconds
    }
}
/**
 * changes the lobby Divs to visible and hides the gameDiv
 * @function showLobby
 */
function showLobby () {
    document.getElementById('colorstrip').style.display = 'block'
    document.getElementById('lobbyDiv').style.display = 'block'
    document.getElementById('gameDiv').style.display = 'none'
}
/**
 * Loads assets for the game and places them in the GameSession
 * @function showGame
 * @see GameSession
 */
function showGame () {
    
    gameSession.background = document.getElementById('backgroundDropBox').value
    gameSession.beginnerMode = document.getElementById('beginnerCheck').checked
    
    document.getElementById('colorstrip').style.display = 'none'
    document.getElementById('lobbyDiv').style.display = 'none'
    document.getElementById('gameDiv').style.display = 'block'
    
    // getJSON is asynchronous, so nesting the rest inside it ensures everything is loaded when startGame is called
    var packageName = document.getElementById('packageDropBox').value
    var layoutName = document.getElementById('layoutDropBox').value
    $.getJSON('/Assets/Layouts/'+packageName+'/'+layoutName+'.json', function ( layout ) {
        //gameSession.layout = layout
        
        var tileset = document.getElementById('tilesetDropBox').value
        $.getJSON('/Assets/Tilesets/'+tileset+'/tiles.json', function ( tileset ) {
            gameSession.tileset = tileset
            console.log("Tileset loaded")
            console.log(gameSession.tileset)
            
            $.getJSON('/Assets/Buttons/Buttons.json', function ( buttons ) {
                //gameSession.buttons = buttons
                
                if (gameSession.timer === null) {
                    var minutes = document.getElementById('timerMinuteField').value
                    var seconds = document.getElementById('timerSecondField').value
                    gameSession.timer = new Timer(parseInt(minutes) * 60 + parseInt(seconds))
                    document.getElementById('timerDiv').style.display = 'none'
                }
                startGame()
            })
        })
    })
}