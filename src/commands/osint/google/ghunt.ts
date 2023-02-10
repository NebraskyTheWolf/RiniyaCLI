import prompts from 'prompts';
import BaseCommand from '../../BaseCommand';

declare type Names = {
    fullname: string
    firstname: string
    lastname: string
}

declare type ProfileInfo = {
    userType: string
}

declare type Emails = {
    value: string
}

declare type ProfilePhoto = {
    url?: string
    isDefault?: boolean
    flathash?: string
}

declare type Profile = {
    fullname: string
    personId: string
    lastUpdated: string
    profilePhoto?: ProfilePhoto
    profileInfo?: ProfileInfo
    emails: Emails
    names: Names

}

export declare type GooggleAccount = {
    profile?: Profile
}

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

        let identifier = await prompts({
            name: 'Identifier',
            type: "text",
            message: "Email / GaiaID / Drive"
        });

        this.send(type.Action, identifier.Identifier)
    }

    private send(type: string, identifier: string) {
        this.post<GooggleAccount>('/api/osint/ghunt', {
            payload: type.toUpperCase(),
            data: {
                identifier: identifier
            }
        }).then(async result => {
            if (result.status) {
                switch (type) {
                    case "email": {
                        // TODO: make a data formater.
                    }
                        break
                    case "gaia": {

                    }
                        break
                    case "drive": {

                    }
                        break
                }
            } else {
                this.error("Error occurred : " + result?.error)
            }
        })
    }
}