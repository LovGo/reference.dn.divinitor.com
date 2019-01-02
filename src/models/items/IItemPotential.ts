import IItemState from './IItemState';

export default interface IItemPotential {
    id: number;
    potentialNumber: number;
    rate: number;
    gearScoreModifier: number;
    states: IItemState[];
    skill?: any; // TODO
}