import prompts from 'prompts';
import * as rm from "typed-rest-client/RestClient"
import BaseCommand, { RestResult } from '../../BaseCommand';

import ora from "ora"

export declare type Data = {
    name: string;
    description: string;
    category: string;
}

export default class FetchCommands extends BaseCommand {
    static description: "Fetch all commands."

    async run() {
        var spinner = ora("Contacting RiniyaAPI.").start()

        const session: rm.IRestResponse<RestResult<Data[]>> = await this.restClient.get<RestResult<Data[]>>(`/api/commands`);
        if (session.result?.status) {
            const command = session.result.data?.map(x => {
                return {
                    title: x.name,
                    description: x.description,
                    value: x.category
                }
            })
            await prompts({
                name: 'Commands',
                type: "select",
                choices: command,
                message: "Commands"
            });
        } else {
            spinner.fail("The request has been aborted.")
            this.exit(0)
        }
    }
}