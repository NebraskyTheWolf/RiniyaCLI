import prompts from 'prompts';
import * as rm from "typed-rest-client/RestClient"
import BaseCommand, { Credentials, RestResult } from '../../BaseCommand';

import ora from "ora"

export declare type Data = {}

export default class GhuntOsint extends BaseCommand {
    static description: "Gather information from a gmail address."

    async run() {
        const user: Credentials = this.authenticate();

        let type = await prompts({
            name: 'Action',
            type: "select",
            choices: [
                {
                    title: "Email",
                    description: "Fetch all information from a email.",
                    value: "email"
                },
                {
                    title: "Gaia ID",
                    description: "Get informations from a Gaia ID",
                    value: "gaia",
                    disabled: true
                },
                {
                    title: "Drive",
                    description: "Get data from a drive / files",
                    value: "drive",
                    disabled: true
                }
            ],
            message: "Type"
        });

        let email = await prompts({
            name: 'Email',
            type: "text",
            message: "Email"
        });

        var spinner = ora("Contacting RiniyaAPI.").start()

        const session: rm.IRestResponse<RestResult<Data>> = await this.restClient.get<RestResult<Data>>(`/api/osint/ghunt/${type.Action}/${email.Email}`, {
            additionalHeaders: {
                "X-API-SCOPE": "identify",
                "accessToken": user.accessToken,
                "clientToken": user.clientToken
            }
        });
        if (session.result?.status) {
            this.exit(0)
        } else {
            spinner.fail("The request has been aborted.")
            this.exit(0)
        }
    }
}