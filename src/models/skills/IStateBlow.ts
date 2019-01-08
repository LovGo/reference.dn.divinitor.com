import ISkillEffect from './ISkillEffect';
import ISkillEffectValue from './ISkillEffectValue';
import ITypedMap from '../util/ITypedMap';
import { filters } from '@/filters/Filters';
import SkillProvider from '@/api/SkillProvider';

export default interface IStateBlow {
    name: string;
    describe?(effect: ISkillEffect, value?: ISkillEffectValue): string|IDescription|Promise<IDescription|null>|null;
}

export interface IDescription {
    text: string;
    appendDuration?: boolean;
}

function statIncreasePercent(statName: string, mod: number = 0): IStateBlow {
    return {
        name: `${statName} mod`,
        async describe(effect, value): Promise<IDescription|null> {
            if (value) {
                const split = value.value.split(";");
                let amount = Number(split[0]);
                let appliesTo = split[1] || null;
                if (!isNaN(amount)) {
                    amount += mod;
                    let incr = "increased";
                    if (amount < 0) {
                        incr = "decreased";
                        amount *= -1;
                    }

                    if (appliesTo) {
                        const applySplit = appliesTo.split(",");
                        const promises = (applySplit.map((v) => Number(v))
                            .filter((v) => !isNaN(v) && v != 1)
                            .map(async (v) => await SkillProvider.getSkill(v)));
                        const skills = await Promise.all(promises);
                        if (skills.length > 0) {
                            appliesTo = "during " + skills
                                .map((v) => v.name.message)
                                .join(", ");
                        } else {
                            appliesTo = null;
                        }
                    }

                    return {
                        text: `${statName} ${appliesTo ? appliesTo : ""} ${incr} by ${filters.percent(amount)}%`,
                        appendDuration: true,
                    };
                }
            }

            return null;
        },
    };
}

function statIncrease(statName: string, mod: number = 0): IStateBlow {
    return {
        name: `${statName} mod`,
        async describe(effect, value): Promise<IDescription|null> {
            if (value) {
                const split = value.value.split(";");
                let amount = Number(split[0]);
                let appliesTo = split[1] || null;
                if (!isNaN(amount)) {
                    amount += mod;
                    let incr = "increased";
                    if (amount < 0) {
                        incr = "decreased";
                        amount *= -1;
                    }

                    if (appliesTo) {
                        const applySplit = appliesTo.split(",");
                        const promises = (applySplit.map((v) => Number(v))
                            .filter((v) => !isNaN(v))
                            .map(async (v) => await SkillProvider.getSkill(v)));
                        const skills = await Promise.all(promises);
                        appliesTo = "during " + skills
                            .map((v) => v.name.message)
                            .join(", ");
                    }

                    return {
                        text: `${statName} ${appliesTo ? appliesTo : ""} ${incr} by ${amount}`,
                        appendDuration: true,
                    };
                }
            }

            return null;
        },
    };
}

function getBlow(id: number): IStateBlow|null {
    return Blows[id] || null;
}

