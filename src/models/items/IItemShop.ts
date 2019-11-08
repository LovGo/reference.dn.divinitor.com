import IUiStringMessage from '@/models/uistring/IUiStringMessage';

export default interface IItemShop {
    id: number;
    tabs: IItemShopTab[];
}

export interface IItemShopTab {
    id: number;
    name: IUiStringMessage;
    entries: IItemShopTabEntry[];
}

export interface IItemShopTabEntry {
    id: number;
    index: number;
    itemId: number;
    quantity: number;
    cost: {
        costType: PurchaseType;
        costItemId: number;
        costParam: number;
    }[];
    limitType: PurchaseLimitType;
    limitParam: number;
    limitCount: number;
    limitReset: ShopLimitResetType;
    itemOption: number;
    seals: number;
    rollPotentialOnPurchase: boolean;
}

export enum PurchaseType {
    NONE,
    COIN,
    ITEM,
    LADDER_POINTS,
    FRIENDSHIP,
    BEGIN_POINTS = 8,
}

export enum PurchaseLimitType {
    NONE,
    MIN_LEVEL = 2,
    MIN_PVP_RANK,
    ACHIEVEMENT_POINTS = 6,
    MIN_LADDER_RANK,
}

export enum ShopLimitResetType {
    NONE,
    DAILY,
    WEEKLY,
    DAILY_ACCOUNT,
    WEEKLY_ACCOUNT,
}
