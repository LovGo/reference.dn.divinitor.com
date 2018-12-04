import IUiStringMessage from '../uistring/IUiStringMessage';
import IIconInfo from '../util/IIconInfo';

export default interface IJobStub {
    id: number;
    name: IUiStringMessage;
    icon: IIconInfo;
}