export const Blows: ITypedMap<IStateBlow> = {
    2: {
        name: "Skill physical scaling",
        describe(effect, value) {
            if (value) {
                let amount = Number(value.value);
                if (!isNaN(amount)) {
                    amount += 1;
                    return {
                        text: `Skill physical damage multiplier becomes ${filters.percent(amount, 1)}%`,
                        appendDuration: true,
                    };
                }
            }

            return null;
        }
    },
    4: statIncreasePercent("Physical defense"),
    14: {
        name: "Mana",
        describe(effect, value) {
            if (value) {
                let amount = Number(value.value);
                if (!isNaN(amount)) {
                    return {
                        text: `${amount < 0 ? "Drains" : "Restores"} ${filters.percent((amount < 0 ? -1 : 1) * amount, 1)}% mana`,
                        appendDuration: true,
                    };
                }
            }

            return null;
        }
    },

    16: {
        name: "HP Adjustment",
        describe(effect, value) {
            if (value) {
                let amount = Number(value.value);
                if (!isNaN(amount)) {
                    return {
                        text: `${amount < 0 ? "Depletes" : "Heals"} ${filters.percent((amount < 0 ? -1 : 1) * amount, 1)}% HP`,
                        appendDuration: true,
                    };
                }
            }

            return null;
        }
    },

    25: statIncreasePercent("Animation speed"),

    29: {
        name: "Skill magical scaling",
        describe(effect, value) {
            if (value) {
                let amount = Number(value.value);
                if (!isNaN(amount)) {
                    amount += 1;
                    return {
                        text: `Skill magic damage multiplier becomes ${filters.percent(amount, 1)}%`,
                        appendDuration: true,
                    };
                }
            }

            return null;
        }
    },

    31: statIncreasePercent("Parrying chance"),

    34: statIncreasePercent("Light attack"),

    44: {
        name: "Dark Burn",
        describe(effect, value) {
            if (value) {
                let v = value.value;
                let split = v.split(";");
                let interval = Number(split[0]) + 1;
                let damage = Number(split[2]);

                return {
                    text: `Deal ${filters.thousands(damage)} dark damage every ${interval}s`,
                    appendDuration: true,
                };
            }

            return null;
        }
    },

    55: {
        name: "Health barrier",
        describe(effect, value) {
            if (value) {
                const v = value.value;
                const split = v.split(";");
                const hpPercent = Number(split[0]);
                const range = Number(split[1]);
                const unk1 = split[2];
                const unk2 = split[3];
                const unk3 = split[4];

                if (!isNaN(hpPercent) && !isNaN(range)) {
                    return {
                        text: `Grant a ${hpPercent}% of max HP shield within a ${range / 1000}m radius`,
                        appendDuration: true,
                    };
                }
            }

            return null;
        },
    },

    58: statIncreasePercent("Max HP"),

    61: {
        name: "Super armor increase",
        describe(effect, value) {
            if (value) {
                let param = Number(value.value);
                if (!isNaN(param)) {
                    return {
                        text: `Super armor increased by ${filters.thousands(param)}`,
                        appendDuration: true,
                    };
                }
            }

            return null;
        }
    },

    62: {
        name: "Apply layered action",
        describe(effect, value) {
            if (value) {
                return {
                    text: `Apply layered action effect ${value.value}`,
                    appendDuration: true,
                }
            }

            return null;
        },
    },

    69: {
        name: "Cleanse",
        describe(effect, value) {
            if (value) {
                return {
                    text: `Cleanse ${value.value} harmful effects`,
                    appendDuration: true,
                };
            }

            return null;
        }
    },

    70: {
        name: "Cannot move",
    },
    75: statIncrease("Movement speed"),
    76: statIncreasePercent("Movement speed"),

    83: {
        name: "Buff wipe",
        describe(effect, value) {
            return null;
        }
    },

    87: statIncreasePercent("STR"),
    88: statIncreasePercent("AGI"),
    89: statIncreasePercent("INT"),

    94: statIncreasePercent("Magic defense"),
    96: {
        name: "Skill Cooldown",
        describe(effect, value) {
            if (value) {
                let v = value.value;
                let split = v.split(";");
                let ratio = Number(split[0]);
                if (!isNaN(ratio)) {
                    ratio -= 1;

                    return {
                        text: ratio < 0 ? `Cooldowns reduced by ${filters.percent(-ratio)}%` : `Cooldowns increased by ${filters.percent(ratio)}%`,
                        appendDuration: true,
                    };
                }
            }

            return null;
        }
    },

    99: {
        name: "Invincibility",
        describe(effect: ISkillEffect, value?: ISkillEffectValue) {
            if (value && value.duration == 0) {
                return null;
            }

            return {
                text: "Invincible",
                appendDuration: true,
            };
        },
    },

    100: {
        name: "Apply graphical state effect",
        describe(effect, value) {
            if (value) {
                let stateEffectId = Number(value.value);

                // TODO
                let stateEffectName = `State effect ${stateEffectId}`;

                return {
                    text: `Apply ${stateEffectName} as a visual effect`,
                    appendDuration: true,
                }
            }

            return null;
        }
    },
    
    111: {
        name: "Reflect physical damage",
        describe(effect, value) {
            if (value) {
                const percent = Number(value.value);
                if (!isNaN(percent)) {
                    return `Reflect ${filters.percent(percent)}% of incoming physical damage`;
                }
            }

            return null;
        }
    },
    112: {
        name: "Reflect physical damage to projectile owner",
        describe(effect, value) {
            if (value) {
                const percent = Number(value.value);
                if (!isNaN(percent)) {
                    return `Reflect ${filters.percent(percent)}% of incoming projectile physical damage back to caster`;
                }
            }

            return null;
        }
    },
    113: {
        name: "Reflect magic damage",
        describe(effect, value) {
            if (value) {
                const percent = Number(value.value);
                if (!isNaN(percent)) {
                    return `Reflect ${filters.percent(percent)}% of incoming magic damage`;
                }
            }

            return null;
        }
    },
    114: {
        name: "Reflect magic damage to projectile owner",
        describe(effect, value) {
            if (value) {
                const percent = Number(value.value);
                if (!isNaN(percent)) {
                    return `Reflect ${filters.percent(percent)}% of incoming projectile magic damage back to caster`;
                }
            }

            return null;
        }
    },

    126: statIncreasePercent("Critical Resist"),

    132: {
        name: "Generate Threat",
        describe(effect, value) {
            if (value) {
                let param = Number(value.value);
                if (!isNaN(param)) {
                    return {
                        text: `Caster's threat to unit increased by ${filters.thousands(param, undefined, true)}`,
                        appendDuration: true,
                    };
                }
            }

            return null;
        }
    },

    134: statIncreasePercent("Physical damage taken", -1),
    135: statIncreasePercent("Magic damage taken", -1),

    139: statIncreasePercent("MP consumption"),

    141: {
        name: "Healing effectiveness",
        describe(effect, value) {
            if (value && value.duration > 0) {
                let ratio = Number(value.value);
                if (!isNaN(ratio)) {
                    ratio -= 1;
                    if (ratio > 0) {
                        return {
                            text: `Incoming healing effects increased by ${filters.percent(ratio)}%`,
                            appendDuration: true,
                        }
                    } else if (ratio < 0) {
                        return {
                            text: `Incoming healing effects decreased by ${filters.percent(-ratio)}%`,
                            appendDuration: true,
                        }
                    }
                }
            }

            return null;
        }
    },

    144: {
        name: "Movement/Action/Cooldown Speed",
        describe(effect, value) {
            if (value) {
                let v = value.value;
                let split = v.split(";");
                let slows = [0, 0, 0];
                for (let i = 0; i < split.length; ++i) {
                    let param = Number(split[i]);
                    if (!isNaN(param)) {
                        slows[i] = param;
                    }
                }

                let prefix = ["movement", "action", "cooldown"];
                let mods = slows.map((v, i) => (v == 0 ? null : `${prefix[i]} speed ${v < 0 ? 'reduced' : 'increased'} by ${filters.percent((v < 0 ? -1 : 1) * v)}%`))
                    .filter((v) => v != null);

                return {
                    text: "Target " + mods.join("; "),
                    appendDuration: true,
                };
            }

            return null;
        },
    },

    159: {
        name: "Execute damage",
        describe(effect, value) {
            if (value) {
                let v = value.value;
                let split = v.split(";");
                let thresholdHpPercent = Number(split[0]);
                let bonusDamagePerPercentHpUnderThreshold = Number(split[1]);

                return {
                    text: `Upon striking an enemy under ${filters.percent(thresholdHpPercent)}% HP, deal ${filters.percent(bonusDamagePerPercentHpUnderThreshold)}% skill damage per 1% missing HP below ${filters.percent(thresholdHpPercent)}% as additional damage`,
                };
            }

            return null;
        }
    },

    166: {
        name: "Increased damage against afflicted targets",
        describe(effect, value) {
            if (value) {
                let v = value.value;
                let split = v.split(";");
                if (split.length >= 2) {
                    let effectId = Number(split[0]);
                    let bonus = Number(split[1]);

                    let blow = getBlow(effectId);
                    let blowName = blow ? blow.name : `Effect ${effectId}`;

                    return {
                        text: `Attacks against targets afflicted with ${blowName} take ${filters.percent((bonus < 0 ? -1 : 1) * bonus)}% ${bonus < 0 ? "less" : "more"} damage`,
                        appendDuration: true,
                    };
                }
            }
            return null;
        }
    },

    169: {
        name: "Increased damage when critting",
        describe(effect, value) {
            if (value) {
                let v = value.value;
                let split = v.split(";");
                if (split.length >= 2) {
                    let rate = Number(split[0]);
                    let bonus = Number(split[1]);

                    return {
                        text: `Critical attacks deal ${filters.percent((bonus < 0 ? -1 : 1) * bonus)}% ${bonus < 0 ? "less" : "more"} damage ${filters.percent(rate)}% of the time`,
                        appendDuration: true,
                    };
                }
            }
            return null;
        }
    },

    173: {
        name: "Ice Barrier",
        describe(effect, value) {
            if (value) {
                let v = value.value;
                if (v.startsWith("[")) {
                    let split = v.split("][");
                    let param1 = split[0].substring(1);
                    split = param1.split(";");
                    let scaling = Number(split[0]);
                    return {
                        text: `Create a shield with ${filters.percent(scaling)}% of your magic damage as health`,
                        appendDuration: true,
                    };
                }
            }

            return null;
        },
    },

    179: {
        name: "On Hit Action",
        describe(effect, value) {
            if (value) {
                let v = value.value;
                let split = v.split(",");
                let list = split.join(", then ");
                return {
                    text: `Upon striking a target, change action to ${list}`,
                }
            }

            return null;
        }
    },

    218: {
        name: "Binding",
        describe(effect, value) {
            if (value) {
                let v = value.value;
                let split = v.split(";");

                let rate = Number(split[0]);
                let durability = Number(split[1]);
                let action = split[2];
                let canAD = split[3] == "1";

                return {
                    text: `${filters.percent(rate)}% chance to bind, with action ${action}, ${canAD ? "A-D to escape" : ""}`,
                    appendDuration: true,
                }
            }

            return null;
        },
    },

    232: {
        name: "Transform",
        async describe(effect, value) {
            if (value) {
                let v = value.value;
                let split = v.split(";");

                let monsterId = Number(split[0]);
                let initialAction = split[1];

                // todo
                let monsterName = `Monster ${monsterId}`;

                return {
                    text: `Transform into ${monsterName}, initial action "${initialAction}"`,
                    appendDuration: true,
                };
            }

            return null;
        }
    },

    233: {
        name: "Kill",
        describe(effect, value) {
            if (value) {
                let v = value.value;
                let killPlayers = v == "1";

                return {
                    text: `Guaranteed kills${killPlayers ? " players" : " summons"}`,
                    appendDuration: true,
                };
            }

            return null;
        },
    },

    251: statIncreasePercent("Critical rate"),

    291: {
        name: "All active skill cooldown refund",
        describe(effect, value) {
            if (value) {
                return {
                    text: `Refund ${value.value}s cooldown to all active skills`,
                    appendDuration: true,
                };
            }

            return null;
        }
    },

    301: {
        name: "DPS bar",
        async describe(effect, value) {
            if (value) {
                let params = value.value;
                let split = params.split(";");
                
                let type = Number(split[0]);
                let durability = Number(split[1]);
                let skillIdIfBroken = Number(split[2]);
                let unkA = split[3];
                let unkB = split[4];
                let unkC = split[5];

                let skill = await SkillProvider.getSkill(skillIdIfBroken);

                let duration = value.duration == 0 ? "" : ` for ${filters.milliseconds(value.duration)}s`;

                let typeStr = `type ${type}`;
                switch (type) {
                    case 1: typeStr = "blue"; break;
                    case 3: typeStr = "red"; break;
                }

                return {
                    text: `Display a ${typeStr} DPS bar with a durability of ${filters.thousands(durability)}${duration}. Use ${skill.name.message} upon breaking. ${unkA},${unkB},${unkC}`,
                    appendDuration: false,
                }
            }

            return null;
        }
    },

    306: statIncreasePercent("Elemental resistance"),

    345: {
        name: "Ignore bubble consumption",
        async describe(effect, value) {
            if (value) {
                let params = value.value;
                let split = params.split(";");

                let freeSkills = split.map((v) => Number(v));

                let freeSkillNames = (await Promise.all(freeSkills
                    .map(async (v) => await SkillProvider.getSkill(v))
                    .map(async (v) => (await v).name.message)))
                    .filter((v, i, s) => s.indexOf(v) == i);


                return {
                    text: `${freeSkillNames.join(", ")} ${freeSkillNames.length == 1 ? "does" : "do"} not require bubbles`,
                    appendDuration: true,
                };
            }

            return null;
        }
    },

    349: {
        name: "Passive bubble generation",
        async describe(effect, value) {
            if (value) {
                let params = value.value;
                let split = params.split(";");

                let interval = Number(split[0]);
                let bubbleId = Number(split[1]);

                // todo load bubble info
                let bubbleName = `Bubble ${bubbleId}`;

                return {
                    text: `Every ${filters.milliseconds(interval)}s, gain 1x ${bubbleName}`,
                }
            }
            return null;
        }
    },

    372: {
        name: "Increase stat by percent of another stat",
        describe(effect, value) {
            if (value) {
                let params = value.value;
                let split = params.split(";");
                let sourceStat = Number(split[0]);
                let rate = Number(split[1]);
                let destStat = Number(split[2]);

                function statToName(id: number): string {
                    switch (id) {
                        case 0: return "STR";
                        case 2: return "INT";
                        case 5: return "PDMG";
                        case 6: return "MDMG";
                        case 7: return "PDEF";
                    }

                    return `Stat ${id}`;
                };

                // todo
                let sourceStatName = statToName(sourceStat);
                let destStatName = statToName(destStat);

                return {
                    text: `Convert ${filters.percent(rate)}% of ${sourceStatName} to ${destStatName}`,
                    appendDuration: true,
                };
            }

            return null;
        },
    },

    389: statIncreasePercent("Final damage"),

    390: {
        name: "Apply highest stat",
        describe(effect, value) {
            if (value) {
                return {
                    text: `Highest of stats [${value.value.split(";").join(", ")}] is used`,
                    appendDuration: true,
                };
            }

            return null;
        }
    },

    356: {
        name: "Skill cooldown reduction on skill hit",
        async describe(effect, value) {
            if (value) {
                let params = value.value;
                let split = params.split(";");
                let recoveredSkills = split[0].split(",").map((v) => Number(v));
                let recoverySkills = split[1].split(",").map((v) => Number(v));
                let recoveryAmount = Number(split[2]);

                let recoveredSkillNames = (await Promise.all(recoveredSkills
                    .map(async (v) => await SkillProvider.getSkill(v))
                    .map(async (v) => (await v).name.message)));
                
                let recoverySkillNames = (await Promise.all(recoverySkills
                    .map(async (v) => await SkillProvider.getSkill(v))
                    .map(async (v) => (await v).name.message)));

                return {
                    text: `Reduces the cooldown${recoveredSkillNames.length == 1 ? "" : "s"} of ${recoveredSkillNames.join("/")} by ${filters.milliseconds(recoveryAmount)}s when ${recoverySkillNames.join("/")} hit${recoverySkillNames.length == 1 ? "s" : ""}`,
                };
            }

            return null;
        }
    },

    404: statIncreasePercent("Critical damage"),
};
