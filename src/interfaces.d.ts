import Dummy from "./helpers/dummy";

declare global {
    interface Window {
        appInsights: any;
    }
}
