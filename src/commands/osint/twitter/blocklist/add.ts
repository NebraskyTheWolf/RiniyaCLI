import prompts from 'prompts';
import * as rm from "typed-rest-client/RestClient"
import BaseCommand, { Credentials, RestResult } from '../../../BaseCommand';

import ora from "ora"

export declare type Data = {}

export default class AddBlocked extends BaseCommand {
    static description: "Add blocked user in the block-list."

    async run() {
        const user: Credentials = this.authenticate();

        let accountId = await prompts({
            name: 'accountId',
            type: "text",
            message: "Account id"
        });

        var spinner = ora("Contacting RiniyaAPI.").start()

        const session: rm.IRestResponse<RestResult<Data>> = await this.restClient.get<RestResult<Data>>(`/api/block-list/create/${accountId.accountId}`, {
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