import prompts from 'prompts';
import { PostResponse } from '../../Base';
import BaseCommand from '../../BaseCommand';
import { GooggleAccount } from '../../osint/google/ghunt';

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
                let reason = await prompts({
                    name: 'Reason',
                    type: "text",
                    message: "Reasons"
                });
                this.send("add", accountId.TargetId, reason.Reason)
            }
                break
            case "blacklist:status": {
                this.send("status", accountId.TargetId, "")
            }
                break
            case "blacklist:remove": {
                this.send("remove", accountId.TargetId, "")
            }
                break
            default:
                this.error("Invalid `actionId`.")
        }
    }

    private send(type: string, accountId: string, reason?: string): void {
        this.post<Blacklist>("/api/security/blacklist", {
            payload: type.toUpperCase(),
            data: {
                userId: accountId,
                reason: reason
            }
        }).then(async response => {
            if (response.status) {
                this.log("[+] Payload successfully executed.")
                if (type === 'status')
                    this.generate(accountId, response.data)
                this.sendPacket({
                    payload: "blacklist/" + type,
                    data: {
                        userId: accountId
                    }
                }, "PAYLOAD")
            } else {
                this.error("Error occurred : " + response.error)
            }
        })
    }

    private generate(id: string, response?: Blacklist) : void {
        this.makeTable({
            title: "Blacklist status of " + id,
            columns: [
                { name: 'user_id', alignment: 'center', color: 'red' },
                { name: 'case_id', alignment: 'center', color: 'red' },
                { name: 'reason', alignment: 'center', color: 'red' },
                { name: 'issued_by', alignment: 'center', color: 'red' },
                { name: 'created_at', alignment: 'center', color: 'red' },
            ],
            rows: [
                {
                    user_id: response?.userId,
                    case_id: response?.caseId,
                    reason: response?.reason,
                    issued_by: response?.issuedBy,
                    created_at: response?.registeredAt
                }
            ]
        }).printTable()
    }
}