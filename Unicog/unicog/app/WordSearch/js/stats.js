var stats = function (game){
	this.menuTop;
	this.menuLeft;
	this.menuCenter;
	this.menuRight;
	this.spacer;
	this.levelData
};

var resultStyle = {font: "bold 30px Arial", fill: "#000"};
var headingStyle = {font: " 24px Arial", fill: "#000"};
var itemStyle = {font: " 18px Arial", fill: "#000"};
var c = document.cookie;


var stats = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function stats(){
        Phaser.Scene.call(this, {key: "stats"});
        
        
        if (gameProperties.attempt != 0){
			this.levelData = this.levelData = JSON.parse(this.game.cache.getText("the_level"));
		}
		try{
			this.menuTop = (gameProperties.screenHeight - (gameProperties.tileHeight * gameProperties.scaleRatio * this.levelData.row)) * 0.5;
		}
		catch (err){
			this.menuTop = (gameProperties.screenHeight - (gameProperties.tileHeight * gameProperties.scaleRatio * 5)) * 0.5;
		}
        this.menuLeft = gameProperties.screenWidth  * 0.25;
        this.menuRight = gameProperties.screenWidth * 0.75;
        this.menuCenter = gameProperties.screenWidth * 0.5;
        try{
        	gameProperties.revertScaleRatio(this.levelData.row);
        } catch (err) {
        	gameProperties.revertScaleRatio(5) * 5;
        }
        this.spacer = gameProperties.tileHeight *gameProperties.scaleRatio;
        
    },

	preload: function () {
        game.load.image('wg1', "/static/wsAssets/buttons/wgame1.png");
        game.load.image('wg2', "/static/wsAssets/buttons/wgame2.png");
        game.load.image('wg3', "/static/wsAssets/buttons/wgame3.png");
        game.load.image('wg4', "/static/wsAssets/buttons/wgame4.png");
        game.load.image('wg5', "/static/wsAssets/buttons/wgame5.png");
        game.load.image('wg6', "/static/wsAssets/buttons/wgame6.png");
        game.load.image('wg7', "/static/wsAssets/buttons/wgame7.png");
        game.load.image('wg8', "/static/wsAssets/buttons/wgame8.png");
        game.load.image('wg9', "/static/wsAssets/buttons/wgame9.png");
        game.load.image('wg10', "/static/wsAssets/buttons/wgame10.png");
        game.load.image('wg11', "/static/wsAssets/buttons/wgame11.png");
        game.load.image('wg12', "/static/wsAssets/buttons/wgame12.png");
        game.load.image('wg13', "/static/wsAssets/buttons/wgame13.png");
        game.load.image('wg14', "/static/wsAssets/buttons/wgame14.png");
        game.load.image('wg15', "/static/wsAssets/buttons/wgame15.png");
        game.load.image('sessionComplete', "/static/wsAssets/buttons/wsessionComplete.png");
        
    },

	create: function() {
		this.game.stage.backgroundColor = '#fff';

		var bar = game.add.graphics();
		bar.beginFill(0x8400b2, 1);
		bar.drawRect(0,0,gameProperties.screenWidth, 50);

		var start= 0;
		var end = 0;
		var max = 0;
		
		//console.log(events.length);
		//this.game.add.text(this.menuLeft,this.menuTop + this.spacer, events.length + ' events were captured', headingStyle);
		var types = [0,0,0, 0, 0];
		var sumTime = 0
		var sumScore = 0;
		var x = 0;
		var y = 0;
		var longest = 0;
		var buttonString = "";

		if (gameProperties.attempt <= 14){
			buttonString = "wg" + (gameProperties.attempt + 1);
		}
		else {
			buttonString = "sessionComplete";
		}

		buttonStartNext = this.game.add.button(this.menuLeft*.80, gameProperties.screenHeight * 0.5, buttonString, this.startGame, this);
		if(gameProperties.attempt != 0){
			for (var i = 0; i < events.length; i ++) {
			//console.log(events[i].aTime);
				if (events[i].aScore){
					end = events[i].aTime;
					var temp = end - start;
					if (temp > max){
						max = temp;
					}
					start = events[i].aTime;
				}
			//console.log(events[i].aScore);
				sumScore = sumScore + events[i].aScore;
				x = x + events[i].tile.column;
				y = y + events[i].tile.row;
				if (i > 1){
					var temp = events[i].aTime - events[i -1].aTime;
					sumTime = sumTime + temp;
					if (temp > longest){
						longest = temp;
					}
				} else {
					sumTime = events[i].aTime;
					longest = events[i].aTime;
				}
				if (events[i].aType == 'NONE'){
					types[0] = types[0] + 1;
				} else if (events[i].aType == 'SELECTION'){
					types[1] = types[1] + 1;
				} else if (events[i].aType == 'DESELECTION'){
					types[2] = types[2] + 1;
				} else if (events[i].aType == 'SWAP'){
					types[3] = types[3] + 1;
				} else {
					types[4] = types[4] + 1;
				}
			}
			var textString = "Congratulations you found "+ sumScore + " words!";
			if (gameProperties.attempt > 14){ 
				textString = "Congratulations you found "+ sumScore + " words! Session Complete!";
			}
			var total_score = this.game.add.text(this.menuLeft * 0.8,this.menuTop + this.spacer * 3, textString, resultStyle);
		
			var averageTime = sumTime/events.length;
			var maximum = Math.round(max * 100)/100;
			var quad = " ";
			if (x/events.length > 3.01){
				if (y/events.length > 3.01){
					quad = "SE";
				} else {
					quad = "NE";
				}
			} else {
				if(y/events.length > 3.01){
					quad = "SW";
				} else{
					quad = "NW"
				}
			};
			if (researcher != "quicktest"){
				postData(averageTime, maximum, quad, longest, this.levelData);
			}
		}
	},

	startGame: function() {
		events = [];
		gameProperties.upAttempt();

		if (gameProperties.attempt > 15){
			window.location.href = "http://162.246.156.143/wordsearch_index";
		} else {
			this.game.state.start('game');
		}
	},

	reStartGame: function() {
		console.log(gameProperties.level);
		console.log(gameProperties.prev);
		gameProperties.setLevel(gameProperties.prev);
		console.log(gameProperties.level);
		events = [];
		this.game.state.start('game');
	},

	exitGame: function() {
		
	}
});

