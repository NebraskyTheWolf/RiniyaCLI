import Command from "@oclif/command";
import Websocket from "../util/websocket"
import * as rm from "typed-rest-client/RestClient"
import { existsSync, readFileSync } from "fs";

import ora from "ora"
import { Message } from "@cryb/mesa";

export declare type RestVersion = {
    appVersion: number;
}

export declare type RestResult<T> = {
    status: boolean;
    data?: T
    error?: string;
}

export declare type Credentials = {
    accessToken: string
    clientToken: string;
}

export default abstract class BaseCommand extends Command {
    protected websocket: Websocket = new Websocket()
    protected restClient: rm.RestClient = new rm.RestClient("riniya-cli", "https://api.ghidorah.uk")

    protected authenticate(): Credentials {
        if (existsSync("./session.json")) {
            const json: Credentials = JSON.parse(readFileSync('./session.json', {
                encoding: "utf8"
            }))
            return {
                accessToken: json.accessToken,
                clientToken: json.clientToken
            }
        } else {
            ora("You need to login first!").fail()
            process.exit(5)
        }
    }
}