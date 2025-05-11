import { App, Modal, Component, MarkdownRenderer } from 'obsidian'
import { mainSettings as settingscope } from 'main'

export default class qolConfirmationModal extends Modal {
    markd = ""
    component: Component;
    title: string;
    dontShow: boolean;
    buttons: [string[], string[]?];
    cb: Function;
    ChkBox: undefined | string
    UsrInp: undefined | string
    chkboxel: undefined | Element
    UsrRet: string
    UsrPlc: string
    constructor(app: App, markdown: string, title: string, button: [string[], string[]?], _ChkBox: undefined | string, _UsrInp: undefined | string, _UsrPs: undefined | string, callback: Function,placeholder:string="") {
        super(app)
        this.markd = markdown
        this.title = title
        this.component = new Component()
        this.buttons = button
        this.dontShow = false
        this.cb = callback
        this.ChkBox = _ChkBox
        this.UsrInp = _UsrInp
        this.UsrRet = _UsrPs || ""
        this.UsrPlc = placeholder
    }

    onOpen() {
        const { contentEl } = this
        // contentEl.setText(this.markd)
        MarkdownRenderer.render(this.app, this.markd, this.contentEl, "temp.md", this.component)
        let btnContainer = contentEl.createDiv({ cls: "modal-button-container" })
        if (this.UsrInp) {
            this.contentEl.createEl("input", {
                attr: {
                    tabindex: -1,
                    value: this.UsrRet,
                    spellcheck: false
                },
                cls: "qol-offset-up qol-input",
                type: "textarea"
            }, (el) => {
                el.addEventListener("change", () => {
                    this.UsrRet = el.value
                    console.log(this.UsrRet)
                })
                setTimeout(() => {
                    el.focus({ preventScroll: true })
                    el.setSelectionRange(this.UsrRet.length, this.UsrRet.length);
                }, 100)
            })
        }
        if (this.buttons[1]) {
            if (this.ChkBox) {
                btnContainer.createEl("label", { cls: "mod-checkbox" }, (l) => {
                    l.createEl("input", {
                        attr: {
                            tabindex: -1
                        },
                        type: "checkbox"
                    }).addEventListener("click", () => {
                        //@ts-ignore
                        this.dontShow = l.querySelector("input[type=checkbox]").checked
                    }),
                        //@ts-ignore
                        l.appendText(this.ChkBox)
                        l.setAttribute("placeholder",this.UsrPlc)
                    this.chkboxel = l
                })
            }
        }
        if (this.buttons[0]) {
            let btn = btnContainer.createEl("button", { cls: this.buttons[0][1] })
            btn.setText(this.buttons[0][0])
            btn.addEventListener("click", () => {
                if (this.markd.length > 0) {
                    if (settingscope && this.dontShow && this.ChkBox == "Don't show again") settingscope.FM_Deletion_Warning = false
                    this.markd = ""
                    this.cb(0, this.dontShow, this.UsrRet)
                }
            })
        }
        if (this.buttons[1]) {
            let btn = btnContainer.createEl("button", { cls: this.buttons[1][1] })
            btn.setText(this.buttons[1][0])
            btn.addEventListener("click", () => {
                if (this.markd.length > 0) {
                    if (settingscope && this.dontShow && this.ChkBox == "Don't show again") settingscope.FM_Deletion_Warning = false
                    this.markd = ""
                    this.cb(1, this.dontShow, this.UsrRet)
                }
            })
        }
    }

    onClose() {
        const { contentEl } = this
        contentEl.empty()
        this.markd = ""
        if (this.markd.length > 0) this.cb(1)
    }
}