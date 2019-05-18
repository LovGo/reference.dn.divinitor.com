import Dummy from "./helpers/dummy";
import IRegion from "./models/region/IRegion";

declare global {
    interface Window {
        appInsights: any;
        STATIC_REGION: IRegion|null;
    }
}
