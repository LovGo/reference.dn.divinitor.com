
const STATES = {
    STRENGTH: {
        name: "Strength",
        abbv: "STR",
    },
    AGILITY: {
        name: "Agility",
        abbv: "AGI",
    },
    INTELLECT: {
        name: "Intellect",
        abbv: "INT",
    },
    VITALITY: {
        name: "Vitality",
        abbv: "VIT",
    },
    PHYSICAL_DAMAGE_MIN: {
        name: "Physical Damage (Min)",
        abbv: "PDMG (Min)",
    },
    PHYSICAL_DAMAGE_MAX: {
        name: "Physical Damage (Max)",
        abbv: "PDMG (Max)",
    },
    MAGICAL_DAMAGE_MIN: {
        name: "Magic Damage (Min)",
        abbv: "MDMG (Min)",
    },
    MAGICAL_DAMAGE_MAX: {
        name: "Magic Damage (Max)",
        abbv: "MDMG (Max)",
    },
    PHYSICAL_DEFENSE: {
        name: "Defense",
        abbv: "PDEF",
    },
    MAGICAL_DEFENSE: {
        name: "Magic Defense",
        abbv: "MDEF",
    },
    PARALYZE: {
        name: "Paralyze",
        abbv: "PARA",
    },
    PARALYZE_RESIST: {
        name: "Paralyze Resist",
        abbv: "PARA RESIST",
    },
    CRITICAL: {
        name: "Critical",
        abbv: "CRIT",
    },
    CRITICAL_RESIST: {
        name: "Critical Resist",
        abbv: "CRIT RESIST",
    },
    STUN: {
        name: "Stun",
        abbv: "STUN",
    },
    STUN_RESIST: {
        name: "Stun Resist",
        abbv: "STUN RESIST",
    },
    FIRE_ATTACK: {
        name: "Fire",
        abbv: "FIRE",
    },
    ICE_ATTACK: {
        name: "Ice",
        abbv: "ICE",
    },
    LIGHT_ATTACK: {
        name: "Light",
        abbv: "LIGHT",
    },
    DARK_ATTACK: {
        name: "Dark",
        abbv: "DARK",
    },
    FIRE_DEFENSE: {
        name: "Fire",
        abbv: "FIRE",
    },
    ICE_DEFENSE: {
        name: "Ice Defense",
        abbv: "ICE DEF",
    },
    LIGHT_DEFENSE: {
        name: "Light Defense",
        abbv: "LIGHT DEF",
    },
    DARK_DEFENSE: {
        name: "Dark Defense",
        abbv: "DARK DEF",
    },
    HP: {
        name: "HEALTH",
        abbv: "HP",
    },
    MANA: {
        name: "MANA",
        abbv: "MP",
    },
    TWENTY_SEVEN: {
        name: "27",
        abbv: "27",
    },
    FINAL_DAMAGE: {
        name: "Final Damage",
        abbv: "FD",
    },
    THIRTY: {
        name: "30",
        abbv: "30",
    },
    PHYSICAL_DAMAGE_MINMAX: {
        name: "Physical Damage",
        abbv: "PDMG",
    },
    MAGICAL_DAMAGE_MINMAX: {
        name: "Magic Damage",
        abbv: "MDMG",
    },
};

export default {
    getStateInfo(state) {
        if (typeof state === "object") {
            state = state.state;
        }

        let n = state.toUpperCase();
        if (STATES[n]) {
            return STATES[n];
        } else {
            return {
                name: state,
                abbv: state
            };
        }
    },
    joinStatSet(stats) {
        let ret = {};
        for (let k in stats) {
            let stat = stats[k];
            let val = Number(stat.min);
            let state = stat.state;
            if (stat.state === "PHYSICAL_DAMAGE_MINMAX") {
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
            } else if (stat.state === "MAGICAL_DAMAGE_MINMAX") {
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
            } else if (stat.state === "PHYSICAL_DAMAGE_MINMAX_PERCENT") {
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
            } else if (stat.state === "MAGICAL_DAMAGE_MINMAX_PERCENT") {
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
            } else {
                if (ret[state]) {
                    ret[state] += val;
                } else {
                    ret[state] = val;
                }
            }
        }

        return ret;
    }

};
