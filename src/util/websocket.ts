import { Client } from "@cryb/mesa";
import ora from "ora"

export default class Websocket extends Client {

    public isConnected: boolean = false

    public constructor() {
        super("wss://api.ghidorah.uk", {
            autoConnect: true
        });

        process.on('uncaughtException', () => { })
        process.on('unhandledRejection', () => { })

        this.on("connected", () => {
            this.isConnected = true;
            this.on("disconnected", () => {
                this.isConnected = false
            })
        });

        this.on("error", (error) => {
            ora("Error occurred : " + error.message).fail()
            process.exit(0)
        })
    }
}