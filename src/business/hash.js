import { sha256 } from "js-sha256";

const hashString = (text) => {
    console.log(text, sha256(text))
    return sha256(text);    
}

export {hashString}
