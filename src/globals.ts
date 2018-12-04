/**
 * Global instances, such as HTTP clients.
 */

import Axios from "axios";

export const ApiHttpClient = Axios.create();

export const GeneralHttpClient = Axios.create();