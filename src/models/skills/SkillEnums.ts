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

export enum SkillUsableChecker {
    NULL = 0,
    /**
     * Params: RequiredState, Operator
     */
    CASTER_STATE,
    /**
     * Params: HP%, Operator
     */
    HAS_HP,
    /**
     * Params: Chance
     */
    PROBABILITY,
    /**
     * Params: RequiredState, Operator, Radius
     */
    TARGET_STATE,
    CAN_MOVE,
    CAN_JUMP,
    IS_HIT,
    /**
     * Params: ToggleSkillID
     */
    TOGGLE_IS_ACTIVE,
    ENERGY_CHARGE,
    CAN_GROUND_MOVE,
    TARGET_IN_RANGE,
    /**
     * Params: BubbleID, BubbleCount
     */
    HAS_BUBBLES,
    SUMMON_IN_RANGE,
    TARGET_STATE_EFFECT,
}

export enum SkillProcessor {
    NULL = 0,
    /**
     * Params: ActionName
     */
    DO_ACTION,
    /**
     * Params: StartActionName, LoopActionName, EndActionName, Duration, MoveSpeed
     */
    DO_LOOPING_ACTION,
    /**
     * Params: FromWeaponID, ToWeaponID
     */
    CHANGE_PROJECTILE,
    /**
     * Params: Argument
     */
    DIVIDED_STATE_EFFECT_ARG,
    IMPACT_BLOW,
    /**
     * Params: Range
     */
    AURA,
    /**
     * Params: Suffix, AffectedActionNames (up to 9)
     */
    ADD_ACTION_SUFFIX,
    /**
     * Params: Range, Chance, TargetEffect, Duration
     */
    APPLY_RANGED_STATE_EFFECT = 8,
    
    /**
     * When you have Count bubbles, consume them and perform action
     * Params: Param (BubbleId1;Count1;ActionName1;BubbleId2;Count2;ActionName2;...)
     */
    MODIFY_ACTION_ON_BUBBLE_COUNT = 12,
    /**
     * When you have Count bubbles, consume them and apply state effect index
     * Params: Param (BubbleId1;Count1;[EffectIdx11][EffectIdx12]...;BubbleId2;Count2;[EffectIdx21][EffectIdx22]...;...)
     */
    MODIFY_STATE_EFFECT_ON_BUBBLE_COUNT = 13,
    
    SUMMON_DO_ACTION,
    
    /**
     * Params: Param (MaxCTCStacks;Unk2)
     */
    CTC = 15,

    UNKNOWN16,
    
    /**
     * Params: Direction
     * Append _Direction (e.g. _Front if Direction is "Front") to the action name if the given direction is pressed
     */
    MODIFY_ON_DIRECTION = 17,
    /**
     * Params: Param (MonsterID;Count;ActionName;...)
     */
    MODIFY_ON_SUMMON_COUNT = 19,
}
