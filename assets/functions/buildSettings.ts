import { App, PluginSettingTab, Setting, ToggleComponent } from 'obsidian'
import HookTouchOnFiles from './TouchScreenHook'
import qolPlugin from 'main'
import Dict from "../language/LanguageSelector"
import {lkeys} from "../language/LanguageSelector"

export default class qolSettingTab extends PluginSettingTab {
    plugin: qolPlugin
    constructor(app: App, plugin: qolPlugin) {
        super(app, plugin)
        this.plugin = plugin
    }

    display(): void {
        const { containerEl } = this

        containerEl.empty()

        let t1 = containerEl.createDiv()
        t1.addClass("qol-setting-p")
        t1.innerText = Dict("CONTRIBUTE1")

        let l1 = containerEl.createEl("a")
        l1.addClass("qol-setting-p")
        l1.innerText = Dict("CONTRIBUTE2")
        l1.href = "https://github.com/networkmastered/obsidian-qol/issues/new"
        t1.appendChild(l1)
        
        let t2 = containerEl.createDiv()
        t2.addClass("qol-setting-p")
        t2.innerText = Dict("CONTRIBUTE3")

        let l2 = containerEl.createEl("a")
        l2.addClass("qol-setting-p")
        l2.innerText = Dict("CONTRIBUTE4")
        l2.href = "https://github.com/networkmastered/obsidian-qol/"
        t2.appendChild(l2)
        

        ////////////////////[IDE:hide](CMD:"CTRL-DOWN-SNAP")(CMD:"EXEC title.cpp Word Processing")
        containerEl.createEl("hr", { cls: "qol-setting-sep" })
        containerEl.createDiv({ text: Dict("SETTINGS_WORD_PROCESSING_DESC"), cls: "qol-setting-desc" })
        let proc = this.containerEl.createEl("details")
        proc.createEl("summary", { text: Dict("SETTINGS_WORD_PROCESSING_TITLE"), title: "'" + Dict("SETTINGS_WORD_PROCESSING_TITLE") + "' settings", cls: "qol-setting-title" })

        let f = new Setting(proc)
            .setName(Dict("SETTINGS_WORD_PROCESSING_NONSYMBOL_COUNT_TITLE"))
            .addToggle(bool => bool
                .setValue(this.plugin.settings.NonSymbChars)
                .onChange(async (value) => {
                    this.plugin.settings.NonSymbChars = value
                    await this.plugin.saveSettings()
                }))
            .setDesc(Dict("SETTINGS_WORD_PROCESSING_NONSYMBOL_COUNT_DESC"))
        // f.descEl.appendChild(proc.createEl("p", { cls: "qol-setting-subtext", text: Dict("SETTINGS_WORD_PROCESSING_NONSYMBOL_COUNT_SUB") }))

        new Setting(proc)
            .setName(Dict("SETTINGS_WORD_PROCESSING_AUTO_SPACE_TITLE"))
            // .setName('Automatic space on period')
            .setDesc(Dict("SETTINGS_WORD_PROCESSING_AUTO_SPACE_DESC"))
            // .setDesc("Automatically place a space whenever you press period. Occurs when typing next sentence.")
            .addToggle(bool => bool
                .setValue(this.plugin.settings.AutoSpace)
                .onChange(async (value) => {
                    this.plugin.settings.AutoSpace = value
                    await this.plugin.saveSettings()
                }))
        new Setting(proc)
            .setName(Dict("SETTINGS_WORD_PROCESSING_AUTO_SPACE_SPACING_TITLE"))
            // .setName('Automatic space - double spacing')
            .setDesc(Dict("SETTINGS_WORD_PROCESSING_AUTO_SPACE_SPACING_DESC"))
            // .setDesc("Changes the 'Automatic space on period' to have two spaces instead of one.")
            .addToggle(bool => bool
                .setValue(this.plugin.settings.AutoSpace_Double)
                .onChange(async (value) => {
                    this.plugin.settings.AutoSpace_Double = value
                    await this.plugin.saveSettings()
                }))
        new Setting(proc)
            .setName(Dict("SETTINGS_WORD_PROCESSING_AUTO_SHIFT_TITLE"))
            // .setName('Automatic Capitals')
            .setDesc(Dict("SETTINGS_WORD_PROCESSING_AUTO_SHIFT_DESC"))
            // .setDesc("Starts each new sentence with a capital letter.")
            .addToggle(bool => bool
                .setValue(this.plugin.settings.AutoShift)
                .onChange(async (value) => {
                    this.plugin.settings.AutoShift = value
                    await this.plugin.saveSettings()
                }))
        new Setting(proc)
            .setName(Dict("SETTINGS_WORD_PROCESSING_GRAMMER_TITLE"))
            // .setName('Automatic grammer tweaks')
            .setDesc(Dict("SETTINGS_WORD_PROCESSING_GRAMMER_DESC"))
            // .setDesc("turns itll -> it'll. Will not change the following: i(')d,he(')ll,we(')re as theres no contextualization.")
            .addToggle(bool => bool
                .setValue(this.plugin.settings.GrammerFix)
                .onChange(async (value) => {
                    this.plugin.settings.GrammerFix = value
                    await this.plugin.saveSettings()
                }))
        let WBT: ToggleComponent | undefined = undefined
        new Setting(proc)
            .setName(Dict("SETTINGS_WORD_PROCESSING_WRITE_TIMER_TITLE"))
            // .setName('Writing / Break timer')
            .setDesc(Dict("SETTINGS_WORD_PROCESSING_WRITE_TIMER_DESC"))
            // .setDesc("Adds a timer in the status bar thats in the format you chose below")
            .addToggle(bool => {
                bool.setValue(this.plugin.settings.WriteTimer)
                    .onChange(async (value) => {
                        this.plugin.settings.WriteTimer = value
                        await this.plugin.saveSettings()
                    })
                WBT = bool
            })
        new Setting(proc)
            .setName(Dict("SETTINGS_WORD_PROCESSING_WRITE_TIMER_FORMAT_TITLE"))
            // .setName('Writing Timer format:')
            .setDesc(Dict("SETTINGS_WORD_PROCESSING_WRITE_TIMER_FORMAT_DESC"))
            // .setDesc("%t = total time; %w = writing time; %b = break time")
            .addTextArea(text => text
                .setValue(this.plugin.settings.WriteTimerFormat)
                .onChange(async (value) => {
                    if (value.length > 1) {
                        this.plugin.settings.WriteTimerFormat = value
                        await this.plugin.saveSettings()
                    } else {
                        text.setValue(this.plugin.settings.WriteTimerFormat)
                        this.plugin.settings.WriteTimer = false
                        if (WBT) WBT.setValue(false)
                    }
                }))

        ////////////////////[IDE:hide](CMD:"CTRL-DOWN-SNAP")(CMD:"EXEC title.cpp Recursive")
        containerEl.createEl("hr", { cls: "qol-setting-sep" })
        containerEl.createDiv({ text: Dict("SETTINGS_RECURSIVE_DESC"), cls: "qol-setting-desc" })
        let recurse = this.containerEl.createEl("details")
        recurse.createEl("summary", { text: Dict("SETTINGS_RECURSIVE_TITLE"), title: "Recursive settings", cls: "qol-setting-title" })

        f = new Setting(recurse)
            .setName(Dict("SETTINGS_RECURSIVE_FOLDERS_TITLE"))
            // .setName('Recursively expand/collapse folder')
            .addToggle(bool => bool
                .setValue(this.plugin.settings.ExpandFolder)
                .onChange(async (value) => {
                    this.plugin.settings.ExpandFolder = value
                    await this.plugin.saveSettings()
                }))
            .setDesc(Dict("SETTINGS_RECURSIVE_FOLDERS_DESC"))
        // .setDesc("Right Click (or hold) on a folder and press 'Expand recursively' or 'Collapse recursively' to trigger.");
        f.descEl.appendChild(proc.createEl("p", { cls: "qol-setting-subtext", text: Dict("SETTINGS_RECURSIVE_FOLDERS_DESC_SUB") }))


        ////////////////////[IDE:hide](CMD:"CTRL-DOWN-SNAP")(CMD:"EXEC title.cpp Misc")
        containerEl.createEl("hr", { cls: "qol-setting-sep" })
        containerEl.createDiv({ text: Dict("SETTINGS_MISC_DESC"), cls: "qol-setting-desc" })
        let misc = this.containerEl.createEl("details")
        misc.createEl("summary", { text: Dict("SETTINGS_MISC_TITLE"), title: Dict("SETTINGS_MISC_TITLE") + " settings", cls: "qol-setting-title" })

        new Setting(misc)
            .setName(Dict("SETTINGS_MISC_FUNCTIONS_TITLE"))
            // .setName('Functions work with its counterpart off')
            .setDesc(Dict("SETTINGS_MISC_FUNCTIONS_DESC"))
            // .setDesc("If disabled, a function like 'Expand all folders within root' will not work if 'qol/settings/Recursive/Recursively expand/collapse folder' is disabled.")
            .addToggle(bool => bool
                .setValue(this.plugin.settings.FunctionBypass)
                .onChange(async (value) => {
                    this.plugin.settings.FunctionBypass = value
                    await this.plugin.saveSettings()
                }))

        ////////////////////[IDE:hide](CMD:"CTRL-DOWN-SNAP")(CMD:"EXEC title.cpp Touch Screen")
        containerEl.createEl("hr", { cls: "qol-setting-sep" })
        containerEl.createDiv({ text: Dict("SETTINGS_TOUCH_SCREEN_DESC"), cls: "qol-setting-desc" })
        let touch = this.containerEl.createEl("details")
        touch.createEl("summary", { text: Dict("SETTINGS_TOUCH_SCREEN_TITLE"), title: Dict("SETTINGS_TOUCH_SCREEN_TITLE") + " settings", cls: "qol-setting-title" })

        let TSS: ToggleComponent | undefined = undefined
        let TSF: ToggleComponent | undefined = undefined
        new Setting(touch)
            .setName(Dict("SETTINGS_TOUCH_SCREEN_ENABLED_TITLE"))
            .setDesc(Dict("SETTINGS_TOUCH_SCREEN_ENABLED_DESC"))
            .addToggle(bool => {
                bool.setValue(this.plugin.settings.TouchScreen)
                    .onChange(async (value: boolean) => {
                        this.plugin.settings.TouchScreen = value
                        HookTouchOnFiles({ settings: this.plugin.settings, app: this.app })
                        await this.plugin.saveSettings()
                    })
                TSS = bool
            })
        f = new Setting(touch)
            .setName(Dict("SETTINGS_TOUCH_SCREEN_FILE_DRAG_TITLE"))
            .setDesc(Dict("SETTINGS_TOUCH_SCREEN_FILE_DRAG_DESC"))
            .addToggle(bool => {
                bool.setValue(this.plugin.settings.TouchScreenFiles)
                    .onChange(async (value) => {
                        this.plugin.settings.TouchScreenFiles = value
                        if (value) { this.plugin.settings.TouchScreen = true; if (TSS) TSS.setValue(true) }
                        HookTouchOnFiles({ settings: this.plugin.settings, app: this.app })
                        await this.plugin.saveSettings()
                    })
                TSF = bool
            })
        // f.descEl.appendChild(proc.createEl("p", { cls: "qol-setting-subtext", text: Dict("SETTINGS_TOUCH_SCREEN_FILE_DRAG_SUB") }))
        new Setting(touch)
            .setName(Dict("SETTINGS_TOUCH_SCREEN_FILE_DRAG_ROOT_WARN_TITLE"))
            .setDesc(Dict("SETTINGS_TOUCH_SCREEN_FILE_DRAG_ROOT_WARN_DESC"))
            .addToggle(bool => bool
                .setValue(this.plugin.settings.TouchScreenFilesWarn)
                .onChange(async (value) => {
                    this.plugin.settings.TouchScreenFilesWarn = value

                    if (value) {
                        this.plugin.settings.TouchScreenFiles = true
                        if (TSF) TSF.setValue(true)
                        this.plugin.settings.TouchScreen = true
                        if (TSS) TSS.setValue(true)
                    }
                    HookTouchOnFiles({ settings: this.plugin.settings, app: this.app, registerEvent: this.plugin.registerEvent, })
                    await this.plugin.saveSettings()
                }))

        ////////////////////[IDE:hide](CMD:"CTRL-DOWN-SNAP")(CMD:"EXEC title.cpp File Manager")
        containerEl.createEl("hr", { cls: "qol-setting-sep" })
        containerEl.createDiv({ text: Dict("SETTINGS_FILE_EXPLORER_DESC"), cls: "qol-setting-desc" })
        let FileM = this.containerEl.createEl("details")
        FileM.createEl("summary", { text: Dict("SETTINGS_FILE_EXPLORER_TITLE")+"[BETA]", title: Dict("SETTINGS_FILE_EXPLORER_TITLE") + " settings", cls: "qol-setting-title" })

        new Setting(FileM)
            .setName(Dict("SETTINGS_FILE_EXPLORER_ENABLED_TITLE"))
            .setDesc(Dict("SETTINGS_FILE_EXPLORER_ENABLED_DESC"))
            .addToggle(bool => bool
                .setValue(this.plugin.settings.FM_Enabled)
                .onChange(async (value) => {
                    this.plugin.settings.FM_Enabled = value
                    await this.plugin.saveSettings()
                    
                    if (!value) {this.app.workspace.trigger("qol-remotes-kill-workspace")} else this.plugin.FileExplorerTrigger()
                })
            )
        new Setting(FileM)
            .setName(Dict("SETTINGS_FILE_EXPLORER_WARNINGS_TITLE"))
            .setDesc(Dict("SETTINGS_FILE_EXPLORER_WARNINGS_DESC"))
            .addToggle(bool => bool
                .setValue(this.plugin.settings.FM_Deletion_Warning)
                .onChange(async (value) => {
                    this.plugin.settings.FM_Deletion_Warning = value
                    await this.plugin.saveSettings()
                })
            )
        new Setting(FileM)
            .setName(Dict("SETTINGS_FILE_EXPLORER_REFRESHER_TITLE"))
            .setDesc(Dict("SETTINGS_FILE_EXPLORER_REFRESHER_DESC"))
            .addToggle(bool => bool
                .setValue(this.plugin.settings.FM_Full_Refreshing)
                .onChange(async (value) => {
                    this.plugin.settings.FM_Full_Refreshing = value
                    await this.plugin.saveSettings()
                })
            )

        ////////////////////[IDE:hide](CMD:"CTRL-DOWN-SNAP")(CMD:"EXEC title.cpp Plugin Settings")
        containerEl.createEl("hr", { cls: "qol-setting-sep" })
        containerEl.createDiv({ text: Dict("SETTINGS_PLUGIN_DESC"), cls: "qol-setting-desc" })
        let config = this.containerEl.createEl("details")
        config.createEl("summary", { text: Dict("SETTINGS_PLUGIN_TITLE"), title: "Config settings", cls: "qol-setting-title" })

        f = new Setting(config)
            .setName(Dict("SETTINGS_PLUGIN_UPDATE_CHECK_TITLE"))
            .setDesc(Dict("SETTINGS_PLUGIN_UPDATE_CHECK_DESC"))
            .addToggle(bool => {
                bool.setValue(this.plugin.settings.UpdateChecking)
                    .onChange(async (value) => {
                        this.plugin.settings.UpdateChecking = value
                        await this.plugin.saveSettings()
                    })
                TSF = bool
            })
        // f.descEl.appendChild(proc.createEl("p", { cls: "qol-setting-subtext", text: Dict("SETTINGS_PLUGIN_UPDATE_CHECK_DESC_SUB") }))

        f = new Setting(config)
            .setName(Dict("SETTINGS_PLUGIN_LANGUAGE_TITLE"))
            .setDesc(Dict("SETTINGS_PLUGIN_LANGUAGE_DESC"))
            .addDropdown(nl => {
                let langs = Dict("")
                langs.split(",").forEach((l:lkeys) => nl.addOption(l, Dict(l, "LANG")))
                nl.setValue(this.plugin.settings.Language)
                    .onChange(async (value) => {
                        this.plugin.settings.Language = value
                        await this.plugin.saveSettings()
                    })

            })

        f = new Setting(config)
            .setName(Dict("SETTINGS_PLUGIN_CHANGELOG_TITLE"))
            .setDesc(Dict("SETTINGS_PLUGIN_CHANGELOG_DESC"))
            .addToggle(bool => {
                bool.setValue(this.plugin.settings.ChangeLog)
                    .onChange(async (value) => {
                        this.plugin.settings.ChangeLog = value
                        await this.plugin.saveSettings()
                    })
                TSF = bool
            })
    }
}