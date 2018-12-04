import IUiStringMessage from '../../uistring/IUiStringMessage';
import { ClassType } from './../ClassType';

export default interface IJobApiResponse {
    id: number;
    name: IUiStringMessage;
    iconIndex: number;
    mainStatString: IUiStringMessage;
    jobDescription: IUiStringMessage;
    jobNumber: number;
    baseClass: number;
    parentJobId: number;
    parentJob: IJobApiResponse|null;
    classType: ClassType;
    hasAwakening: boolean;
    // movieUrl: string|null;
}
