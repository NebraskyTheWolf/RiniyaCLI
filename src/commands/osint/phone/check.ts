import prompts from 'prompts';
import * as rm from "typed-rest-client/RestClient"
import BaseCommand, { Credentials, RestResult } from '../../BaseCommand';

import ora from "ora"

export declare type Data = {}



export default class PhoneCheck extends BaseCommand {
    static description: "Gather information from a phone number"

    async run() {
        const user: Credentials = this.authenticate();

        let phone = await prompts({
            name: 'Phone',
            type: "text",
            message: "Phone number"
        });

        var spinner = ora("Contacting RiniyaAPI.").start()

        const session: rm.IRestResponse<RestResult<Data>> = await this.restClient.get<RestResult<Data>>(`/api/osint/phone/${phone.Phone}`, {
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