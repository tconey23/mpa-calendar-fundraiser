import { sha256 } from "js-sha256";

const hashString = (text) => {
    return sha256(text);    
}

export {hashString}
