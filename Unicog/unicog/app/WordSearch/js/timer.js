/** Class representing a Timer. */
class Timer {
    /**
     * Create a timed event
     * @param {number} x - The x coordinate of the timer
     * @param {number} y - The y coordinate of the timer
     */
    constructor (x,y) {
        this.paused = true
        this.time = 0
        this.counterText = scene.add.text(x, y, "Time: " +this.time, fontStyles.counterFontStyle);
        console.log(this.counterText)
    
        // tickAmount is, in seconds, how often the timer should update
        var tickAmount = 1
        setInterval(this.runTimer, tickAmount*1000, this, tickAmount)
    }
    /**
     * Callback for the Timer which decrements the time left by a given amount
     * @param {context} timer - A Timer
     * @param {number} amount - The amount to decrement the time left by
     */
    runTimer ( timer, amount ) {
        if (timer.isTimerRunning()) {
            timer.time += amount
            timer.counterText.setText("Time: " +timer.time)
            //console.log(timer.time)
        }
    }
    /**
     * Checks if the Timer is currently running 
     * @return {boolean} !paused
     */
    isTimerRunning () {
        return !this.paused
    }
    /**
     * pauses the Timer
     */
    pause () {
        this.paused = true
    }
    /**
     * resumes the Timer
     */
    resume () {
        this.paused = false
    }
    /**
     * starts the Timer
     */
    start () {
        this.paused = false
    }
    /**
     * a function of duration - time left
     * @return {number} time elapsed (seconds)
     */
    timeElapsed () {
        return this.time
    }
    /**
     * The number of minutes elapsed rounded down
     * @return {number} time elapsed (seconds)
     */
    getJustMinutes () {
        return Math.floor(this.time / 60)
    }
    /**
     * The number of seconds elapsed rounded down
     * @return {number} time elapsed (seconds)
     */
    getJustSeconds () {
        return this.time % 60
    }
    /**
     * Reposition the timer to itrs correct position
     */
    repositionTimer () {
        this.counterText.setX(gameProperties.leftOffset)
        this.counterText.setY(gameProperties.topOffset-21)
    }

}
