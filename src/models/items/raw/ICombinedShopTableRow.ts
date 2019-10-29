export default interface ICombinedShopTableRow {
    rowId: number;
    _ShopID: number;
    _TabID: number;
    _TabNameID: number;
    _ListID: number;
    _itemindex: number;
    _Quantity: number;
    _Period: number;
    _PurchaseType1: number;
    _PurchaseItem1: number;
    _PurchaseItemValue1: number;
    _PurchaseType2: number;
    _PurchaseItem2: number;
    _PurchaseItemValue2: number;
    _PurchaseLimitType: number;
    _PurchaseLimitValue: number;
    _buyLimitCount: number;
    _ShopLimitReset: number;
    _ItemOptionID: number;
    _ShopSealCount: number;
    _PotentialList: boolean;
    _StorePreview: boolean;
}
