//@ts-ignore
import * as icos from './lucid-svgs';
export function createEl(el: Element, type: ("svg"), cnt?: string, cls?: string, attr?: { [key: string]: string | number | boolean | null }, cls2?: string, attr2?: { [key: string]: string | number | boolean | null }): Element {
    if (type == "svg") {
        // let svg = el.createSvg("svg")
        // let pth = svg.createSvg("path")
        // if (cls) svg.addClasses(cls.split(" "))
        // if (cls2) pth.addClasses(cls2.split(" "))
        // if (attr) Object.keys(attr).forEach((key) => {
        //     if (typeof (attr[key]) == "string") svg.setAttribute(key, attr[key])
        // })
        // if (attr2) Object.keys(attr2).forEach((key) => {
        //     if (typeof (attr2[key]) == "string") svg.setAttribute(key, attr2[key])
        // })
        // svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
        // svg.setAttribute("width", "24")
        // svg.setAttribute("height", "24")
        // svg.setAttribute("viewBox", "0 0 24 24")
        // svg.setAttribute("fill", "none")
        // svg.setAttribute("stroke", "currentColor")
        // svg.setAttribute("stroke-width", "2")
        // svg.setAttribute("stroke-linecap", "round")
        // svg.setAttribute("stroke-linejoin", "round")
        // // if (cnt) pth.setAttribute("d", cnt)
        if (cnt && icos[cnt]) {
            let svg = icos.createElement(icos[cnt])
            el.appendChild(svg)
            if (cls) svg.addClasses(cls.split(" "))
            return svg
        }
    }
    return el
}