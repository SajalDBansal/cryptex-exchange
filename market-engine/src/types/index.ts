export type UserBalance = {
    [key: string]: {
        available: number;
        locked: number;
    }
}

export const BASE_CURRENCY = "INR";