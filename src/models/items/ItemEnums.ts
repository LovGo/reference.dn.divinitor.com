import ITypedMap from '../util/ITypedMap';

export enum ItemRank {
    NORMAL,
    MAGIC,
    RARE,
    UNIQUE,
    LEGENDARY,
    DIVINE,
    ANCIENT,
};

export enum ItemType {

}

export enum ItemState {
    NONE = -1,
    STRENGTH = 0,
    AGILITY = 1,
    INTELLECT = 2,
    VITALITY = 3,
    PHYSICAL_DAMAGE_MIN = 4,
    PHYSICAL_DAMAGE_MAX = 5,
    MAGICAL_DAMAGE_MIN = 6,
    MAGICAL_DAMAGE_MAX = 7,
    PHYSICAL_DEFENSE = 8,
    MAGICAL_DEFENSE = 9,
    PARALYZE = 10,
    PARALYZE_RESIST = 11,
    CRITICAL = 12,
    CRITICAL_RESIST = 13,
    STUN = 14,
    STUN_RESIST = 15,
    FIRE_ATTACK = 16,
    ICE_ATTACK = 17,
    LIGHT_ATTACK = 18,
    DARK_ATTACK = 19,
    FIRE_DEFENSE = 20,
    ICE_DEFENSE = 21,
    LIGHT_DEFENSE = 22,
    DARK_DEFENSE = 23,
    MOVEMENT_SPEED = 24,
    HP = 25,
    MANA = 26,
    MANA_RECOVERY = 27,
    TWENTY_EIGHT = 28,
    FINAL_DAMAGE = 29,
    SAFE_ZONE_MOVEMENT_SPEED = 30,
    THIRTY_ONE = 31,
    PHYSICAL_DAMAGE_MINMAX = 32,
    MAGICAL_DAMAGE_MINMAX = 33,
    STR_AGI_INT_VIT = 37,
    STRENGTH_PERCENT = 50,
    AGILITY_PERCENT = 51,
    INTELLECT_PERCENT = 52,
    VITALITY_PERCENT = 53,
    PHYSICAL_DAMAGE_MIN_PERCENT = 54,
    PHYSICAL_DAMAGE_MAX_PERCENT = 55,
    MAGICAL_DAMAGE_MIN_PERCENT = 56,
    MAGICAL_DAMAGE_MAX_PERCENT = 57,
    PHYSICAL_DEFENSE_PERCENT = 58,
    MAGICAL_DEFENSE_PERCENT = 59,
    PARALYZE_PERCENT = 60,
    PARALYZE_RESIST_PERCENT = 61,
    CRITICAL_PERCENT = 62,
    CRITICAL_RESIST_PERCENT = 63,
    STUN_PERCENT = 64,
    STUN_RESIST_PERCENT = 65,
    MOVEMENT_SPEED_PERCENT = 74,
    HP_PERCENT = 75,
    MP_PERCENT = 76,
    MANA_RECOVERY_PERCENT = 77,
    FINAL_DAMAGE_PERCENT = 79,
    SAFE_ZONE_MOVEMENT_SPEED_PERCENT = 81,
    STR_AGI_INT_VIT_PERCENT = 87,
    FIRE_ICE_LIGHT_DARK_ATTACK = 88,
    WILL = 100,
    PHYSICAL_DAMAGE_MINMAX_PERCENT = 101,
    MAGICAL_DAMAGE_MINMAX_PERCENT = 102,
    CRITICAL_DAMAGE = 103,
    CRITICAL_DAMAGE_PERCENT = 104,
    PVP_DAMAGE = 105,
    PVP_DEFENSE = 106,
    ONE_HUNDRED_SEVEN = 107,
}

export interface IItemStateInfo {
    abbv: string;
    type: 'stat'|'percent'|'compound';
    compound?: ItemState[];
    subtype?: 'stat'|'percent';
}

