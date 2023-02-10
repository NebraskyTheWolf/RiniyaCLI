import Command from "@oclif/command";
import Websocket from "../util/websocket"
import { RestClient, IRestResponse, IRequestOptions } from "typed-rest-client/RestClient"
import { existsSync, readFileSync, writeFileSync } from "fs";
import { Table } from "console-table-printer"

import ora, { Ora } from "ora"
import SpinnerBuilder from "../util/SpinnerBuilder";
import { Message } from "@cryb/mesa";

export declare type PacketAction = "AUTHENTICATION" | "LOGIN" | "DISCONNECT" | "DEBUG" | "PAYLOAD"

export declare type APIInfo = {
    appName: string;
    appVersion: number;
    appAuthors: string[];
}

export declare type RestResult<T> = {
    status: boolean;
    data?: T
    error?: string;
}

export declare type Login = {
    accessToken: string;
    clientToken: string;
    sessionExpiry: number;
}

export declare type Response<T> = {
    request: IRestResponse<RestResult<T>>;
    spinner: Ora;
    websocket: Websocket;
}

export default abstract class BaseCommand extends Command {
    private readonly websocket: Websocket = new Websocket()
    private readonly restClient: RestClient = new RestClient("riniya-cli", "https://api.ghidorah.uk")

    protected fetchSession(): Login {
        if (existsSync("./session.json")) {
            const json: Login = JSON.parse(readFileSync('./session.json', {
                encoding: "utf8"
            }))
            return {
                accessToken: json.accessToken,
                clientToken: json.clientToken,
                sessionExpiry: json.sessionExpiry
            }
        } else {
            ora("You need to login first!").fail()
            process.exit(5)
        }
    }

    protected makeTable(data: any): Table {
        return new Table(data)
    }

    protected async sendPacket(data: any, action: PacketAction): Promise<number> {
        return this.websocket.send(new Message(0, data, action))
    }

    protected async save(name: string, data: any): Promise<void> {
        return writeFileSync(name + ".json", JSON.stringify(data))
    }

    protected async get<T>(route: string): Promise<{
        response: Response<T>
    }> {
        const user: Login = this.fetchSession()
        return {
            response: await this.sendRequest<T>(route, {
                additionalHeaders: {
                    "X-API-SCOPE": "identify",
                    "accessToken": user.accessToken,
                    "clientToken": user.clientToken
                }
            })
        }
    }

    protected async login(username: string, password: string): Promise<{
        response: Response<Login>
    }> {
        return {
            response: await this.sendRequest<Login>('/api', {
                additionalHeaders: {
                    "X-API-SCOPE": "login",
                    "X-API-USERNAME": username,
                    "X-API-PASSWORD": password
                }
            })
        }
    }

    protected async ping(): Promise<{
        response: Response<APIInfo>
    }> {
        return {
            response: await this.sendRequest<APIInfo>('/', {})
        }
    }

    private async sendRequest<T>(route: string, options: IRequestOptions): Promise<{
        request: IRestResponse<RestResult<T>>
        spinner: Ora
        websocket: Websocket
    }> {
        return {
            request: await this.restClient.get<RestResult<T>>(route, options),
            spinner: new SpinnerBuilder("Connecting to RiniyaAPI.")
                .setColor("blue")
                .setSpinner("dots")
                .fetch(),
            websocket: this.websocket
        }
    }
}