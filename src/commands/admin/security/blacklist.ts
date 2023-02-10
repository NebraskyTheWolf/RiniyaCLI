import prompts from 'prompts';
import BaseCommand from '../../BaseCommand';

export declare type Blacklist = {
    userId: string;
    caseId: string;
    reason: string;
    issuedBy: string;
    registeredAt: number;
}

export default class BlacklistCommand extends BaseCommand {
    static description: "Manage the blacklist entries."

    async run() {
        let action = await prompts({
            name: "Action",
            type: "select",
            choices: [
                {
                    title: "add",
                    description: "Add a blacklist entry.",
                    value: "blacklist:add"
                },
                {
                    title: "status",
                    description: "Check a blacklist entry.",
                    value: "blacklist:status"
                },
                {
                    title: "remove",
                    description: "Remove a blacklist entry.",
                    value: "blacklist:remove"
                }
            ],
            message: "Action"
        })

        let accountId = await prompts({
            name: 'TargetId',
            type: "text",
            message: "User snowflake"
        });

        switch (action.Action) {
            case "blacklist:add": {
                this.send("add", accountId.TargetId)
            }
                break
            case "blacklist:status": {
                this.send("status", accountId.TargetId)
            }
                break
            case "blacklist:remove": {
                this.send("remove", accountId.TargetId)
            }
                break
            default:
                this.error("Invalid `actionId`.")
        }
    }

    private send(type: string, accountId: string): void {
        this.get<Blacklist>(`/api/guilds/blacklist/${type}/${accountId}`).then(result => {
            if (type !== "status")
                if (result.response.request.result?.status)
                    result.response.spinner.succeed(`${type} action for ${accountId}.`)
                else
                    this.error("The request has failed.")
            else {
                const table = this.makeTable({
                    title: "Blacklist status of " + accountId,
                    columns: [
                        { name: 'user_id', alignment: 'center', color: 'red' },
                        { name: 'case_id', alignment: 'center', color: 'red' },
                        { name: 'reason', alignment: 'center', color: 'red' },
                        { name: 'issued_by', alignment: 'center', color: 'red' },
                        { name: 'created_at', alignment: 'center', color: 'red' },
                    ]
                });
                const data = result.response.request.result?.data
                table.addRows({
                    user_id: data?.userId,
                    case_id: data?.caseId,
                    reason: data?.reason,
                    issued_by: data?.issuedBy,
                    created_at: data?.registeredAt
                })
                table.printTable()
                result.response.spinner.succeed("The datatable is ready.")
            }
        })
    }
}