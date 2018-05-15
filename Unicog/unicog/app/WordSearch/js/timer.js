var Timer = function (x, y) {

    this.onTimeUp = new Phaser.EventEmitter();
    var count = 60;
    var tf_counter = scene.add.text(x, y, "Time: " +count, fontStyles.counterFontStyle);
    
    var timer = scene.time.addEvent();
    
    this.start = function () {
        var timer = scene.time.addEvent({delay: 1000, callback:update, callbackScope: this, loop: true});
        //timer.start();
    };
    
    this.stop = function () {
        timer.stop();
    };
    
    var update = function () {
        count -- ;
        tf_counter.text = "Time: " +  count;
        if (!count){
            this.onTimeUp.emit();
        }
    };

    this.getTime = function () {
        return count;
    };
    
    this.repositionTimer = function () {
        tf_counter.setX(gameProperties.leftOffset)
        tf_counter.setY(gameProperties.topOffset-20)
    }
}
