import BaseCommand from '../../BaseCommand';

export declare type Command = {
    name: string;
    description: string;
    category: string;
}

export default class FetchCommands extends BaseCommand {
    static description: "Fetch all commands."

    async run() {
        const table = this.makeTable({
            title: "Commands list",
            columns: [
                { name: 'name', alignment: 'center', color: 'red' },
                { name: 'description', alignment: 'center', color: 'blue' },
                { name: 'category', alignment: 'center', color: 'magenta' }
            ]
        })

        await this.get<Command[]>('/api/commands').then(result => {
            if (result.response.request.result?.status) {
                result.response.request.result.data?.map(x =>
                    table.addRow({
                        name: x.name,
                        description: x.description,
                        category: x.category
                    }, { color: 'red' })
                )
                result.response.spinner.succeed("The datatable is loaded.")
                table.printTable()
                this.exit(0);
            } else {
                this.error("The request has been aborted.")
            }
        })
    }
}