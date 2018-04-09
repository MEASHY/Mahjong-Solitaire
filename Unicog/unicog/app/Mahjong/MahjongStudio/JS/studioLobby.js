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
 * @function changeChildren
 */
function changeChildren (value) {
    (new StudioSession()).layout.header.numChildren = value
}
/**
 * changes the lobby Divs to visible and hides the gameDiv
 * @function showLobby
 */
function showLobby () {
    document.getElementById('lobbyDiv').style.display = 'block'
    document.getElementById('gameDiv').style.display = 'none'
    document.getElementById('saveDiv').style.display = 'none'
}
/**
 * Loads assets for the game and places them in the StudioSession
 * @function showGame
 * @see StudioSession
 */
function showGame () {
    session = new StudioSession()
    session.background = 'studioBackground'
   
    document.getElementById('lobbyDiv').style.display = 'none'
    document.getElementById('gameDiv').style.display = 'block'
    
    session.layout.header.numChildren = parseInt(document.getElementById('childDropBox').value)
    session.layoutX = parseInt(document.getElementById('xField').value)
    session.layoutY = parseInt(document.getElementById('yField').value)
    
    startGame()
}
/**
 * generic dropBox filling function. takes an element and populates it with the elements of a json array
 * @function fillDropBox
 * @param {json[]} json - json array of options 
 * @param {string} elementId - element to modify
 */
function fillDropBox ( json, elementId ) {
    var dropBox = document.getElementById(elementId).options
    for (var i = 0; i < json.length; i++) {
        dropBox.add(new Option (json[i], json[i]), i)
    }
    dropBox.add(new Option ('Other', 'Other'))
}
function checkOther(name){
    if (name === 'Other') {
        document.getElementById('otherDiv').innerHTML = 'Other: <input type="text" id="other" />'
    } else {
        document.getElementById('otherDiv').innerHTML = ''
    }
}
/**
 * changes the Save Div to visible
 * @function showSave
 */
function showSave () {
    document.getElementById('saveDiv').style.display = 'block'
}
/**
 * Hides the save div from view
 * @function resumeStudio
 */
function resumeStudio () {
    document.getElementById('saveDiv').style.display = 'none'
    game.scene.scenes[0].buttons.overlay.toggleVisibility()
}
/**
 * saves a layout to the server.
 * <p>
 * The form supplies a package and a name for the layout. 
 * Checks if name and package are alphanumeric. The name and package cannot be empty.
 * This also checks if the supplied tile metrics are enough to generate the layout.
 * @function showLobby
 */
function saveLayout () {
    session = new StudioSession()
    
    session.layout.header.name = document.getElementById('nameText').value
    var alphanumers = /^[a-zA-Z0-9 ]+$/
    if (!alphanumers.test($('#nameText').val())) {
        alert('Name must be alphanumeric')
        return
    }
    if (session.layout.header.name === '') {
        alert('Name field must be filled')
        return
    }
    
    var pkg = document.getElementById('packageDropBox').value
    if (pkg === 'Other') {
        session.layout.header.package = document.getElementById('other').value
        if (session.layout.header.package === '') {
            alert('Package field must be filled')
            return
        }
        var alphanumers = /^[a-zA-Z0-9 ]+$/
        if (!alphanumers.test(session.layout.header.package)) {
            alert('Package must be alphanumeric')
            return
        }
    } else {
        session.layout.header.package = pkg
    }
    session.layout.header.uniqueTiles = parseInt(document.getElementById('uniqueTiles').value)
    session.layout.header.maxDuplicates = parseInt(document.getElementById('maxDuplicates').value)
    if (session.layout.header.uniqueTiles * session.layout.header.maxDuplicates * 2 < session.layout.header.size) {
        alert('There are not enough available tiles to fill this layout\n Please change the tile number fields.')
        return
    }
    var json = prettyLayout(4)
    console.log(json)
    postData(json)
    //downloadLayout('data:,'+json,session.layout.header.name+'.json')
}
function downloadLayout(json, name) {
    var link = document.createElement('a')
    link.download = name
    link.href = json
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    delete link
}
/**
 * creates a prettyPrint of the layout
 * @function prettyLayout
 * @param integer indent - the amount of indent per nested line  
 */
function prettyLayout (indent) {
    var layout = (new StudioSession()).layout
    var str = ''
    var s = ' '.repeat(indent)
    str += '{\n' + s + '"header":'
    str += JSON.stringify(layout.header,null,indent*2).slice(0,-1)
    str += s+'}'
    for (var i = 1; i <= layout.header.height; i++) {
        str += ',\n' + s + '"layer' + i + '":[\n'
        for(var j = 0; j < layout['layer'+i].length; j++) {
            str += s.repeat(2) + JSON.stringify(layout['layer'+i][j])+',\n'
        }
        str = str.slice(0,-2)+'\n'+s+']'
    }
    str += '\n}'
    return str
}
/**
 * creates a prettyPrint of the layout
 * @function postData
 * @param JSON json - JSON file posted to the server
 */
function postData(json) {
    // method taken off of https://stackoverflow.com/questions/14873443/sending-an-http-post-using-javascript-triggered-event
    var url = 'http://localhost:5000/api/v1/save_mahjong_layout'
    var method = 'POST'
    var postData = json
    var shouldBeAsync = true
    var request = new XMLHttpRequest()
    request.open(method, url, shouldBeAsync)
    request.setRequestHeader('JSON', 'application/json;charset=UTF-8')
    request.send(postData)

}