var eventList = function() {
	var ans = [];
	var obj = "";
	for(var i = 0; i < events.length; i ++) {
		try {
			obj = {
					 "timestamp":events[i].aTime,
					 "x":events[i].tile.column.toString(),
					 "y":events[i].tile.row.toString(),
					 "type":events[i].aType,
					 "score":events[i].aScore
			};

		} catch (err){
			obj = {
				"timestamp":events[i].aTime,
				"x":"combo",
				"y":"combo",
				"type": "combo",
				"score":events[i].aScore
			};
		}
		ans.push(obj);
	}
	return ans;
}

var postData = function(averageTime, maximum, quad, longest, levelData) {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	var HH = today.getHours();
	var MM = today.getMinutes();
	var ss = today.getSeconds();

	if(dd<10) {	
    	dd='0'+dd;
	} 

	if(mm<10) {
    	mm='0'+mm;
	}
	if (HH<10){
		HH = '0' + HH;
	}
	if (MM<10){
		MM = '0' + MM;
	}
	if (ss<10){
		ss = '0' + ss;
	}

	today = yyyy+"-"+mm+"-"+dd +" " +HH+ ":" + MM + ":" + ss;
	//console.log("cookie equals" + c);
	var elist = eventList();
	var xhr = new XMLHttpRequest();
	var url = "/api/v1/create_wordsearch_session";
	xhr.open("POST", url, true);
	xhr.withCredentials = "true";
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Accept", "application/json");
	xhr.send(JSON.stringify({
		"app": "wordsearch",
		"r_id": researcher,
		"user_id": user, 
		"session_date": today,
		"attempt": gameProperties.attempt,
		"level": gameProperties.prev,
		"version": gameProperties.vers,
		"rows": levelData.row,
		"words": levelData.words,
		"latency_average": averageTime,
		"longest_word": maximum,
		"score_zone": quad,
		"longest_pause": longest,	
		"events": elist
	}));
	
};
