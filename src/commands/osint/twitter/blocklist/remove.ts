import prompts from 'prompts';
import BaseCommand from '../../../BaseCommand';

declare type TwitterAccount = {}

export default class RemoveBlocked extends BaseCommand {
    static description: "Remove blocked user in the block-list."

    async run() {
        let accountId = await prompts({
            name: 'accountId',
            type: "text",
            message: "Account id"
        });

        await this.get<TwitterAccount>(`/api/block-list/remove/${accountId.accountId}`).then(result => {
            this.error("Not Implemented Yet.")
        })
    }
}