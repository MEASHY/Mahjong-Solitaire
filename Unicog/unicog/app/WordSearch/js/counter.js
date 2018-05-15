var Counter = function (x, y , defaultValue) {

    this.currentValue = 0;
    var tf_counter = scene.add.text(x, y, "Words Left : " + defaultValue, fontStyles.counterFontStyle);
    //tf_counter.anchor.set(1, 0.5);
    
    this.update = function ( value ){
        tf_counter.text = "Words Left: " + (value);
        this.currentValue = this.currentValue + 1;
    }
    
    this.getScore = function() {
    	return this.currentValue;
    }
    
    this.repositionCounter = function () {
        tf_counter.setX(gameProperties.leftOffset)
        tf_counter.setY(gameProperties.topOffset-20)
    }
}