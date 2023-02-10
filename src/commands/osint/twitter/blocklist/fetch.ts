import prompts from 'prompts';
import * as rm from "typed-rest-client/RestClient"
import BaseCommand from '../../../BaseCommand';

declare type TwitterAccount = {
    created_at?: string;
    location?: string;
    name: string;
    protected?: boolean;
    username: string;
}

export default class FetchBackend extends BaseCommand {
    static description: "Fetch account by id on twitter."

    async run() {
        let accountId = await prompts({
            name: 'accountId',
            type: "text",
            message: "Account id"
        });

        const table = this.makeTable({
            title: "Twitter Account",
            columns: [
                { name: 'created_at', alignment: 'center', color: 'red' },
                { name: 'name', alignment: 'center', color: 'red' },
                { name: 'username', alignment: 'center', color: 'red' },
                { name: 'location', alignment: 'center', color: 'red' },
                { name: 'protected', alignment: 'center', color: 'red' },
            ]
        })

        await this.get<TwitterAccount>(`/api/block-list/fetch/${accountId.accountId}`).then(result => {
            if (result.response.request.result?.status) {
                const account = result.response.request.result.data
                table.addRow({
                    created_at: account?.created_at || "Impossible to get the `created_at` variable.",
                    name: account?.name,
                    username: account?.username,
                    location: account?.location || "Location is not set.",
                    protected: account?.protected || "This account is not protected."
                })

                table.printTable()
                result.response.spinner.succeed("The datatable is loaded.")
                this.exit(0)
            } else {
                this.error("Error occurred during the proccess.")
            }
        })
    }
}