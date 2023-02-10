import prompts from 'prompts';
import BaseCommand from '../../BaseCommand';

export declare type PhoneCarrier = {
    country: string
    carrier: string
    city: string
    timezone: string
}

export default class PhoneCheck extends BaseCommand {
    static description: "Gather information from a phone number"

    async run() {
        let phone = await prompts({
            name: 'Phone',
            type: "text",
            message: "Phone number"
        });

        this.post<PhoneCarrier>('/api/osint/phone', {
            identifier: phone.Phone
        }).then(async result => {
            if (result.status) {
                this.makeTable({
                    title: "Phone number scan",
                    columns: [
                        { name: 'country', alignment: 'center', color: 'magenta' },
                        { name: 'carrier', alignment: 'center', color: 'magenta' },
                        { name: 'timezone', alignment: 'center', color: 'magenta' },
                        { name: 'city', alignment: 'center', color: 'magenta' }
                    ],
                    rows: [
                        {
                            country: result.data?.country,
                            carrier: result.data?.carrier,
                            timezone: result.data?.timezone,
                            city: result.data?.city
                        }
                    ]
                }).printTable()
            } else {
                this.error("Error occurred : " + result.error)
            }
        })
    }
}