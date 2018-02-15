var stats = function (game){
	this.menuTop;
	this.menuLeft;
	this.menuCenter;
	this.menuRight;
	this.spacer;
};

var resultStyle = {font: "bold 30px Arial", fill: "#000"};
var headingStyle = {font: " 24px Arial", fill: "#000"};
var itemStyle = {font: " 18px Arial", fill: "#000"};
var c = document.cookie;
var newEventList = [];
//console.log('<?php echo $
stats.prototype = {

	init: function() {
		this.menuTop = (gameProperties.screenHeight - (gameProperties.tileHeight * gameProperties.scaleRatio * gameProperties.boardHeight)) * 0.5;
        this.menuLeft = gameProperties.screenWidth  * 0.25;
        this.menuRight = gameProperties.screenWidth * 0.75;
        this.menuCenter = gameProperties.screenWidth * 0.5;
        this.spacer = gameProperties.tileHeight * gameProperties.scaleRatio;

	},

	preload: function () {
        game.load.image('bg1', "/static/bAssets/bgame1.png");
        game.load.image('bg2', "/static/bAssets/bgame2.png");
        game.load.image('bg3', "/static/bAssets/bgame3.png");
        game.load.image('bg4', "/static/bAssets/bgame4.png");
        game.load.image('bg5', "/static/bAssets/bgame5.png");
        game.load.image('bg6', "/static/bAssets/bgame6.png");
        game.load.image('bg7', "/static/bAssets/bgame7.png");
        game.load.image('bg8', "/static/bAssets/bgame8.png");
        game.load.image('bg9', "/static/bAssets/bgame9.png");
        game.load.image('bg10', "/static/bAssets/bgame10.png");
        game.load.image('bg11', "/static/bAssets/bgame11.png");
        game.load.image('bg12', "/static/bAssets/bgame12.png");
        game.load.image('bg13', "/static/bAssets/bgame13.png");
        game.load.image('bg14', "/static/bAssets/bgame14.png");
        game.load.image('bg15', "/static/bAssets/bgame15.png");
        game.load.image('sessionComplete', "/static/bAssets/bsessionComplete.png");
        
    },

	create: function() {
		this.game.stage.backgroundColor = '#fff';

		var bar = game.add.graphics();
		bar.beginFill(0xf1800e, 1);
		bar.drawRect(0,0,gameProperties.screenWidth, 50);
		
		//console.log(events.length);
		//this.game.add.text(this.menuLeft,this.menuTop + this.spacer* 2.5, events.length + ' events were captured', headingStyle);
		var types = [0,0,0, 0, 0];
		var sumTime = 0
		var sumScore = 0;
		var x = 0;
		var y = 0;
		var longest = 0;
		//console.log("length of event list is "+events.length)

		if (gameProperties.attempt <= 14){
			buttonString = "bg" + (gameProperties.attempt + 1);
		}
		else {
			buttonString = "sessionComplete";
		}
		buttonStartNext = this.game.add.button(this.menuLeft*.80, gameProperties.screenHeight * 0.5, buttonString, this.startGame, this);
		if(gameProperties.attempt != 0){
			newEventList.push(events[0]);
			for (var i = 1; i < events.length; i ++) {
				if (events[i].aTime != events[i-1].aTime){
					newEventList.push(events[i]);
				}
			}
			for (var i = 0; i < newEventList.length; i ++) {
				try{
					sumScore = sumScore + newEventList[i].aScore;
					x = x + newEventList[i].tile.column;
					y = y + newEventList[i].tile.row;
				} catch(err){
					//dont need to do anything
				}
				if (i > 1){
					var temp = newEventList[i].aTime - newEventList[i -1].aTime;
					sumTime = sumTime + temp;
					if (temp > longest){
						longest = temp;
					}
				} else {
					try{
						sumTime = newEventList[i].aTime;
						longest = newEventList[i].aTime;
					} catch(err) {
						//
					}
				}
				try{
				if (newEventList[i].aType == 'NONE'){
					types[0] = types[0] + 1;
				} else if (newEventList[i].aType == 'SELECTION'){
					types[1] = types[1] + 1;
				} else if (newEventList[i].aType == 'DESELECTION'){
					types[2] = types[2] + 1;
				} else if (newEventList[i].aType == 'SWAP'){
					types[3] = types[3] + 1;
				} else {
					types[4] = types[4] + 1;
				}
				}catch (err) {
					
				}
			}

			var textString = "Congratulations you got "+sumScore+ " points!";
			if (gameProperties.attempt > 14){ 
				textString = "Congratulations you got "+sumScore+ " points! Session Complete!";
			}
			var total_score = this.game.add.text(this.menuLeft * 0.8,this.menuTop + this.spacer * 3, textString, resultStyle);
		
			var averageTime = sumTime/newEventList.length;
			var quad = " ";
			if (x/newEventList.length > 3.01){
				if (y/newEventList.length > 3.01){
					quad = "SE";
				} else {
					quad = "NE";
				}
			} else {
				if(y/newEventList.length > 3.01){
					quad = "SW";
				} else{
					quad = "NW"
				}
			};
			if (researcher != "quicktest"){
				postData(sumScore, quad, averageTime);
			}
		}
		
	},

	startGame: function(){

		events = [];
		newEventList = [];
		//console.log(gameProperties.attempt + " this is before updating");
		gameProperties.upAttempt();
		//console.log(gameProperties.attempt + "this is after updating");
		if (gameProperties.attempt > 15){
		 	window.location.href = "http://162.246.156.143/bejeweled_index";
        } else {
			this.game.state.start('game');
		}
	},

	exitGame: function() {
		//
	}
}

var eventList = function() {
	var ans = [];
	var obj = "";
	for(var i = 0; i < newEventList.length; i ++) {
		try{
			obj = {
					"timestamp":newEventList[i].aTime,
					"x":newEventList[i].tile.column.toString(),
					"y":newEventList[i].tile.row.toString(),
					"type":newEventList[i].aType,
					"score": newEventList[i].aScore
			};
		} catch(err) {
			obj = {
				"timestamp":newEventList[i].aTime,
				"x":"combo",
				"y":"combo",
				"type":"combo",
				"score":newEventList[i].aScore
			};
		}
		ans.push(obj);
	}
	return ans;
}


var postData = function(sumScore, quad, averageTime) {
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
	var elist = eventList();
	var xhr = new XMLHttpRequest();
	var url = "/api/v1/create_bejeweled_session";
	xhr.open("POST", url, true);
	//xhr.setDisableHeaderCheck(true);
	xhr.withCredentials = "true";
	//sessionStorage.setItem("session_id","a5eb510f515588e726de1b06c50407b76b228162");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Accept", "application/json");
	//console.log("level " + gameProperties.prev);
	//console.log("target "+gameProperties.prevTarget);
	//console.log("tile types "+ gameProperties.prevTile);
	xhr.send(JSON.stringify({
		"app": "bejeweled",
		"r_id": researcher,
		"user_id": user, 
		"session_date": today,
		"attempt": gameProperties.attempt,
		"level": gameProperties.prev,
		"target_score": gameProperties.prevTarget,
		"tile_types": gameProperties.prevTile,
		"score_total": sumScore,
		"score_zone": quad,
		"latency_average": averageTime,
		"events": elist
	}));
	
}
