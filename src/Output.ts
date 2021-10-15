
const ESCAPE_REGEX = /"/g;

/**
 * Class for serializing objects to a JSON string and escaping.
 */
export default class Output {

    /**
     * Stringify's the @param object and then optionally escapes
     * all double quotes using a backslash.
     * @param object to serialize and escape.
     * @param [escape] indicating whether the output should be escaped.
     * @returns the JSON string optionally escaped.
     */
       public static toJsonString(object: any, escape?: boolean): string {
        let privateKeyJson = JSON.stringify(object, null, 2);
        return escape ? privateKeyJson.replace(ESCAPE_REGEX, '\\\"') : privateKeyJson;
    }
}
