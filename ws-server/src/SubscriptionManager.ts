import { createClient, RedisClientType } from "redis";
import { UserManager } from "./UserManager";

export class SubscriptionManager {
    private static instance: SubscriptionManager;
    private subscriptions: Map<string, string[]> = new Map();
    private reverseSubscriptions: Map<string, string[]> = new Map();
    private redisClient: RedisClientType;

    private constructor() {
        this.redisClient = createClient();
        this.redisClient.connect();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SubscriptionManager();
        }
        return this.instance;
    }

    public subscription(channel: string, userId: string) {
        if (this.subscriptions.get(userId)?.includes(channel)) {
            return;
        }
        this.subscriptions.set(userId, [...this.subscriptions.get(userId) || [], channel]);
        this.reverseSubscriptions.set(channel, [...this.reverseSubscriptions.get(channel) || [], userId]);
        if (this.reverseSubscriptions.get(channel)?.length === 1) {
            this.redisClient.subscribe(channel, this.redisCallbackHandler);
        }
    }

    private redisCallbackHandler = (message: string, channel: string) => {
        const parsedMessage = JSON.parse(message);
        this.reverseSubscriptions.get(channel)?.forEach(s => {
            UserManager.getInstance().getUser(s)?.emit(parsedMessage);
        });
    }

    public unsubscription(channel: string, userId: string) {
        const subscriptions = this.subscriptions.get(userId);
        if (subscriptions) {
            this.subscriptions.set(userId, subscriptions.filter(s => s !== channel));
        }
        const reverseSubscriptions = this.reverseSubscriptions.get(channel);
        if (reverseSubscriptions) {
            this.reverseSubscriptions.set(channel, reverseSubscriptions.filter(s => s !== userId));
            if (this.reverseSubscriptions.get(channel)?.length === 0) {
                this.reverseSubscriptions.delete(channel);
                this.redisClient.unsubscribe(channel);
            }
        }
    }

    public userLeft(userId: string) {
        console.log("User left" + userId);
        this.subscriptions.get(userId)?.forEach(s => {
            this.unsubscription(s, userId);
        });
    }

    getSubscriptions(userId: string) {
        return this.subscriptions.get(userId) || [];
    }
}