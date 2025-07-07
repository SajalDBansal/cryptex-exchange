import { WebSocket } from "ws";
import { IncomingMessage } from "./types/inWs";
import { OutgoingMessage } from "./types/outWs";
import { SubscriptionManager } from "./SubscriptionManager";

export class User {
    private id: string;
    private ws: WebSocket;

    constructor(id: string, ws: WebSocket) {
        this.id = id;
        this.ws = ws;
        this.addListener();
    }

    private subscriptions: string[] = [];

    public subscribe(channel: string) {
        this.subscriptions.push(channel);
    }

    public unsubscribe(channel: string) {
        this.subscriptions = this.subscriptions.filter(x => x !== channel);
    }

    emit(message: OutgoingMessage) {
        this.ws.send(JSON.stringify(message));
    }

    private addListener() {
        this.ws.on("message", (message: string) => {
            const parsedMessage: IncomingMessage = JSON.parse(message);

            if (parsedMessage.type === "SUBSCRIBE") {
                parsedMessage.params.forEach(s => SubscriptionManager.getInstance().subscription(s, this.id));

            }
            if (parsedMessage.type === "UNSUBSCRIBE") {
                parsedMessage.params.forEach(s => SubscriptionManager.getInstance().unsubscription(s, this.id));
            }
        });
    }

}