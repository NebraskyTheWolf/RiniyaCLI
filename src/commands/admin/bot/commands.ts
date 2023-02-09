import * as rm from "typed-rest-client/RestClient"
import BaseCommand, { RestResult } from '../../BaseCommand';
import { Table } from "console-table-printer"

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
        const table: Table = new Table({
            title: "Commands list",
            columns: [
                { name: 'name', alignment: 'center', color: 'red' },
                { name: 'description', alignment: 'center', color: 'blue' },
                { name: 'category', alignment: 'center', color: 'magenta' }
            ]
        })

        const session: rm.IRestResponse<RestResult<Data[]>> = await this.restClient.get<RestResult<Data[]>>(`/api/commands`);
        if (session.result?.status) {
            spinner.succeed("The datatable is loaded.")

            session.result.data?.map(x => {
                table.addRow({ name: x.name, description: x.description, category: x.category }, { color: 'red' });
            })

            table.printTable()
            this.exit(0);
        } else {
            spinner.fail("The request has been aborted.")
            this.exit(0)
        }
    }
}