export const StateInfo: { [key: number]: IItemStateInfo } = {
    [ItemState.STRENGTH]: {
        abbv: 'STR',
        type: 'stat',
    },
    [ItemState.AGILITY]: {
        abbv: 'AGI',
        type: 'stat',
    },
    [ItemState.INTELLECT]: {
        abbv: 'INT',
        type: 'stat',
    },
    [ItemState.VITALITY]: {
        abbv: 'VIT',
        type: 'stat',
    },
    [ItemState.PHYSICAL_DAMAGE_MIN]: {
        abbv: 'PDMG [MIN]',
        type: 'stat',
    },
    [ItemState.PHYSICAL_DAMAGE_MAX]: {
        abbv: 'PDMG [MAX]',
        type: 'stat',
    },
    [ItemState.MAGICAL_DAMAGE_MIN]: {
        abbv: 'MDMG [MIN]',
        type: 'stat',
    },
    [ItemState.MAGICAL_DAMAGE_MAX]: {
        abbv: 'MDMG [MAX]',
        type: 'stat',
    },
    [ItemState.PHYSICAL_DEFENSE]: {
        abbv: 'PDEF',
        type: 'stat',
    },
    [ItemState.MAGICAL_DEFENSE]: {
        abbv: 'MDEF',
        type: 'stat',
    },
    [ItemState.PARALYZE]: {
        abbv: 'PARA',
        type: 'stat',
    },
    [ItemState.PARALYZE_RESIST]: {
        abbv: 'PARARES',
        type: 'stat',
    },
    [ItemState.CRITICAL]: {
        abbv: 'CRIT',
        type: 'stat',
    },
    [ItemState.CRITICAL_RESIST]: {
        abbv: 'CRITRES',
        type: 'stat',
    },
    [ItemState.STUN]: {
        abbv: 'STUN',
        type: 'stat',
    },
    [ItemState.STUN_RESIST]: {
        abbv: 'STUNRES',
        type: 'stat',
    },
    [ItemState.FIRE_ATTACK]: {
        abbv: 'FIRE %',
        type: 'percent',
    },
    [ItemState.ICE_ATTACK]: {
        abbv: 'ICE %',
        type: 'percent',
    },
    [ItemState.LIGHT_ATTACK]: {
        abbv: 'LIGHT %',
        type: 'percent',
    },
    [ItemState.DARK_ATTACK]: {
        abbv: 'DARK %',
        type: 'percent',
    },
    [ItemState.FIRE_DEFENSE]: {
        abbv: 'FIRE DEF%',
        type: 'percent',
    },
    [ItemState.ICE_DEFENSE]: {
        abbv: 'ICE DEF%',
        type: 'percent',
    },
    [ItemState.LIGHT_DEFENSE]: {
        abbv: 'LIGHT DEF%',
        type: 'percent',
    },
    [ItemState.DARK_DEFENSE]: {
        abbv: 'DARK DEF%',
        type: 'percent',
    },
    [ItemState.MOVEMENT_SPEED]: {
        abbv: 'MOVE',
        type: 'stat',
    },
    [ItemState.HP]: {
        abbv: 'HP',
        type: 'stat',
    },
    [ItemState.MANA]: {
        abbv: 'MANA',
        type: 'stat',
    },
    [ItemState.MANA_RECOVERY]: {
        abbv: 'MP REGEN',
        type: 'stat',
    },
    [ItemState.FINAL_DAMAGE]: {
        abbv: 'FD',
        type: 'stat',
    },
    [ItemState.SAFE_ZONE_MOVEMENT_SPEED]: {
        abbv: 'SAFEMOVE',
        type: 'stat',
    },
    [ItemState.PHYSICAL_DAMAGE_MINMAX]: {
        abbv: 'PDMG',
        type: 'compound',
        compound: [ItemState.PHYSICAL_DAMAGE_MIN, ItemState.PHYSICAL_DAMAGE_MAX],
        subtype: 'stat',
    },
    [ItemState.MAGICAL_DAMAGE_MINMAX]: {
        abbv: 'MDMG',
        type: 'compound',
        compound: [ItemState.MAGICAL_DAMAGE_MIN, ItemState.MAGICAL_DAMAGE_MAX],
        subtype: 'stat',
    },
    [ItemState.STR_AGI_INT_VIT]: {
        abbv: 'STR/AGI/INT/VIT',
        type: 'compound',
        compound: [ItemState.STRENGTH, ItemState.AGILITY, ItemState.INTELLECT, ItemState.VITALITY],
        subtype: 'stat',
    },
    [ItemState.STRENGTH_PERCENT]: {
        abbv: 'STR %',
        type: 'percent',
    },
    [ItemState.AGILITY_PERCENT]: {
        abbv: 'AGI %',
        type: 'percent',
    },
    [ItemState.INTELLECT_PERCENT]: {
        abbv: 'INT %',
        type: 'percent',
    },
    [ItemState.VITALITY_PERCENT]: {
        abbv: 'VIT %',
        type: 'percent',
    },
    [ItemState.PHYSICAL_DAMAGE_MIN_PERCENT]: {
        abbv: 'PDMG % [MIN]',
        type: 'percent',
    },
    [ItemState.PHYSICAL_DAMAGE_MAX_PERCENT]: {
        abbv: 'PDMG % [MAX]',
        type: 'percent',
    },
    [ItemState.MAGICAL_DAMAGE_MIN_PERCENT]: {
        abbv: 'MDMG % [MIN]',
        type: 'percent',
    },
    [ItemState.MAGICAL_DAMAGE_MAX_PERCENT]: {
        abbv: 'MDMG % [MAX]',
        type: 'percent',
    },
    [ItemState.PHYSICAL_DEFENSE_PERCENT]: {
        abbv: 'PDEF %',
        type: 'percent'
    },
    [ItemState.MAGICAL_DEFENSE_PERCENT]: {
        abbv: 'MDEF %',
        type: 'percent',
    },
    [ItemState.PARALYZE_PERCENT]: {
        abbv: 'PARA %',
        type: 'percent',
    },
    [ItemState.PARALYZE_RESIST_PERCENT]: {
        abbv: 'PARARES %',
        type: 'percent',
    },
    [ItemState.CRITICAL_PERCENT]: {
        abbv: 'CRIT %',
        type: 'percent',
    },
    [ItemState.CRITICAL_RESIST_PERCENT]: {
        abbv: 'CRITRES %',
        type: 'percent',
    },
    [ItemState.STUN_PERCENT]: {
        abbv: 'STUN %',
        type: 'percent',
    },
    [ItemState.STUN_RESIST_PERCENT]: {
        abbv: 'STUNRES %',
        type: 'percent',
    },
    [ItemState.MOVEMENT_SPEED_PERCENT]: {
        abbv: 'MOVE %',
        type: 'percent',
    },
    [ItemState.HP_PERCENT]: {
        abbv: 'HP %',
        type: 'percent',
    },
    [ItemState.MP_PERCENT]: {
        abbv: 'MP %',
        type: 'percent',
    },
    [ItemState.MANA_RECOVERY_PERCENT]: {
        abbv: 'MP REGEN %',
        type: 'percent',
    },
    [ItemState.FINAL_DAMAGE_PERCENT]: {
        abbv: 'FD %',
        type: 'percent',
    },
    [ItemState.SAFE_ZONE_MOVEMENT_SPEED_PERCENT]: {
        abbv: 'SAFEMOVE %',
        type: 'percent',
    },
    [ItemState.STR_AGI_INT_VIT_PERCENT]: {
        abbv: 'STR/AGI/INT/VIT %',
        type: 'compound',
        compound: [ItemState.STRENGTH_PERCENT, ItemState.AGILITY_PERCENT, ItemState.INTELLECT_PERCENT, ItemState.VITALITY_PERCENT],
        subtype: 'percent',
    },
    [ItemState.FIRE_ICE_LIGHT_DARK_ATTACK]: {
        abbv: 'ELE',
        type: 'compound',
        compound: [ItemState.FIRE_ATTACK, ItemState.ICE_ATTACK, ItemState.LIGHT_ATTACK, ItemState.FIRE_ATTACK],
        subtype: 'percent',
    },
    [ItemState.WILL]: {
        abbv: 'WILL',
        type: 'stat',
    },
    [ItemState.PHYSICAL_DAMAGE_MINMAX_PERCENT]: {
        abbv: 'PDMG %',
        type: 'compound',
        compound: [ItemState.PHYSICAL_DAMAGE_MIN_PERCENT, ItemState.PHYSICAL_DAMAGE_MAX_PERCENT],
        subtype: 'percent',
    },
    [ItemState.MAGICAL_DAMAGE_MINMAX_PERCENT]: {
        abbv: 'MDMG %',
        type: 'compound',
        compound: [ItemState.MAGICAL_DAMAGE_MIN_PERCENT, ItemState.MAGICAL_DAMAGE_MAX_PERCENT],
        subtype: 'percent',
    },
    [ItemState.CRITICAL_DAMAGE]: {
        abbv: 'CRITDMG',
        type: 'stat',
    },
    [ItemState.CRITICAL_DAMAGE_PERCENT]: {
        abbv: 'CRITDMG %',
        type: 'stat',
    },
    [ItemState.PVP_DAMAGE]: {
        abbv: 'PVP DMG',
        type: 'stat',
    },
    [ItemState.PVP_DEFENSE]: {
        abbv: 'PVP DEF',
        type: 'stat'
    }
}

