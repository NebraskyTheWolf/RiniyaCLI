import Command from "@oclif/command";
import { RestClient, IRestResponse, IRequestOptions } from "typed-rest-client/RestClient"
import { existsSync, readFileSync } from "fs";
import ora, { Ora } from "ora"
import SpinnerBuilder from "../util/SpinnerBuilder";

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
}

export declare type PostResponse = {
    status: boolean;
    message?: string;
    error?: string;
}

export default abstract class Base extends Command {
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

    private async sendRequest<T>(route: string, options: IRequestOptions): Promise<{
        request: IRestResponse<RestResult<T>>
        spinner: Ora
    }> {
        return {
            request: await this.restClient.get<RestResult<T>>(route, options),
            spinner: new SpinnerBuilder("Connecting to RiniyaAPI.")
                .setColor("blue")
                .setSpinner("dots")
                .fetch(),
        }
    }

    protected async post<T>(route: string, data: any): Promise<RestResult<T>> {
        const user: Login = this.fetchSession()
        const response = await this.restClient.client.post("https://api.ghidorah.uk" + route, JSON.stringify(data), {
            "X-API-SCOPE": "identify",
            "accessToken": user.accessToken,
            "clientToken": user.clientToken
        })

        const result: RestResult<T> = JSON.parse(await response.readBody())
        return {
            status: result.status,
            data: result.data,
            error: result.error
        }
    }

    protected async patch<T>(route: string, data: any): Promise<RestResult<T>> {
        const user: Login = this.fetchSession()
        const response = await this.restClient.client.patch(route, JSON.stringify(data), {
            "X-API-SCOPE": "identify",
            "accessToken": user.accessToken,
            "clientToken": user.clientToken
        })
        const result: RestResult<T> = JSON.parse(await response.readBody())
        return {
            status: result.status,
            data: result.data,
            error: result.error
        }
    }

    protected async put<T>(route: string, data: any): Promise<RestResult<T>> {
        const user: Login = this.fetchSession()
        const response = await this.restClient.client.put(route, JSON.stringify(data), {
            "X-API-SCOPE": "identify",
            "accessToken": user.accessToken,
            "clientToken": user.clientToken
        })
        const result: RestResult<T> = JSON.parse(await response.readBody())
        return {
            status: result.status,
            data: result.data,
            error: result.error
        }
    }

    protected async head<T>(route: string, data: any): Promise<RestResult<T>> {
        const user: Login = this.fetchSession()
        const response = await this.restClient.client.head(route, {
            "X-API-SCOPE": "identify",
            "accessToken": user.accessToken,
            "clientToken": user.clientToken
        })
        const result: RestResult<T> = JSON.parse(await response.readBody())
        return {
            status: result.status,
            data: result.data,
            error: result.error
        }
    }

    protected async options<T>(route: string): Promise<RestResult<T>> {
        const user: Login = this.fetchSession()
        const response = await this.restClient.client.options(route, {
            "X-API-SCOPE": "identify",
            "accessToken": user.accessToken,
            "clientToken": user.clientToken
        })
        const result: RestResult<T> = JSON.parse(await response.readBody())
        return {
            status: result.status,
            data: result.data,
            error: result.error
        }
    }
}