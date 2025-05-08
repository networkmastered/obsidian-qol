import { App, Component, Editor, MarkdownRenderer, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, requestUrl, Setting, TFile, TFolder, ToggleComponent } from 'obsidian'
import { USER_TIMINGS } from "main"

//@ts-ignore
export default function load(local_this) {
    //@ts-ignore
    local_this.registerDomEvent(window, "keyup", (evt) => {
        let edit = local_this.app.workspace.activeEditor
        if (edit && edit.editor && edit.file && edit.editor.hasFocus()) {
            if (!USER_TIMINGS.writing.files[edit.file.path]) {
                USER_TIMINGS.writing.files[edit.file.path] = { breakTime: 0, writeTime: 0, totalTime: 0, lastKeyPress: new Date().getTime() }
            } else USER_TIMINGS.writing.files[edit.file.path].lastKeyPress = new Date().getTime()
            if (evt.key == " ") {
                if (edit && edit.editor) {
                    if (local_this.settings.GrammerFix) {
                        let f = edit.editor.getCursor()
                        let v = edit.editor.getCursor()
                        v.ch -= 3
                        f.ch--
                        switch (edit.editor.getRange(v, f)) {
                            case "im":
                                f.ch--
                                edit.editor.replaceRange("I'", v, f)
                                f.ch++
                                break
                            case "Im":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "IM":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            // case "id":
                            // 	f.ch--
                            // 	edit.editor.replaceRange("I'", v, f)
                            // 	f.ch++
                            // 	break
                            // case "Id":
                            // 	f.ch--
                            // 	edit.editor.replaceRange("'", f)
                            // 	f.ch++
                            // 	break
                            // case "ID":
                            // 	f.ch--
                            // 	edit.editor.replaceRange("'", f)
                            // 	f.ch++
                            // 	break
                        }
                        v.ch--
                        switch (edit.editor.getRange(v, f).toLowerCase()) {
                            case "hes":
                                f.ch--
                                edit.editor.replaceRange("'", v, f)
                                f.ch++
                                break
                            case "hed":
                                f.ch--
                                edit.editor.replaceRange("'", v, f)
                                f.ch++
                                break
                            case "itd":
                                f.ch--
                                edit.editor.replaceRange("'", v, f)
                                f.ch++
                                break

                        }
                        v.ch--
                        switch (edit.editor.getRange(v, f).toLowerCase()) {
                            case "itll":
                                f.ch -= 2
                                edit.editor.replaceRange("'", f)
                                f.ch += 2
                                break
                            case "isnt":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "dont":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "wont":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "cant":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "whos":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "yall":
                                f.ch -= 2
                                edit.editor.replaceRange("'", f)
                                f.ch += 2
                                break
                            case "maam":
                                f.ch -= 2
                                edit.editor.replaceRange("'", f)
                                f.ch += 2
                                break
                            case "goin":
                                edit.editor.replaceRange("'", f)
                                break
                            case "doin":
                                edit.editor.replaceRange("'", f)
                                break
                            case "shes":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "youd":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "shed":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break

                        }
                        v.ch--
                        switch (edit.editor.getRange(v, f).toLowerCase()) {
                            case "youre":
                                f.ch -= 2
                                edit.editor.replaceRange("'", f)
                                f.ch += 2
                                break
                            case "youll":
                                f.ch -= 2
                                edit.editor.replaceRange("'", f)
                                f.ch += 2
                                break
                            case "wasnt":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "didnt":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "hadnt":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "shell":
                                f.ch -= 2
                                edit.editor.replaceRange("'", f)
                                f.ch += 2
                                break
                            case "arent":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "hasnt":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                        }
                        v.ch--
                        switch (edit.editor.getRange(v, f).toLowerCase()) {
                            case "oclock":
                                f.ch -= 5
                                edit.editor.replaceRange("'", f)
                                f.ch += 5
                                break
                            case "doesnt":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "werent":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "mustve":
                                f.ch -= 2
                                edit.editor.replaceRange("'", f)
                                f.ch += 2
                                break
                            case "mustnt":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "theyll":
                                f.ch -= 2
                                edit.editor.replaceRange("'", f)
                                f.ch += 2
                                break
                            case "havent":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "neednt":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "runnin":
                                edit.editor.replaceRange("'", f)
                                break
                        }
                        v.ch--
                        switch (edit.editor.getRange(v, f).toLowerCase()) {
                            case "wouldnt":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "mightnt":
                                f.ch--
                                edit.editor.replaceRange("'", f)
                                f.ch++
                                break
                            case "couldve":
                                f.ch -= 2
                                edit.editor.replaceRange("'", f)
                                f.ch += 2
                                break
                            case "wouldve":
                                f.ch -= 2
                                edit.editor.replaceRange("'", f)
                                f.ch += 2
                                break
                            case "mightve":
                                f.ch -= 2
                                edit.editor.replaceRange("'", f)
                                f.ch += 2
                                break
                        }
                        v.ch--
                        switch (edit.editor.getRange(v, f).toLowerCase()) {
                            case "shouldve":
                                f.ch -= 2
                                edit.editor.replaceRange("'", f)
                                f.ch += 2
                                break
                            case "shouldnt":
                                f.ch -= 2
                                edit.editor.replaceRange("'", f)
                                f.ch += 2
                                break
                        }
                    }
                }
            }
        }
    })
}