export enum WeaponType {
    WA_GREATSWORD = 0,
    WA_GAUNTLET = 1,
    WA_AXE = 2,
    WA_HAMMER = 3,
    AR_SHORTBOW = 4,
    AR_LONGBOW = 5,
    AR_CROSSBOW = 6,
    SO_STAFF = 7,
    SO_GRIMOIRE = 8,
    SO_ORB = 9,
    SO_PUPPET = 10,
    CL_MACE = 11,
    CL_FLAIL = 12,
    CL_WAND = 13,
    CL_SHIELD = 14,
    AR_QUIVER = 15,
    AC_CANNON = 16,
    AC_BUBBLE_BLASTER = 17,
    AC_POWERGLOVE = 18,
    KA_FAN = 19,
    KA_CHAKRAM = 20,
    KA_CHARM = 21,
    AS_SCIMITAR = 22,
    AS_DAGGER = 23,
    AS_HOOK = 24,
    LE_SPEAR = 25,
    LE_LANCE = 26,
    LE_BRACELET = 27,
    MC_KNUCKLE = 28,
    MC_BLASTER = 29,
    MC_CLAW = 30,
    CONVERSION_MAINHAND = 31,
    CONVERSION_OFFHAND = 32,
    BD_BATTLESWORD = 33,
    BD_UNK = 34,
    BD_WRISTBOW = 35,
}

