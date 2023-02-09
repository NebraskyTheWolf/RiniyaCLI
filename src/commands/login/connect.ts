import prompts from 'prompts';
import * as rm from "typed-rest-client/RestClient"
import BaseCommand, { RestResult } from '../BaseCommand';

import { writeFileSync } from 'fs';

import ora from "ora"
import { Message } from '@cryb/mesa';

export declare type Data = {
    accessToken: string;
    clientToken: string;
    sessionExpiry: number;
}

export default class LoginSession extends BaseCommand {
    static description: "Login to a session."

    async run() {
        let username = await prompts({
            name: 'Username',
            type: "text",
            message: "Username"
        });

        let password = await prompts({
            name: 'Password',
            type: "password",
            message: "Password"
        });

        var spinner = ora("Contacting RiniyaAPI.").start()

        const session: rm.IRestResponse<RestResult<Data>> = await this.restClient.get<RestResult<Data>>('/api', {
            additionalHeaders: {
                "X-API-SCOPE": "login",
                "X-API-USERNAME": username.Username,
                "X-API-PASSWORD": password.Password
            }
        });
        if (session.result?.status) {
            writeFileSync('session.json', JSON.stringify({
                accessToken: session.result.data?.accessToken,
                clientToken: session.result.data?.clientToken
            }))
            this.websocket.send(new Message(0, {
                status: true,
                username: username
            }, "AUTHENTICATION"))
            spinner.succeed("You are now logged.")
            this.exit(0)
        } else {
            this.websocket.send(new Message(0, {
                status: false,
                username: username
            }, "AUTHENTICATION"))
            spinner.fail("The username or password is invalid.")
            this.exit(0)
        }
    }
}