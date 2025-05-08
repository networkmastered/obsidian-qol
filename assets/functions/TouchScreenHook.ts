import { Notice, TFile } from 'obsidian'
import { GrabWorkspaceElement } from 'main'

let hooked: Array<Element> = []
let fileExplorerElement: Element | undefined = undefined
//@ts-ignore
export default function HookTouchOnFiles(local_this) {
    let fm = GrabWorkspaceElement()
    if (local_this.settings.TouchScreen && fm && fm.view && fm.view.fileItems) {
        Object.keys(fm.view.fileItems).forEach((key) => {
            let el = fm.view.fileItems[key].coverEl
            if (hooked.includes(el)) return
            if (el && el.parentElement && el.parentElement.parentElement && el.parentElement.parentElement.parentElement && el.parentElement.parentElement.parentElement.hasClass("nav-files-container")) fileExplorerElement = el.parentElement.parentElement.parentElement
            let dragging = false
            //@ts-ignore
            let highl = []
            let x = 0
            let y = 0
            let st = 0
            let truestart = false
            let wasActive = false
            let onRoot = false
            hooked.push(el)
            local_this.registerEvent(
                el.addEventListener("touchstart", (e: TouchEvent) => {
                    if (el && el.parentElement && el.parentElement.parentElement && el.parentElement.parentElement.parentElement && el.parentElement.parentElement.parentElement.hasClass("nav-files-container")) fileExplorerElement = el.parentElement.parentElement.parentElement
                    if (!local_this.settings.TouchScreen || !local_this.settings.TouchScreenFiles) return
                    x = e.touches[0].clientX
                    y = e.touches[0].clientY
                    dragging = true
                    st = new Date().getTime()
                    onRoot = false
                })
            )
            local_this.registerEvent(
                el.addEventListener("touchmove", (e: TouchEvent) => {
                    if (!local_this.settings.TouchScreen || !dragging || !local_this.settings.TouchScreenFiles) return
                    if (new Date().getTime() - st < 400) {
                        if (Math.abs(e.touches[0].clientY - y) > 100) {
                            x = 0
                            y = 0
                            dragging = false
                            st = 0
                        }
                        return
                    }
                    if (!truestart) {
                        if (el.hasClass("is-active")) wasActive = true
                        el.addClass("is-being-dragged")
                        if (fileExplorerElement) fileExplorerElement.addClass("qol-scroll-disable")
                        truestart = true
                    }
                    //@ts-ignore
                    highl.forEach((fol) => {
                        if (fol) {
                            fol.removeClass("is-being-dragged-over")
                        }
                    })
                    highl = []
                    if (dragging) {
                        el.style.setProperty("right", (x - e.touches[0].clientX) + "px")
                        el.style.setProperty("bottom", (y - e.touches[0].clientY) + "px")
                        let els = document.elementsFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
                        let foundfold = false
                        els.forEach((fol) => {
                            if (fol && fol.hasClass("nav-folder-title")) {
                                fol.addClass("is-being-dragged-over")
                                highl.push(fol)
                                foundfold = true
                            }
                        })
                        if (!foundfold) {
                            els.forEach((fol) => {
                                if (fol && fol.hasClass("tree-item-children")) {
                                    //@ts-ignore
                                    let ofol = fol.parentElement.getElementsByClassName("tree-item-self")[0]
                                    ofol.addClass("is-being-dragged-over")
                                    highl.push(ofol)
                                    foundfold = true
                                }
                            })
                        }
                        if (!foundfold) { onRoot = true } else { onRoot = false }
                    }
                })
            )
            local_this.registerEvent(
                el.addEventListener("touchend", (e: DragEvent) => {
                    if (fileExplorerElement) fileExplorerElement.removeClass("qol-scroll-disable")
                    let initial = local_this.app.vault.getFileByPath(el.getAttribute("data-path"))
                    if (initial) {
                        if (onRoot) {
                            let probe = local_this.app.vault.getFileByPath(initial.name)
                            if (!probe) {
                                if (!local_this.settings.TouchScreenFilesWarn && !confirm("Are you sure you want to move '" + initial.name + "' to the root?")) return
                                local_this.app.vault.copy(initial, "/" + initial.name).then((file: TFile) => {
                                    if (file && initial) local_this.app.vault.delete(initial)
                                    new Notice("File moved to: " + file.path)
                                })
                            } else {
                                new Notice("Cannot move, file already exists.")
                            }
                        } else {
                            //@ts-ignore
                            if (highl[0]) {
                                //@ts-ignore
                                let tgt = highl[0]
                                let fm = GrabWorkspaceElement()
                                if (fm && tgt && tgt.getAttribute("data-path") && el && el.getAttribute("data-path")) {
                                    if (tgt && tgt.getAttribute("data-path")) {
                                        Object.keys(fm.view.fileItems).forEach((key) => {
                                            if (key == tgt.getAttribute("data-path")) {
                                                let probe = local_this.app.vault.getFileByPath(tgt.getAttribute("data-path") + "/" + initial.name)
                                                if (!probe || (probe.path != initial.path)) { //stop user re-dragging into same destination with the "Cannot move notice"
                                                    if (!probe) {
                                                        local_this.app.vault.copy(initial, tgt.getAttribute("data-path") + "/" + initial.name).then((file: TFile) => {
                                                            if (file && initial) local_this.app.vault.delete(initial)
                                                            new Notice("File moved to: " + file.path)
                                                        })
                                                    } else {
                                                        new Notice("Cannot move, file already exists.")
                                                    }
                                                }
                                            }
                                        })
                                    }

                                }
                            }
                        }
                    }
                    //@ts-ignore
                    highl.forEach((fol) => {
                        if (fol) {
                            fol.removeClass("is-being-dragged-over")
                        }
                    })
                    highl = []
                    el.style.removeProperty("right")
                    el.style.removeProperty("bottom")
                    el.removeClass("is-being-dragged")
                    if (wasActive) el.addClass("is-active")
                    wasActive = false
                    dragging = false
                    st = 0
                    truestart = false
                })
            )
        })
    }
}