export const WeaponTypeName = {
    [WeaponType.WA_GREATSWORD]: 'Greatsword',
    [WeaponType.WA_GAUNTLET]: 'Gauntlet',
    [WeaponType.WA_AXE]: 'Axe',
    [WeaponType.WA_HAMMER]: 'Hammer',
    [WeaponType.AR_SHORTBOW]: 'Shortbow',
    [WeaponType.AR_LONGBOW]: 'Longbow',
    [WeaponType.AR_CROSSBOW]: 'Crossbow',
    [WeaponType.SO_STAFF]: 'Staff',
    [WeaponType.SO_GRIMOIRE]: 'Grimoire',
    [WeaponType.SO_ORB]: 'Orb',
    [WeaponType.SO_PUPPET]: 'Puppet',
    [WeaponType.CL_MACE]: 'Mace',
    [WeaponType.CL_FLAIL]: 'Flail',
    [WeaponType.CL_WAND]: 'Wand',
    [WeaponType.CL_SHIELD]: 'Shield',
    [WeaponType.AR_QUIVER]: 'Quiver',
    [WeaponType.AC_CANNON]: 'Cannon',
    [WeaponType.AC_BUBBLE_BLASTER]: 'Bubble Blaster',
    [WeaponType.AC_POWERGLOVE]: 'Powerglove',
    [WeaponType.KA_FAN]: 'Fan',
    [WeaponType.KA_CHAKRAM]: 'Chakram',
    [WeaponType.KA_CHARM]: 'Charm',
    [WeaponType.AS_SCIMITAR]: 'Scimitar',
    [WeaponType.AS_DAGGER]: 'Dagger',
    [WeaponType.AS_HOOK]: 'Hook',
    [WeaponType.LE_SPEAR]: 'Spear',
    [WeaponType.LE_LANCE]: 'Lance',
    [WeaponType.LE_BRACELET]: 'Bracelet',
    [WeaponType.MC_KNUCKLE]: 'Knuckle',
    [WeaponType.MC_BLASTER]: 'Blaster',
    [WeaponType.MC_CLAW]: 'Claw',
    [WeaponType.CONVERSION_MAINHAND]: 'Conversion Weapon',
    [WeaponType.CONVERSION_OFFHAND]: 'Conversion Offhand',
    [WeaponType.BD_BATTLESWORD]: 'Battlesword',
    [WeaponType.BD_UNK]: 'Unknown',
    [WeaponType.BD_WRISTBOW]: 'Wristbow',
}
