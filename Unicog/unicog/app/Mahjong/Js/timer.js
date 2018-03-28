/** Class representing a Timer. */
class Timer {
    /**
     * Create a TileNode
     * @param {number} duration - Timer duration (seconds).
     */
    constructor (duration) {
        this.paused = false
        this.duration = duration
        this.timeLeft = duration
        this.board = null
        
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
            timer.timeLeft -= amount
            //console.log(timer.timeLeft)
            if (timer.timeLeft <= 0) {
                timer.endTimer()
            }
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
    pauseTimer () {
        this.paused = true
    }
    /**
     * resumes the Timer
     */
    resumeTimer () {
        this.paused = false
    }
    /**
     * a function of duration - time left
     * @return {number} time elapsed (seconds)
     */
    timeElapsed () {
        return this.duration - this.timeLeft
    }
    getJustMinutesLeft () {
        return Math.floor(this.timeLeft / 60)
    }
    getJustSecondsLeft () {
        return this.timeLeft % 60
    }
    /**
     * when the timer runs down to 0 trigger and of session
     */
    endTimer () {
        this.board.scoreScreen(true)
    }
}