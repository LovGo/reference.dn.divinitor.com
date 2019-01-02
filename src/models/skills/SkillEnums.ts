export enum SkillType {
    ACTIVE = 0,
    PASSIVE,
    AUTOMATIC_PASSIVE,
    EX_PASSIVE,
    AUTOMATIC_ACTIVATION,
}

export enum SkillDurationType {
    INSTANT = 0,
    BUFF,
    DEBUFF,
    TIMED_TOGGLE,
    ACTIVE_TOGGLE,
    AURA,
    ACTIVE_TOGGLE_PET,
    SUMMON_DESUMMON_PET,
    CHANGE_STANCE,
    UNIFIED_SKILL,
}

export enum SkillTargetType {
    SELF = 0,
    ENEMY,
    ALLIED,
    PARTY_MEMBERS,
    ALL,
}

export enum SkillEffectApplyType {
    SELF = 0,
    TARGETED_ACTOR,
    ALL,
    ENEMY,
    ALLY,
}
