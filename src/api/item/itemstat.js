
const STATES = {
    STRENGTH: {
        name: "Strength",
        abbv: "STR",
        type: "stat",
    },
    AGILITY: {
        name: "Agility",
        abbv: "AGI",
        type: "stat",
    },
    INTELLECT: {
        name: "Intellect",
        abbv: "INT",
        type: "stat",
    },
    VITALITY: {
        name: "Vitality",
        abbv: "VIT",
        type: "stat",
    },
    PHYSICAL_DAMAGE_MIN: {
        name: "Physical Damage (Min)",
        abbv: "PDMG (Min)",
        type: "stat",
        minmax: 'PHYSICAL_DAMAGE_MINMAX',
        mxt: 'min',
    },
    PHYSICAL_DAMAGE_MAX: {
        name: "Physical Damage (Max)",
        abbv: "PDMG (Max)",
        type: "stat",
        minmax: 'PHYSICAL_DAMAGE_MINMAX',
        mxt: 'max',
    },
    MAGICAL_DAMAGE_MIN: {
        name: "Magic Damage (Min)",
        abbv: "MDMG (Min)",
        type: "stat",
        minmax: 'MAGICAL_DAMAGE_MINMAX',
        mxt: 'min',
    },
    MAGICAL_DAMAGE_MAX: {
        name: "Magic Damage (Max)",
        abbv: "MDMG (Max)",
        type: "stat",
        minmax: 'MAGICAL_DAMAGE_MINMAX',
        mxt: 'max',
    },
    PHYSICAL_DEFENSE: {
        name: "Defense",
        abbv: "PDEF",
        type: "stat",
    },
    MAGICAL_DEFENSE: {
        name: "Magic Defense",
        abbv: "MDEF",
        type: "stat",
    },
    PARALYZE: {
        name: "Paralyze",
        abbv: "PARA",
        type: "stat",
    },
    PARALYZE_RESIST: {
        name: "Paralyze Resist",
        abbv: "PARA RESIST",
        type: "stat",
    },
    CRITICAL: {
        name: "Critical",
        abbv: "CRIT",
        type: "stat",
    },
    CRITICAL_RESIST: {
        name: "Critical Resist",
        abbv: "CRIT RESIST",
        type: "stat",
    },
    STUN: {
        name: "Stun",
        abbv: "STUN",
        type: "stat",
    },
    STUN_RESIST: {
        name: "Stun Resist",
        abbv: "STUN RESIST",
        type: "stat",
    },
    FIRE_ATTACK: {
        name: "Fire",
        abbv: "FIRE",
        type: "percent",
    },
    ICE_ATTACK: {
        name: "Ice",
        abbv: "ICE",
        type: "percent",
    },
    LIGHT_ATTACK: {
        name: "Light",
        abbv: "LIGHT",
        type: "percent",
    },
    DARK_ATTACK: {
        name: "Dark",
        abbv: "DARK",
        type: "percent",
    },
    FIRE_DEFENSE: {
        name: "Fire",
        abbv: "FIRE",
        type: "percent",
    },
    ICE_DEFENSE: {
        name: "Ice Defense",
        abbv: "ICE DEF",
        type: "percent",
    },
    LIGHT_DEFENSE: {
        name: "Light Defense",
        abbv: "LIGHT DEF",
        type: "percent",
    },
    DARK_DEFENSE: {
        name: "Dark Defense",
        abbv: "DARK DEF",
        type: "percent",
    },
    HP: {
        name: "HEALTH",
        abbv: "HP",
        type: "stat",
    },
    MANA: {
        name: "MANA",
        abbv: "MP",
        type: "stat",
    },
    TWENTY_SEVEN: {
        name: "27",
        abbv: "27",
        type: "stat",
    },
    FINAL_DAMAGE: {
        name: "Final Damage",
        abbv: "FD",
        type: "stat",
    },
    THIRTY: {
        name: "30",
        abbv: "30",
        type: "stat",
    },
    PHYSICAL_DAMAGE_MINMAX: {
        name: "Physical Damage",
        abbv: "PDMG",
        type: "stat",
        combined: true,
        children: [
            "PHYSICAL_DAMAGE_MIN",
            "PHYSICAL_DAMAGE_MAX",
        ],
    },
    MAGICAL_DAMAGE_MINMAX: {
        name: "Magic Damage",
        abbv: "MDMG",
        type: "stat",
        combined: true,
        children: [
            "MAGICAL_DAMAGE_MIN",
            "MAGICAL_DAMAGE_MAX",
        ],
    },
    MOVEMENT_SPEED: {
        name: "Movement Speed",
        abbv: "MOVE",
        type: "stat",
    },
    MANA_RECOVERY: {
        name: "Mana Recovery",
        abbv: "MP REGEN",
        type: "stat",
    },
    SAFE_ZONE_MOVEMENT_SPEED: {
        name: "Safe Zone Movement Speed",
        abbv: "SAFE MOVE",
        type: "stat",
    },
    STRENGTH_PERCENT: {
        name: "% Strength",
        abbv: "% STR",
        type: "percent",
    },
    AGILITY_PERCENT: {
        name: "% Agility",
        abbv: "% AGI",
        type: "percent",
    },
    INTELLECT_PERCENT: {
        name: "% Intellect",
        abbv: "% INT",
        type: "percent",
    },
    VITALITY_PERCENT: {
        name: "% Vitalty",
        abbv: "% VIT",
        type: "percent",
    },
    PHYSICAL_DAMAGE_MIN_PERCENT: {
        name: "% Physical Damage (Min)",
        abbv: "% PDMG (Min)",
        type: "percent",
        minmax: 'PHYSICAL_DAMAGE_MINMAX_PERCENT',
        mxt: 'min',
    },
    PHYSICAL_DAMAGE_MAX_PERCENT: {
        name: "% Physical Damage (Max)",
        abbv: "% PDMG (Max)",
        type: "percent",
        minmax: 'PHYSICAL_DAMAGE_MINMAX_PERCENT',
        mxt: 'max',
    },
    MAGICAL_DAMAGE_MIN_PERCENT: {
        name: "% Magic Damage (Min)",
        abbv: "% MDMG (Min)",
        type: "percent",
        minmax: 'MAGICAL_DAMAGE_MINMAX_PERCENT',
        mxt: 'min',
    },
    MAGICAL_DAMAGE_MAX_PERCENT: {
        name: "% Magic Damage (Max)",
        abbv: "% MDMG (Max)",
        type: "percent",
        minmax: 'MAGICAL_DAMAGE_MINMAX_PERCENT',
        mxt: 'max',
    },
    PHYSICAL_DEFENSE_PERCENT: {
        name: "% Physical Defense",
        abbv: "% PDEF",
        type: "percent",
    },
    MAGICAL_DEFENSE_PERCENT: {
        name: "% Magic Defense",
        abbv: "% MDEF",
        type: "percent",
    },
    PARALYZE_PERCENT: {
        name: "% Paralyze",
        abbv: "% PARA",
        type: "percent",
    },
    PARALYZE_RESIST_PERCENT: {
        name: "% Paralyze Resist",
        abbv: "% PARA RESIST",
        type: "percent",
    },
    CRITICAL_PERCENT: {
        name: "% Critical",
        abbv: "% CRIT",
        type: "percent",
    },
    CRITICAL_RESIST_PERCENT: {
        name: "% Critical Resist",
        abbv: "% CRIT RESIST",
        type: "percent",
    },
    STUN_PERCENT: {
        name: "% Stun",
        abbv: "% STUN",
        type: "percent",
    },
    STUN_RESIST_PERCENT: {
        name: "% Stun Resist",
        abbv: "% STUN RESIST",
        type: "percent",
    },
    MOVEMENT_SPEED_PERCENT: {
        name: "% Movement Speed",
        abbv: "% MOVE",
        type: "percent",
    },
    HP_PERCENT: {
        name: "% Health",
        abbv: "% HP",
        type: "percent",
    },
    MP_PERCENT: {
        name: "% Mana",
        abbv: "% MP",
        type: "percent",
    },
    MANA_RECOVERY_PERCENT: {
        name: "% Mana Recovery",
        abbv: "% MP REGEN",
        type: "percent",
    },
    FINAL_DAMAGE_PERCENT: {
        name: "% Final Damage",
        abbv: "% FD",
        type: "percent",
    },
    SAFE_ZONE_MOVEMENT_SPEED_PERCENT: {
        name: "% Safe Zone Movement Speed",
        abbv: "% SAFE MOVE",
        type: "percent",
    },
    PHYSICAL_DAMAGE_MINMAX_PERCENT: {
        name: "% Physical Damage",
        abbv: "% PDMG",
        type: "percent",
        combined: true,
        children: [
            "PHYSICAL_DAMAGE_MIN_PERCENT",
            "PHYSICAL_DAMAGE_MAX_PERCENT",
        ],
    },
    MAGICAL_DAMAGE_MINMAX_PERCENT: {
        name: "% Magic Damage",
        abbv: "% MDMG",
        type: "percent",
        combined: true,
        children: [
            "MAGICAL_DAMAGE_MIN_PERCENT",
            "MAGICAL_DAMAGE_MAX_PERCENT",
        ],
    },
    CRITICAL_DAMAGE: {
        name: "Critical Damage",
        abbv: "CRIT DMG",
        type: "stat",
    },
    CRITICAL_DAMAGE_PERCENT: {
        name: "% Critical Damage",
        abbv: "% CRIT DMG",
        type: "percent",
    },
    ONE_HUNDRED_SEVEN: {
        name: "107",
        abbv: "107",
        type: "stat",
        obsolete: true
    },
    STAT: {
        name: "STR/AGI/INT/VIT",
        abbv: "STAT",
        type: "stat",
        children: [
            "STRENGTH",
            "AGILITY",
            "INTELLECT",
            "VITALITY"
        ]
    },
    ELE: {
        name: "Elemental ATK",
        abbv: "ELE",
        type: "percent",
        children: [
            "LIGHT_ATTACK",
            "DARK_ATTACK",
            "FIRE_ATTACK",
            "ICE_ATTACK"
        ]
    }
};

