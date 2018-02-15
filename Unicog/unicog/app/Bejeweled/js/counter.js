var Counter = function (x, y , defaultValue) {

    this.goalAchieved = new Phaser.Signal();
    this.currentValue = defaultValue;
    this.targetValue = gameProperties.targetScore
    var tf_counter = game.add.text(x, y, "Score : " + defaultValue + " target :" + this.targetValue, fontStyles.counterFontStyle);
    tf_counter.anchor.set(1, 0.5);
    this.goalmet = 0;
    
    this.update = function ( value ){
        tf_counter.text = "Score: " + (this.currentValue + value) + " target :" +this.targetValue;
        this.currentValue = this.currentValue + value;
    }

    this.check = function (){
        if (this.currentValue > this.targetValue && this.goalmet == 0) {
            this.goalment = 1;
            this.goalAchieved.dispatch();
        }
    }

    this.getScore = function() {
    	return this.currentValue;
    }
}