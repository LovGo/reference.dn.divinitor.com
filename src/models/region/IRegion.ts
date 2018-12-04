import ITypedMap from "../util/ITypedMap";
import IPatchConfigList from './IPatchConfigList';

export default interface IRegion {
    id: number;
    shortName: string;
    staticName: string;
    defaultLocale: string;
    displayNames: ITypedMap<string>;
    patchConfigList: IPatchConfigList;
    version: number;
    patchedTime: string;
};
