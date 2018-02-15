var Timer = function (x, y) {

    this.onTimeUp = new Phaser.Signal();
    var count = 60;
    var tf_counter = game.add.text(x, y, "Time: " +count, fontStyles.counterFontStyle);
    tf_counter.anchor.set(0, 0.5);
    
    var timer = game.time.events;
    
    this.start = function () {
        timer.loop(1000, update, this);
        timer.start();
    };
    
    this.stop = function () {
        timer.stop();
    };
    
    var update = function () {
        count -- ;
        tf_counter.text = "Time: " +  count;
        if (!count){
            this.onTimeUp.dispatch();
        }
    };

    this.getTime = function () {
        return count;
    };
}
