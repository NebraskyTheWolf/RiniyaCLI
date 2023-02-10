import prompts from 'prompts';
import BaseCommand from '../../BaseCommand';

export declare type GooggleAccount = {}

export default class GhuntOsint extends BaseCommand {
    static description: "Gather information from a gmail address."

    async run() {
        let type = await prompts({
            name: 'Action',
            type: "select",
            choices: [
                {
                    title: "Email",
                    description: "Fetch all information from a email.",
                    value: "email"
                },
                {
                    title: "Gaia ID",
                    description: "Get informations from a Gaia ID",
                    value: "gaia",
                    disabled: true
                },
                {
                    title: "Drive",
                    description: "Get data from a drive / files",
                    value: "drive",
                    disabled: true
                }
            ],
            message: "Type"
        });

        let email = await prompts({
            name: 'Email',
            type: "text",
            message: "Email"
        });

        await this.get<GooggleAccount>(`/api/osint/ghunt/${type.Action}/${email.Email}`).then(result => { 
            this.error("Not Implemented Yet.")
        })
    }
}