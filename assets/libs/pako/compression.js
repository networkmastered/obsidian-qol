import inf from "./pako-inflate-trim"
import def from "./pako-deflate-trim"

// export function inflate(string) {
//     if (string) {
//         console.log(string)
//         let buf = Buffer.from(string, "base64")
//         console.log(buf)
//         let dfs = inf(new Uint8Array(buf))
//         console.log(dfs)
//         if (dfs) return new TextDecoder().decode(dfs)
//     }
//     throw new Error("failed")
// }
// export function deflate(string) {
//     if (string) {
//         console.log(string)
//         let dfs = def(string)
//         console.log(dfs)
//         if (dfs) return Buffer.from(dfs).toString("base64")
//     }
//     throw new Error("failed")
// }
let td = new TextDecoder()
let te = new TextEncoder()
export function inflate(string) {
    if (string) {
        return td.decode(inf(Buffer.from(string,"base64")))
    }
    throw new Error("failed")
}
export function deflate(string) {
    if (string) {
        return Buffer.from(def(te.encode(string))).toString('base64');
    }
    throw new Error("failed")
}