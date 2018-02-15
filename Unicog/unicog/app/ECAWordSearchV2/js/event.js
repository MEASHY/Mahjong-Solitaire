Event = function (tile, time){
	this.tile = tile;
	this.aType = "NONE";
	this.aScore = 0;
	this.aTime = time;

	this.setAType = function(type){
		this.aType = type;
	};

	this.setAScore = function(score){
		this.aScore = score;
	};

	this.setATime = function(time){
		this.aTime = time;
	};

}