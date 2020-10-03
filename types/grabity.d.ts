declare module 'grabity' {
    export interface GrabItResult {
        title: string,
        description: string,
        image: string,
        favicon: string
    }

    export interface GrabResult{
        [key:string]:string,
        favicon: string
    }

    export const grabIt: (url: string) => Promise<GrabItResult>
    export const grab: (url: string) => Promise<GrabResult>
}
