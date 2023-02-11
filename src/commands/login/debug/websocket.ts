import BaseCommand from '../../BaseCommand';

export declare type Session = {
    message: string
}

export default class DebugSocket extends BaseCommand {
    static description: "Invalidate a session."

    private timer = 0

    async run() {
        this.spinner.setSpinner("dots").start()
        process.env['WEBSOCKET_DEBUG'] = "true"
        
        var interval = setInterval(() => {
            this.timer = this.timer + 1
            this.spinner.setText("Connected since " + this.timer + "s")
            if (this.timer >= 300) {
                this.spinner.fetch().stopAndPersist({
                    text: "The websocket connection has been timed out for innactivity"
                })
                clearInterval(interval)
            }
        }, 1000)
        this.exit(0)
    }
}