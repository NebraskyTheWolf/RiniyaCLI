import prompts from 'prompts';
import BaseCommand from '../BaseCommand';

export declare type Data = {
    accessToken: string;
    clientToken: string;
    sessionExpiry: number;
}

export default class LoginSession extends BaseCommand {
    static description: "Login to a session."

    async run() {
        let username = await prompts({
            name: 'Username',
            type: "text",
            message: "Username",
        });

        let password = await prompts({
            name: 'Password',
            type: "password",
            message: "Password"
        });

        await this.login(username.Username, password.Password).then(result => {
            if (result.response.request.result?.status) {
                this.save("session", result.response.request.result?.data)
                this.log("[+] identifier: " + result.response.request.result?.data?.accessToken.split('-')[1] + "/" + result.response.request.result?.data?.clientToken.split('-')[1])
                result.response.spinner.succeed("You are now logged with " + username.Username)
                this.exit(0)
            } else {
                this.error("The username or password is invalid!")
            }
        })
    }
}