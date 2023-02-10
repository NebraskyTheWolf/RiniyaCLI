import prompts from 'prompts';
import BaseCommand from '../../BaseCommand';

export declare type PhoneCarrier = {}

export default class PhoneCheck extends BaseCommand {
    static description: "Gather information from a phone number"

    async run() {
        let phone = await prompts({
            name: 'Phone',
            type: "text",
            message: "Phone number"
        });


        await this.get<PhoneCarrier>(`/api/osint/phone/${phone.Phone}`).then(result => {
            this.error("Not Implemented Yet.")
        })
    }
}