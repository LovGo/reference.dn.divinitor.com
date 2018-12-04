import IUiStringMessage from '../uistring/IUiStringMessage';
import { ClassType } from './ClassType';
import IJobStub from './IJobStub';

export default interface IJob extends IJobStub {
    mainStatString: IUiStringMessage;
    jobDescription: IUiStringMessage;
    jobNumber: number;
    baseClass: number;
    parentJobId: number;
    parentJob: IJob|null;
    classType: ClassType;
    hasAwakening: boolean;
    // movieUrl: string|null;
}
