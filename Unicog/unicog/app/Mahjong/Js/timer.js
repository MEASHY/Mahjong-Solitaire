class Timer {
    constructor (duration) {
        var paused = false
        var duration = duration
        
        var tickAmount = 1
        setInterval(this.runTimer, tickAmount*1000, this, tickAmount)
    }
    
    runTimer ( scope, amount ) {
        if (scope.isTimerRunning()) {
            scope.duration -= amount
            console.log(scope.duration)
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