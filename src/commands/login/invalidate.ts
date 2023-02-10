import prompts from 'prompts';
import BaseCommand from '../BaseCommand';

export declare type Session = {
    message: string
}

export default class InvalidateSession extends BaseCommand {
    static description: "Invalidate a session."

    async run() {
        this.log('[?] Session invalidation.')
        let confirm = await prompts({
            name: "confirm",
            type: "toggle",
            message: "Are you sure to continue?"
        })

        if (confirm.confirm) {
            const session = this.fetchSession();
            this.post<Session>('/api/security/session', {
                payload: "invalidate",
                data: {
                    accessToken: session.accessToken,
                    clientToken: session.clientToken
                }
            }).then(async result => {
                if (result.status) {
                    if (result.data?.message === "removed") {
                        this.log("[-] Session successfully removed! You'll have to relogin later.")
                    } else {
                        this.error("Failed to remove the session.")
                    }
                } else {
                    this.error("Error occurred : " + result.error)
                }
            })
        } else {
            this.error("Request aborted by user.")
        }
    }
}