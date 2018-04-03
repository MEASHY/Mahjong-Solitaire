/**
 * Initializes the lobby with values from assets
 * @function initLobby
 */
function initLobby () {
    document.getElementById('saveDiv').style.display = 'none'
    $.getJSON('/Assets/Layouts/PackageList.json', function ( packages ) {
        fillDropBox(packages, 'packageDropBox')
    })
}
/**
 * changes value of numChildren to the selected value
 * @function showLobby
 */
function changeChildren (value) {
    (new StudioSession()).layout.header.numChildren = value
}
/**
 * changes the lobby Divs to visible and hides the gameDiv
 * @function showLobby
 */
function showLobby () {
    document.getElementById('colorstrip').style.display = 'block'
    document.getElementById('lobbyDiv').style.display = 'block'
    document.getElementById('gameDiv').style.display = 'none'
    document.getElementById('saveDiv').style.display = 'none'
}
/**
 * Loads assets for the game and places them in the GameSession
 * @function showGame
 * @see GameSession
 */
function showGame () {
    session = new StudioSession()
    session.background = 'studioBackground'
   
    document.getElementById('colorstrip').style.display = 'none'
    document.getElementById('lobbyDiv').style.display = 'none'
    document.getElementById('gameDiv').style.display = 'block'
    
    session.layout.header.numChildren = parseInt(document.getElementById('childDropBox').value)
    session.layoutX = parseInt(document.getElementById('xField').value)
    session.layoutY = parseInt(document.getElementById('yField').value)
    
    $.getJSON('./Assets/Tilesets/studioTiles/tiles.json', function ( tileset ) {
        gameSession.tileset = tileset
        
        $.getJSON('/Assets/Buttons/Buttons.json', function ( buttons ) {
            gameSession.buttons = buttons
            startGame()
        })
    })
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
    dropBox.add(new Option ("Other", "Other"))
}
function checkOther(name){
  if(name=='Other')document.getElementById('otherDiv').innerHTML='Other: <input type="text" id="other" />';
  else document.getElementById('otherDiv').innerHTML='';
}
/**
 * changes the lobby Divs to visible and hides the gameDiv
 * @function showLobby
 */
function showSave () {
    document.getElementById('saveDiv').style.display = 'block'
}
/**
 * Hides the save div from view
 * @function showLobby
 */
function resumeStudio () {
    document.getElementById('saveDiv').style.display = 'none'
}
/**
 * saves a layout to the server
 * @function showLobby
 */
function saveLayout () {
    session = new StudioSession()
    
    session.layout.header.name = document.getElementById('nameText').value
    if (session.layout.header.name === "") {
        alert("Name field must be filled")
        return
    }
    
    var pkg = document.getElementById('packageDropBox').value
    if (pkg === "Other") {
        session.layout.header.package = document.getElementById('other').value
        if (session.layout.header.package === "") {
            alert("Package field must be filled")
            return
        }
    } else {
        session.layout.header.package = pkg
    }
    session.layout.header.uniqueTiles = parseInt(document.getElementById('uniqueTiles').value)
    session.layout.header.maxDuplicates = parseInt(document.getElementById('maxDuplicates').value)
    if (session.layout.header.uniqueTiles * session.layout.header.maxDuplicates * 2 < session.layout.header.size) {
        alert("There are not enough available tiles to fill this layout\n Please change the tile number fields.")
        return
    }
    //replace this with save to database later 
    console.log(prettyLayout(4))
}
/**
 * creates a prettyPrint of the layout
 * @param integer indent - the amount of indent per nested line  
 */
function prettyLayout (indent) {
    var layout = (new StudioSession()).layout
    var str = ""
    var s = " ".repeat(indent)
    str += "{\n" + s + '"header":'
    str += JSON.stringify(layout.header,null,indent*2).slice(0,-1)
    str += s+"}"
    for (var i = 1; i <= layout.header.height; i++) {
        str += ",\n" + s + '"layer' + i + '":[\n'
        for(var j = 0; j < layout["layer"+i].length; j++) {
            str += s.repeat(2) + JSON.stringify(layout["layer"+i][j])+",\n"
        }
        str = str.slice(0,-2)+"\n"+s+"]"
    }
    str += "\n}"
    return str
}








