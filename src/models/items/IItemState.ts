import { ItemState } from './ItemEnums';
import ITypedMap from '../util/ITypedMap';

export default interface IItemState {
    id: number;
    state: ItemState;
    value: number;
}

const deconstructable: ITypedMap<ItemState[]> = {
    [ItemState[ItemState.PHYSICAL_DAMAGE_MINMAX]]: [
        ItemState.PHYSICAL_DAMAGE_MIN,
        ItemState.PHYSICAL_DAMAGE_MAX,
    ],
    [ItemState[ItemState.PHYSICAL_DAMAGE_MINMAX_PERCENT]]: [
        ItemState.PHYSICAL_DAMAGE_MIN_PERCENT,
        ItemState.PHYSICAL_DAMAGE_MAX_PERCENT,
    ],
    [ItemState[ItemState.MAGICAL_DAMAGE_MINMAX]]: [
        ItemState.MAGICAL_DAMAGE_MIN,
        ItemState.MAGICAL_DAMAGE_MAX,
    ],
    [ItemState[ItemState.MAGICAL_DAMAGE_MINMAX_PERCENT]]: [
        ItemState.MAGICAL_DAMAGE_MIN_PERCENT,
        ItemState.MAGICAL_DAMAGE_MAX_PERCENT,
    ],
    [ItemState[ItemState.STR_AGI_INT_VIT]]: [
        ItemState.STRENGTH,
        ItemState.AGILITY,
        ItemState.INTELLECT,
        ItemState.VITALITY,
    ],
    [ItemState[ItemState.STR_AGI_INT_VIT_PERCENT]]: [
        ItemState.STRENGTH_PERCENT,
        ItemState.AGILITY_PERCENT,
        ItemState.INTELLECT_PERCENT,
        ItemState.VITALITY_PERCENT,
    ],
    [ItemState[ItemState.FIRE_ICE_LIGHT_DARK_ATTACK]]: [
        ItemState.FIRE_ATTACK,
        ItemState.ICE_ATTACK,
        ItemState.LIGHT_ATTACK,
        ItemState.DARK_ATTACK,
    ]
}

/**
 * Combines two sets of IItemStates and deduplicates entries
 * @param state1 The first set
 * @param state2 The second set
 */
export function zip(state1: IItemState[], state2?: IItemState[]): IItemState[] {
    const set: ITypedMap<IItemState> = {};
    const concatenated = state2 ? state1.concat(state2) : state1;
    for (let state of concatenated) {
        const key = ItemState[state.state];
        if (set[key]) {
            // Combine (duplicate entries)
            set[key].value += state.value;
        } else {
            // New entry
            set[key] = {
                id: state.id,
                state: state.state,
                value: state.value,
            };
        }
    }

    return Object.values(set);
}

/**
 * Deconstructs compound states into basic states
 * @param states The state set
 */
export function deconstruct(states: IItemState[]): IItemState[] {
    const ret: IItemState[] = [];
    const deconstructed: IItemState[] = [];

    for (let state of states) {
        const decon = deconstructable[ItemState[state.state]];
        if (decon) {
            for (let st of decon) {
                deconstructed.push({
                    id: st,
                    state: st,
                    value: state.value,
                });
            }
        } else {
            // Copy
            ret.push({...state});
        }
    }

    return zip(ret, deconstructed);
}
