import Websocket from "../util/websocket"
import { writeFileSync } from "fs";
import { Table } from "console-table-printer"
import { Message } from "@cryb/mesa";
import Base from "./Base";
import SpinnerBuilder from "../util/SpinnerBuilder";

export declare type PacketAction = "AUTHENTICATION" | "LOGIN" | "DISCONNECT" | "DEBUG" | "PAYLOAD"

export default abstract class BaseCommand extends Base {
    private readonly websocket: Websocket = new Websocket()
    protected readonly spinner: SpinnerBuilder = new SpinnerBuilder("Contacting RiniyaAPI..")
        .setColor("red")
        .setSpinner("clock")

    protected makeTable(data: any): Table {
        return new Table(data)
    }

    protected async sendPacket(data: any, action: PacketAction): Promise<number> {
        return this.websocket.send(new Message(0, data, action))
    }

    protected async save(name: string, data: any): Promise<void> {
        return writeFileSync(name + ".json", JSON.stringify(data))
    }
}