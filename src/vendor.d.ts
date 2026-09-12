declare module "xml2js" {
    export class Parser {
        constructor(options?: Record<string, unknown>);
        parseStringPromise(xml: string): Promise<any>;
    }

    const xml2js: {
        Parser: typeof Parser;
    };

    export default xml2js;
}
