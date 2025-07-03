import { Editor, EditorChange, MarkdownFileInfo, MarkdownView, Notice, Plugin, requestUrl, setTooltip, WorkspaceLeaf } from 'obsidian'
import changelog from './assets/consts/changelog'
import settings from './assets/functions/buildSettings'
import markdownModal from './assets/functions/viewMarkDown'
import HookTouchOnFiles from "./assets/functions/TouchScreenHook"
import GrammerFixesInit from "./assets/functions/GrammerFixes"
import { classN, FileExplorer, visible } from "./assets/functions/fileExplorer"
// import { deflate, inflate } from "./assets/libs/pako/compression"

import strReplaceAll from "./assets/libs/replaceAll"


import Dict from "./assets/language/LanguageSelector"

export interface qolSettings {
    //Public Settings
    ExpandFolder: boolean
    FunctionBypass: boolean
    NonSymbChars: boolean
    AutoSpace: boolean
    AutoSpace_Double: boolean
    AutoShift: boolean
    GrammerFix: boolean

    TouchScreen: boolean
    TouchScreenFiles: boolean
    TouchScreenFilesWarn: boolean

    WriteTimer: boolean
    WriteTimerFormat: string

    UpdateChecking: boolean
    Language: string
    ChangeLog: boolean


    //Private Settings
    LastUpdateCheck: number
    LastUpdateLog: string


    //File Manager/Explorer
    FM_Enabled: boolean
    FM_Deletion_Warning: boolean
    FM_Full_Refreshing: boolean
}

const DEFAULT_SETTINGS: qolSettings = {
    // Public Settings
    ExpandFolder: false,
    FunctionBypass: false,
    NonSymbChars: false,
    AutoSpace: false,
    AutoSpace_Double: false,
    AutoShift: false,
    GrammerFix: false,

    TouchScreen: false,
    TouchScreenFiles: false,
    TouchScreenFilesWarn: true,

    WriteTimer: false,
    WriteTimerFormat: "%ws/%bs",

    UpdateChecking: true,
    Language: "EN",
    ChangeLog: true,


    // Private Settings
    LastUpdateCheck: 0,
    LastUpdateLog: "0.0.0",


    // File Manager/Explorer
    FM_Enabled: true,
    FM_Deletion_Warning: true,
    FM_Full_Refreshing: false,
}

export let USER_TIMINGS:
    {
        [key: string]: {
            [key: string]: {
                [key: string]: {
                    [key: string]: number
                }
            }
        }
    } = {
    writing: {
        files: {}
    }
}

export let mainSettings: qolSettings | undefined = undefined

export function GrabWorkspaceElement() {
    return this.app.workspace.getLeavesOfType('file-explorer')[0] || undefined
}

