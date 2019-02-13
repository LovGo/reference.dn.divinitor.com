import ITypedMap from '@/models/util/ITypedMap';
import ISknParameter from './ISknParameter';

export default interface ISknEntry {
    name: string;
    fxName: string;
    alpha: number;
    enableAlphaBlend: boolean;
    parameters: ITypedMap<ISknParameter>;
}