import { ensureRegion } from "@/api/RegionProvider";
import { ApiHttpClient } from "@/globals";

export default {

    stateEffects: {
        "25": {
            name: "Action speed",
            desc: "Action speed/frame rate"
        },
        "41": {
            name: "Frozen",
            desc: "Actor is frozen and cannot act"
        },
        "42": {
            name: "Burned",
            desc: "Actor is on fire and taking damage",
        },
        "43": {
            name: "Shocked",
            desc: "Actor is electrocuted and will intermittently suffer from electric shocks"
        },
        "44": {
            name: "Addicted",
            desc: ""
        },
        "45": {
            name: "Asleep",
            desc: "Puts the unit to sleep"
        },
        "66": {
            name: "Threat",
            desc: "Increases threat towards the caster"
        },
        "67": {
            name: "Disable active skills",
            desc: "Prevent the usage of active skills"
        },
        "70": {
            name: "Immobilized",
            desc: "Unable to move"
        },
        "71": {
            name: "Disarmed",
            desc: "Unable to act"
        },
        "76": {
            name: "Movement speed",
            desc: "Adjust movement speed by a ratio"
        },
        "78": {
            name: "No mana cost",
            desc: "Removes mana consumption"
        },
        "79": {
            name: "Super Armor break",
            desc: "Breaks super armor (set to 0)"
        },
        "83": {
            name: "Disable buff effect",
            desc: "Disables the provided buffs"
        },
        "84": {
            name: "Forced state",
            desc: "Force a certain state"
        },
        "86": {
            name: "Team switch",
            desc: "Changes the team the actor is on (friend becomes foe)"
        },
        "115": {
            name: "Addiction explosion",
            desc: ""
        },
        "116": {
            name: "Ignite",
            desc: "Burn explosion"
        },
        "117": {
            name: "Shatter",
            desc: "Ice explosion"
        },
        "118": {
            name: "Detonate",
            desc: "Electric explosion"
        },
        "132": {
            name: "Provoke",
            desc: "Absolute threat target change"
        },
        "133": {
            name: "Stunned",
            desc: "Ignore stun stats and apply stun based on a fixed rate"
        },
        "136": {
            name: "Influzena",
            desc: ""
        },
        "144": {
            name: "Frostbitten",
            desc: "Reduce action and movement speed and reduce ice resist"
        },
        "146": {
            name: "Time Stopped",
            desc: "Completely stops time (frame rate 0), highest priority action speed effect"
        },
        "148": {
            name: "Aggro reset",
            desc: "Force aggro reset (monster targets only)"
        },
        "162": {
            name: "SA break (Breaking Point)",
            desc: "Break super armor on crits"
        },
        "174": {
            name: "Buff stolen",
            desc: "Steal the specified number of buffs from the target and grant them to the caster"
        },
        "175": {
            name: "Knockback",
            desc: "Knocks back or pushes the target"
        },
        "206": {
            name: "Action change ratio",
            desc: "The rate at which an action will be performed on-hit"
        },
        "220": {
            name: "Meteorite monster status",
            desc: "Effect applied by meteorite monsters in Lotus Marsh"
        },
        "228": {
            name: "Hit signal invalidated",
            desc: "Ignore the effect of the given hit signal at a certain rate"
        },
        "247": {
            name: "Kali Puppet effect",
            desc: "Effect applied by Kali Puppet skill"
        }
    },

    getStateEffectName(stateEffectId) {
        let fx = this.stateEffects[String(stateEffectId)];
        if (!fx) {
            return "Unknown" + stateEffectId;
        }

        return fx.name;
    }
};