export default class qolPlugin extends Plugin {
    settings: qolSettings
    async FileExplorerTrigger() {
        const { workspace } = this.app;
        const leaf = workspace.getLeftLeaf(false);
        if (leaf) {
            await leaf.setViewState({
                type: classN,
                active: true,
            });
            workspace.revealLeaf(leaf);
        }
    }
    async onload() {
        await this.loadSettings()
        mainSettings = this.settings
        Dict("", this.settings.Language) // initilise cache

        this.registerView(
            classN,
            (leaf: WorkspaceLeaf) => {
                if (visible) { return new FileExplorer(leaf, true) }
                return new FileExplorer(leaf)
            }
        )

        // let qolFMB = this.addRibbonIcon('book-plus', Dict("FILE_EXPLORER_ICON_HOVER"), () => {
        // 	this.FileExplorerTrigger();
        // });
        if (this.settings.FM_Enabled) {
            // this.loadOpenFMTrigg(undefined, this.loadOpenFMTrigg, this.FileExplorerTrigger)
            // let cnt = 0
            // while (cnt<50) {
            //     cnt++
            //     try {
            //         this.FileExplorerTrigger()
            //         break
            //     } catch (_) {
            //  await new Promise((r)=>{setTimeout(r,100)})
            //     }
            // }
            window.setTimeout(() => {
                this.FileExplorerTrigger()
            }, 8000)
        }
        // setCB(() => {
        // 	if (visible) { qolFMB.addClass("qol-hide-file-folder"); setTooltip(qolFMB, Dict("FILE_EXPLORER_ICON_HOVER_DISABLED")) } else { qolFMB.removeClass("qol-hide-file-folder"); setTooltip(qolFMB, Dict("FILE_EXPLORER_ICON_HOVER")) }
        // })

        GrammerFixesInit(this)

        if (this.manifest.version != this.settings.LastUpdateLog && this.settings.ChangeLog) {
            this.settings.LastUpdateLog = this.manifest.version
            this.saveSettings()
            if (changelog[this.manifest.version]) {
                // new qolMarkdownModal(this.app, changelog[this.manifest.version]).open()
                new markdownModal(this.app, changelog[this.manifest.version]).open()
            } else {
                console.warn("QOL CHANGELOG: cannot find a log for the version: " + this.manifest.version)
            }
        }

        window.setTimeout(() => {
            if (this.settings.UpdateChecking && new Date().getTime() - this.settings.LastUpdateCheck > 1000 * 60 * 30) {
                this.settings.LastUpdateCheck = new Date().getTime()
                this.saveSettings()
                requestUrl("https://api.github.com/repos/networkmastered/obsidian-qol/releases/latest").then((res) => {
                    if (res.json) {
                        if (!res.json.draft && res.json.assets.length > 2 && res.json.body && res.json.body.length > 0 && res.json.author.id == res.json.assets[0].uploader.id && res.json.author.id == 174283352) {
                            if (res.json.tag_name != this.manifest.version) {
                                new Notice(`QOL: An update is avalible! You can update by checking for updates in the community plugins tab. (${this.manifest.version}->${res.json.tag_name})`, 10000)
                            }
                        }
                    }
                })
            }
        }, 3000)

        // const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
        // 	new Notice('This is a notice!')
        // })
        // ribbonIconEl.addClass('my-plugin-ribbon-class')

        const NonSymbolCountText = this.addStatusBarItem()
        NonSymbolCountText.setText('')
        // this.registerEvent(
        this.app.workspace.on("editor-change", (_: unknown, i: MarkdownView) => {
            if (i) {
                window.setTimeout(() => { //let file update also somewhat syncs with Obsidian's char count
                    if (this.settings.NonSymbChars && i && i.data) {
                        let rl = strReplaceAll(i.data, (/[A-Za-z]*/gm), "").length
                        NonSymbolCountText.setText((i.data.length - rl) + " non-symbols")
                    } else {
                        NonSymbolCountText.setText("")
                    }
                }, 100);
            }
        })
        // )
        // this.registerEvent(
        this.app.workspace.on("file-open", () => {
            if (this.settings.NonSymbChars) {
                window.setTimeout(async () => { //let file update also somewhat syncs with Obsidian's char count
                    let i = this.app.workspace.getActiveFile()
                    if (i) {
                        let str = await this.app.vault.read(i)
                        if (str) {
                            let rl = strReplaceAll(str, (/[A-Za-z]*/gm), "").length
                            NonSymbolCountText.setText((str.length - rl) + " non-symbols")
                        }
                    }
                }, 100);
            } else {
                NonSymbolCountText.setText("")
            }
        })
        // )


        const WriteBreakTimerText = this.addStatusBarItem()
        WriteBreakTimerText.setText('')

        let fsOnEditor: Editor | undefined = undefined
        this.registerInterval(window.setInterval(() => {
            if (this.settings.WriteTimer) {
                let edit = this.app.workspace.activeEditor
                if (edit && edit.editor && edit.file && edit.editor.hasFocus()) {
                    if (USER_TIMINGS.writing.files[edit.file.path]) {
                        if (new Date().getTime() - USER_TIMINGS.writing.files[edit.file.path].lastKeyPress < 5000) {
                            USER_TIMINGS.writing.files[edit.file.path].writeTime++
                        } else {
                            USER_TIMINGS.writing.files[edit.file.path].breakTime++
                        }
                        USER_TIMINGS.writing.files[edit.file.path].totalTime++
                        WriteBreakTimerText.setText(
                            strReplaceAll(
                                strReplaceAll(
                                    strReplaceAll(
                                        this.settings.WriteTimerFormat,
                                        "%t",
                                        USER_TIMINGS.writing.files[edit.file.path].totalTime
                                    ),
                                    "%w",
                                    USER_TIMINGS.writing.files[edit.file.path].writeTime
                                ),
                                "%b",
                                USER_TIMINGS.writing.files[edit.file.path].breakTime
                            )
                            //this.settings.WriteTimerFormat.replaceAll("%t", USER_TIMINGS.writing.files[edit.file.path].totalTime).replaceAll("%w", USER_TIMINGS.writing.files[edit.file.path].writeTime).replaceAll("%b", USER_TIMINGS.writing.files[edit.file.path].breakTime)
                        )
                    }
                } else {
                    WriteBreakTimerText.setText("WriteTime:Cannot find a file.")
                }
            } else {
                WriteBreakTimerText.setText("")
            }
        }, 1000))
        this.registerDomEvent(window, "keydown", (evt) => {
            let edit = this.app.workspace.activeEditor
            if (edit && edit.editor && edit.file) {
                if (edit.editor.hasFocus()) {
                    if (!USER_TIMINGS.writing.files[edit.file.path]) {
                        USER_TIMINGS.writing.files[edit.file.path] = { breakTime: 0, writeTime: 0, totalTime: 0, lastKeyPress: new Date().getTime() }
                    } else USER_TIMINGS.writing.files[edit.file.path].lastKeyPress = new Date().getTime()
                }
            }
        })
        this.registerDomEvent(window, "keyup", (evt) => {
            let edit = this.app.workspace.activeEditor
            if (edit && edit.editor && edit.file && edit.editor.hasFocus()) {
                if (!USER_TIMINGS.writing.files[edit.file.path]) {
                    USER_TIMINGS.writing.files[edit.file.path] = { breakTime: 0, writeTime: 0, totalTime: 0, lastKeyPress: new Date().getTime() }
                } else USER_TIMINGS.writing.files[edit.file.path].lastKeyPress = new Date().getTime()

                if ((this.settings.AutoSpace || this.settings.AutoShift) && (evt.key == "." || evt.key == "။")) {
                    if (edit && edit.editor) {
                        fsOnEditor = edit.editor
                    }
                } else if ((this.settings.AutoSpace || this.settings.AutoShift) && fsOnEditor && (evt.key.toUpperCase() != evt.key || evt.shiftKey) && evt.key.length == 1) {
                    if (edit && edit.editor && edit.editor == fsOnEditor) {
                        let m = edit.editor.getCursor()
                        let f = edit.editor.getCursor()
                        f.ch--
                        let n = edit.editor.getCursor()
                        n.ch -= 2
                        if (edit.editor.getRange(n, f) == ".") {
                            if (this.settings.AutoShift) { edit.editor.replaceRange(evt.key.toUpperCase(), f, m) }
                            if (this.settings.AutoSpace) edit.editor.replaceRange(" " + (this.settings.AutoSpace_Double ? " " : ""), f)
                            fsOnEditor = undefined
                        }
                    }
                }
            }
        })

        // this.addSettingTab(new qolSettingTab(this.app, this))
        this.addSettingTab(new settings(this.app, this))

        // this.registerEvent(
        this.app.workspace.on("file-menu", (menu, file, whotrig) => {
            if (whotrig == "qol-triggered") return;
            if (file && this.settings.ExpandFolder) {
                menu.addItem((item) => {
                    let fm = GrabWorkspaceElement()
                    if (fm) {
                        let state = fm.view.fileItems[file.path].collapsed || false
                        if (state) {
                            item.setTitle("Expand recursively")
                        } else {
                            item.setTitle("Collapse recursively")
                        }
                        item.setIcon(null)
                            .onClick(() => {
                                if (fm) {
                                    let fold = ""
                                    let scc = true
                                    let recurse = fm.view.fileItems
                                    Object.keys(recurse).forEach((key) => {
                                        if (key.startsWith(file.path)) {
                                            if (recurse[key] && recurse[key].setCollapsed) {
                                                // recurse[fold].setCollapsed(true,0)
                                                if (state == recurse[key].collapsed)
                                                    recurse[key].selfEl.click()
                                            }
                                        }
                                    })
                                } else {
                                    new Notice("Cannnot preform command. Unknown workspace.")
                                }
                            })
                    } else {
                        new Notice("Cannnot preform command. Cannot find workspace.")
                    }
                })
            }
        })
        // )
        // this.registerEvent(
        this.app.vault.on("create", (_) => {
            window.setTimeout(() => HookTouchOnFiles(this), 100)
        })
        // )
        window.setTimeout(() => HookTouchOnFiles(this), 5000)

        this.addCommand({
            id: "f-expand",
            name: "Expand all folders",
            checkCallback: (checking: boolean) => {
                let fm = GrabWorkspaceElement()
                if ((this.settings.FunctionBypass || this.settings.ExpandFolder) && fm && fm.view.fileItems) {
                    if (!checking) {
                        // console.log("execute")
                        // doCommand(value);
                        if (!this.settings.FunctionBypass && !this.settings.ExpandFolder) {
                            new Notice("Cannot execute command: 'qol/settings/Misc/Functions work...' or  'qol/settings/Recursive/Recursively expand...'")
                            return
                        }
                        let fm = GrabWorkspaceElement()
                        if (fm) {
                            let recurse = fm.view.fileItems
                            if (recurse) {
                                Object.keys(recurse).forEach((key) => {
                                    if (recurse[key] && recurse[key].setCollapsed) {
                                        if (recurse[key].collapsed) recurse[key].selfEl.click()
                                    }
                                })
                            }
                        } else { new Notice("Failed to preform command.") }
                    }
                    return true
                }
                return false;
            },
        })
        this.addCommand({
            id: "f-collapse",
            name: "Collapse all folders",
            checkCallback: (checking: boolean) => {
                let fm = GrabWorkspaceElement()
                if ((this.settings.FunctionBypass || this.settings.ExpandFolder) && fm && fm.view.fileItems) {
                    if (!checking) {
                        // console.log("execute")
                        // doCommand(value);
                        if (!this.settings.FunctionBypass && !this.settings.ExpandFolder) {
                            new Notice("Cannot execute command: 'qol/settings/Misc/Functions work...' or  'qol/settings/Recursive/Recursively expand...'")
                            return
                        }
                        let fm = GrabWorkspaceElement()
                        if (fm) {
                            let recurse = fm.view.fileItems
                            if (recurse) {
                                Object.keys(recurse).forEach((key) => {
                                    if (recurse[key] && recurse[key].setCollapsed) {
                                        if (!recurse[key].collapsed) recurse[key].selfEl.click()
                                    }
                                })
                            }
                        } else { new Notice("Failed to preform command.") }
                    }
                    return true
                }
                return false;
            },
        })
        // this.addCommand({
        //     id: 'f-expandAll',
        //     name: 'Expand all folders',
        //     editorCallback: (editor: Editor, view: MarkdownView) => {
        //         if (!this.settings.FunctionBypass && !this.settings.ExpandFolder) {
        //             new Notice("Cannot execute command: 'qol/settings/Misc/Functions work...' or  'qol/settings/Recursive/Recursively expand...'")
        //             return
        //         }
        //         let fm = GrabWorkspaceElement()
        //         if (fm) {
        //             let recurse = fm.view.fileItems
        //             Object.keys(recurse).forEach((key) => {
        //                 if (recurse[key] && recurse[key].setCollapsed) {
        //                     if (recurse[key].collapsed) recurse[key].selfEl.click()
        //                 }
        //             })
        //         } else { new Notice("Failed to preform command.") }
        //     }
        // })
        // this.addCommand({
        //     id: 'f-collapseAll',
        //     name: 'Collapse all folders',
        //     editorCallback: (editor: Editor, view: MarkdownView) => {
        //         if (!this.settings.FunctionBypass && !this.settings.ExpandFolder) {
        //             new Notice("Cannot execute command: 'qol/settings/Misc/Functions work...' or  'qol/settings/Recursive/Recursively expand...'")
        //             return
        //         }
        //         let fm = GrabWorkspaceElement()
        //         if (fm) {
        //             let recurse = fm.view.fileItems
        //             Object.keys(recurse).forEach((key) => {
        //                 if (recurse[key] && recurse[key].setCollapsed) {
        //                     if (!recurse[key].collapsed) recurse[key].selfEl.click()
        //                 }
        //             })
        //         } else { new Notice("Failed to preform command.") }
        //     }
        // })

    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }
}