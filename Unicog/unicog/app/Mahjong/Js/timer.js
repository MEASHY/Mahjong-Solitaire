class Timer {
    constructor (duration) {
        this.paused = false
        this.duration = duration
        
        // tickAmount is, in seconds, how often the timer should update
        var tickAmount = 1
        setInterval(this.runTimer, tickAmount*1000, this, tickAmount)
    }
    
    runTimer ( scope, amount ) {
        if (scope.isTimerRunning()) {
            scope.duration -= amount
            if (scope.duration <= 0) {
                scope.endTimer()
            }
        }
    }
    
    isTimerRunning () {
        return !this.paused
    }

    pauseTimer () {
        this.paused = true
    }

    resumeTimer () {
        this.paused = false
    }

    endTimer () {
        // TODO
        // Do some sort of end screen
        // Take them back to player login?
    }
}