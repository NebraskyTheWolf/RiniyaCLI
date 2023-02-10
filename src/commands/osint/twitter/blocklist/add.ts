import prompts from 'prompts';
import BaseCommand from '../../../BaseCommand';

declare type TwitterAccount = {}

export default class AddBlocked extends BaseCommand {
    static description: "Add blocked user in the block-list."

    async run() {
        let accountId = await prompts({
            name: 'accountId',
            type: "text",
            message: "Account id"
        });

        await this.get<TwitterAccount>(`/api/block-list/create/${accountId.accountId}`).then(result => {
            this.error("Not Implemented Yet.")
        })
    }
}