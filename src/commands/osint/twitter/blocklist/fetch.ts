import prompts from 'prompts';
import * as rm from "typed-rest-client/RestClient"
import BaseCommand, { Credentials, RestResult } from '../../../BaseCommand';

import ora from "ora"
import { Table } from 'console-table-printer';

export declare type Account = {
    created_at?: string;
    location?: string;
    name: string;
    protected?: boolean;
    username: string;
}

export default class FetchBackend extends BaseCommand {
    static description: "Fetch account by id on twitter."

    async run() {
        const user: Credentials = this.authenticate();

        let accountId = await prompts({
            name: 'accountId',
            type: "text",
            message: "Account id"
        });

        var spinner = ora("Contacting RiniyaAPI.").start()

        const table: Table = new Table({
            title: "Twitter Account",
            columns: [
                { name: 'created_at', alignment: 'center', color: 'red' },
                { name: 'name', alignment: 'center', color: 'red' },
                { name: 'username', alignment: 'center', color: 'red' },
                { name: 'location', alignment: 'center', color: 'red' },
                { name: 'protected', alignment: 'center', color: 'red' },
            ]
        })

        const session: rm.IRestResponse<RestResult<Account>> = await this.restClient.get<RestResult<Account>>(`/block-list/fetch/${accountId.accountId}`, {
            additionalHeaders: {
                "X-API-SCOPE": "identify",
                "accessToken": user.accessToken,
                "clientToken": user.clientToken
            }
        });
        if (session.result?.status) {
            const account = session.result.data;
            spinner.succeed("The datatable is loaded.")
            
            table.addRow({
                created_at: account?.created_at,
                name: account?.name,
                username: account?.username,
                location: account?.location,
                protected: account?.protected
            })
            this.exit(0)
        } else {
            spinner.fail("The request has been aborted.")
            this.exit(0)
        }
    }
}