const UnknownStateMap = {
    "88": "ELE",
    "37": "STAT",
};

export default {
    getStateInfo(state) {
        let stateId = -1;
        if (typeof state === "object") {
            stateId = state.id;
            state = state.state;
        }

        let unknownOverride = -1;
        if (state.toUpperCase() == "UNKNOWN") {
            var repl = UnknownStateMap[String(stateId)];
            if (repl) {
                state = repl;
            }
        }

        let n = state.toUpperCase();
        if (STATES[n]) {
            return STATES[n];
        } else {
            return {
                name: state,
                abbv: state,
                type: 'stat'
            };
        }
    },
    joinStatSet(stats, statKey) {
        if (!statKey) {
            statKey = "min";
        }
        let ret = {};
        for (let k in stats) {
            let stat = stats[k];
            let val = Number(stat[statKey]);
            let state = stat.state;
            if (state.toUpperCase() == "UNKNOWN") {
                var repl = UnknownStateMap[String(stat.id)];
                if (repl) {
                    state = repl;

                }
            }
            let info = this.getStateInfo(state);
            if (state === "PHYSICAL_DAMAGE_MINMAX") {
                if (ret.PHYSICAL_DAMAGE_MIN) {
                    ret.PHYSICAL_DAMAGE_MIN += val;
                } else {
                    ret.PHYSICAL_DAMAGE_MIN = val;
                }
                if (ret.PHYSICAL_DAMAGE_MAX) {
                    ret.PHYSICAL_DAMAGE_MAX += val;
                } else {
                    ret.PHYSICAL_DAMAGE_MAX = val;
                }
            } else if (state === "MAGICAL_DAMAGE_MINMAX") {
                if (ret.MAGICAL_DAMAGE_MIN) {
                    ret.MAGICAL_DAMAGE_MIN += val;
                } else {
                    ret.MAGICAL_DAMAGE_MIN = val;
                }
                if (ret.MAGICAL_DAMAGE_MAX) {
                    ret.MAGICAL_DAMAGE_MAX += val;
                } else {
                    ret.MAGICAL_DAMAGE_MAX = val;
                }
            } else if (state === "PHYSICAL_DAMAGE_MINMAX_PERCENT") {
                if (ret.PHYSICAL_DAMAGE_MIN_PERCENT) {
                    ret.PHYSICAL_DAMAGE_MIN_PERCENT += val;
                } else {
                    ret.PHYSICAL_DAMAGE_MIN_PERCENT = val;
                }
                if (ret.PHYSICAL_DAMAGE_MAX_PERCENT) {
                    ret.PHYSICAL_DAMAGE_MAX_PERCENT += val;
                } else {
                    ret.PHYSICAL_DAMAGE_MAX_PERCENT = val;
                }
            } else if (state === "MAGICAL_DAMAGE_MINMAX_PERCENT") {
                if (ret.MAGICAL_DAMAGE_MIN_PERCENT) {
                    ret.MAGICAL_DAMAGE_MIN_PERCENT += val;
                } else {
                    ret.MAGICAL_DAMAGE_MIN_PERCENT = val;
                }
                if (ret.MAGICAL_DAMAGE_MAX_PERCENT) {
                    ret.MAGICAL_DAMAGE_MAX_PERCENT += val;
                } else {
                    ret.MAGICAL_DAMAGE_MAX_PERCENT = val;
                }
            } else if (state === "STAT") {
                ret.STRENGTH = (ret.STRENGTH ? ret.STRENGTH : 0) + val;
                ret.AGILITY = (ret.AGILITY ? ret.AGILITY : 0) + val;
                ret.INTELLECT = (ret.INTELLECT ? ret.INTELLECT : 0) + val;
                ret.VITALITY = (ret.VITALITY ? ret.VITALITY : 0) + val;
            } else if (state === "ELE") {
                ret.LIGHT_ATTACK = (ret.LIGHT_ATTACK ? ret.LIGHT_ATTACK : 0) + val;
                ret.DARK_ATTACK = (ret.DARK_ATTACK ? ret.DARK_ATTACK : 0) + val;
                ret.FIRE_ATTACK = (ret.FIRE_ATTACK ? ret.FIRE_ATTACK : 0) + val;
                ret.ICE_ATTACK = (ret.ICE_ATTACK ? ret.ICE_ATTACK : 0) + val;
            } else if (info.obsolete) {
                continue;
            } else {
                if (ret[state]) {
                    ret[state] += val;
                } else {
                    ret[state] = val;
                }
            }
        }

        return ret;
    },

    zipStatSets(setA, setB) {
        let ret = Object.assign({}, setA);
        for (let k in setB) {
            if (ret[k]) {
                ret[k] += setB[k];
            } else {
                ret[k] = setB[k];
            }
        }

        return ret;
    }

};
