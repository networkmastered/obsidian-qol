import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, TFolder } from 'obsidian'

interface qolSettings {
	ExpandFolder: boolean
	FunctionBypass: boolean
	NonSymbChars: boolean
	AutoSpace: boolean
	AutoSpace_Double: boolean
	AutoShift: boolean
	GrammerFix: boolean
	TouchScreen: boolean
}

const DEFAULT_SETTINGS: qolSettings = {
	ExpandFolder: false,
	FunctionBypass: false,
	NonSymbChars: false,
	AutoSpace: false,
	AutoSpace_Double: false,
	AutoShift: false,
	GrammerFix: false,
	TouchScreen: false,
}

function GrabWorkspaceElement() {
	return this.app.workspace.getLeavesOfType('file-explorer')[0] || undefined
}

let hooked: Array<Element> = []
//@ts-ignore
function HookTouchOnFiles(local_this) {
	let fm = GrabWorkspaceElement()
	if (local_this.settings.TouchScreen && fm && fm.view && fm.view.files && fm.view.files.map) {
		Object.keys(fm.view.fileItems).forEach((key) => {
			let el = fm.view.fileItems[key].coverEl
			if (hooked.includes(el)) return
			let dragging = false
			//@ts-ignore
			let highl = []
			let x = 0
			let y = 0
			let st = 0
			let truestart = false
			hooked.push(el)
			local_this.registerEvent(
				el.addEventListener("touchstart", (e: TouchEvent) => {
					if (!local_this.settings.TouchScreen) return
					x = e.touches[0].clientX
					y = e.touches[0].clientY
					dragging = true
					st = new Date().getTime()
				})
			)
			local_this.registerEvent(
				el.addEventListener("touchmove", (e: TouchEvent) => {
					if (!local_this.settings.TouchScreen) return
					if (new Date().getTime() - st < 500) return
					if (!truestart) {
						el.addClass("is-being-dragged")
						el.parentElement.parentElement.parentElement.style.setProperty("overflow", "hidden")
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
						els.forEach((fol) => {
							if (fol && fol.hasClass("nav-folder-title")) {
								fol.addClass("is-being-dragged-over")
								highl.push(fol)
							}
						})
					}
				})
			)
			local_this.registerEvent(
				el.addEventListener("touchend", (e: DragEvent) => {
					el.parentElement.parentElement.parentElement.style.removeProperty("overflow")
					//@ts-ignore
					if (highl[0]) {
						//@ts-ignore
						let tgt = highl[0]
						let fm = GrabWorkspaceElement()
						if (fm && tgt && tgt.getAttribute("data-path") && el && el.getAttribute("data-path")) {
							Object.keys(fm.view.fileItems).forEach((key) => {
								if (key == tgt.getAttribute("data-path")) {
									let initial = local_this.app.vault.getFileByPath(el.getAttribute("data-path"))
									if (initial) {
										let probe = local_this.app.vault.getFileByPath(tgt.getAttribute("data-path") + "/" + initial.name)
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
					dragging = false
					st = 0
					truestart = false
				})
			)
		})
	}
}

export default class qolPlugin extends Plugin {
	settings: qolSettings

	async onload() {
		await this.loadSettings()

		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	new Notice('This is a notice!')
		// })
		// ribbonIconEl.addClass('my-plugin-ribbon-class')

		const statusBarItemEl = this.addStatusBarItem()
		statusBarItemEl.setText('')
		this.registerEvent(
			this.app.workspace.on("editor-change", (_, i) => {
				setTimeout(() => { //let file update also somewhat syncs with Obsidian's char count
					//@ts-ignore
					if (this.settings.NonSymbChars && i && i.data) {
						//@ts-ignore
						let rl = i.data.replaceAll(/[A-Za-z]*/gm, "").length
						//@ts-ignore
						statusBarItemEl.setText((i.data.length - rl) + " non-symbols")
					} else {
						statusBarItemEl.setText("")
					}
				}, 100);
			})
		)
		this.registerEvent(
			this.app.workspace.on("file-open", () => {
				if (this.settings.NonSymbChars) {
					setTimeout(async () => { //let file update also somewhat syncs with Obsidian's char count
						let i = this.app.workspace.getActiveFile()
						if (i) {
							let str = await this.app.vault.read(i)
							if (str) {
								//@ts-ignore
								let rl = str.replaceAll(/[A-Za-z]*/gm, "").length
								statusBarItemEl.setText((str.length - rl) + " non-symbols")
							}
						}
					}, 100);
				} else {
					statusBarItemEl.setText("")
				}
			})
		)
		let fsOnEditor: Editor|undefined = undefined
		let gramcorrect: string = ""
		this.registerDomEvent(window, "keyup", (evt) => {
			if (evt.key == " ") {
				let edit = this.app.workspace.activeEditor
				if (edit && edit.editor) {

					// 	switch (gramcorrect) {
					// 		case "itll":
					// 			let f = edit.editor.getCursor()
					// 			let v = edit.editor.getCursor()
					// 			v.ch -= 5
					// 			f.ch--
					// 			if (edit.editor.getRange(v, f) == "itll") {
					// 				f.ch -= 2
					// 				if (this.settings.GrammerFix) { edit.editor.replaceRange("'", f) }
					// 			}
					// 	}
					if (this.settings.GrammerFix) {
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
				// gramcorrect = ""

			}
			//  else {
			// 	if (evt.key.length == 1 && !evt.altKey && !evt.ctrlKey) gramcorrect += evt.key.toLowerCase()
			// 	if (evt.key == "Backspace") gramcorrect = gramcorrect.substring(0, gramcorrect.length - 1)
			// }
			if ((this.settings.AutoSpace || this.settings.AutoShift) && (evt.key == "." || evt.key == "။")) {
				let edit = this.app.workspace.activeEditor
				if (edit && edit.editor) {
					fsOnEditor = edit.editor
				}
			} else if ((this.settings.AutoSpace || this.settings.AutoShift) && fsOnEditor && (evt.key.toUpperCase() != evt.key || evt.shiftKey) && evt.key.length == 1) {
				let edit = this.app.workspace.activeEditor
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
		})

		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection())
		// 		editor.replaceSelection('Sample Editor Command')
		// 	}
		// })

		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView)
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new qolModal(this.app).open()
		// 			}
		// 			return true
		// 		}
		// 	}
		// })

		this.addSettingTab(new qolSettingTab(this.app, this))

		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt)
		// })

		// this.registerEvent(
		// 	this.app.workspace.on("editor-menu", (menu) => {
		// 		menu.addItem((item) => {
		// 			item.setTitle("Hello world")
		// 			.setIcon("dice")
		// 			.onClick(() => {
		// 				console.log("Clicked")
		// 			})
		// 		})
		// 	})
		// )
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				//@ts-ignore
				if (file && !file.extension && this.settings.ExpandFolder) {
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
									//@ts-ignore
									// file.children.forEach((file: TFolder) => {
									// 	if (file.children) {
									// 		console.log(file)
									// 	}
									// })
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
		)
		this.registerEvent(
			this.app.vault.on("create", (_) => {
				setTimeout(() => HookTouchOnFiles(this), 100)
			})
		)
		setTimeout(() => HookTouchOnFiles(this), 2000)
		this.addCommand({
			id: 'qol-f-expandAll',
			name: 'Expand all folders within root',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				if (!this.settings.FunctionBypass && !this.settings.ExpandFolder) {
					new Notice("Cannot execute command: 'qol/settings/Misc/Functions work...' or  'qol/settings/Recursive/Recursively expand...'")
					return
				}
				let fm = GrabWorkspaceElement()
				if (fm) {
					let recurse = fm.view.fileItems
					Object.keys(recurse).forEach((key) => {
						if (recurse[key] && recurse[key].setCollapsed) {
							if (recurse[key].collapsed) recurse[key].selfEl.click()
						}
					})
				} else { new Notice("Failed to preform command.") }
			}
		})
		this.addCommand({
			id: 'qol-f-collapseAll',
			name: 'Collapse all folders within root',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				if (!this.settings.FunctionBypass && !this.settings.ExpandFolder) {
					new Notice("Cannot execute command: 'qol/settings/Misc/Functions work...' or  'qol/settings/Recursive/Recursively expand...'")
					return
				}
				let fm = GrabWorkspaceElement()
				if (fm) {
					let recurse = fm.view.fileItems
					Object.keys(recurse).forEach((key) => {
						if (recurse[key] && recurse[key].setCollapsed) {
							if (!recurse[key].collapsed) recurse[key].selfEl.click()
						}
					})
				} else { new Notice("Failed to preform command.") }
			}
		})

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

class qolModal extends Modal {
	constructor(app: App) {
		super(app)
	}

	onOpen() {
		const { contentEl } = this
		contentEl.setText('Woah!')
	}

	onClose() {
		const { contentEl } = this
		contentEl.empty()
	}
}

class qolSettingTab extends PluginSettingTab {
	plugin: qolPlugin

	constructor(app: App, plugin: qolPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this

		containerEl.empty()

		////////////////////[IDE:hide](CMD:"CTRL-DOWN-SNAP")
		containerEl.createEl("hr", { cls: "qol-setting-sep" })
		containerEl.createDiv({ text: "Many utilities while editing", cls: "qol-setting-desc" })
		let proc = this.containerEl.createEl("details")
		proc.createEl("summary", { text: "Word Processing", title: "'Word Processing' settings", cls: "qol-setting-title" })

		let f = new Setting(proc)
			.setName('Non-Symbol character count')
			.addToggle(bool => bool
				.setValue(this.plugin.settings.NonSymbChars)
				.onChange(async (value) => {
					this.plugin.settings.NonSymbChars = value
					await this.plugin.saveSettings()
				}))
			.setDesc("Get how many characters youve typed without spaces,underscores,numbers,etc");
		proc.createEl("p", {parent:f.descEl,cls:"qol-setting-subtext",text:"O(n of characters)"})
		new Setting(proc)
			.setName('Automatic space on period')
			.setDesc("Automatically place a space whenever you press period. Occurs when typing next sentence.")
			.addToggle(bool => bool
				.setValue(this.plugin.settings.AutoSpace)
				.onChange(async (value) => {
					this.plugin.settings.AutoSpace = value
					await this.plugin.saveSettings()
				}))
		new Setting(proc)
			.setName('Automatic space - double spacing')
			.setDesc("Changes the 'Automatic space on period' to have two spaces instead of one.")
			.addToggle(bool => bool
				.setValue(this.plugin.settings.AutoSpace_Double)
				.onChange(async (value) => {
					this.plugin.settings.AutoSpace_Double = value
					await this.plugin.saveSettings()
				}))
		new Setting(proc)
			.setName('Automatic Capital')
			.setDesc("Starts each new sentence with a capital letter.")
			.addToggle(bool => bool
				.setValue(this.plugin.settings.AutoShift)
				.onChange(async (value) => {
					this.plugin.settings.AutoShift = value
					await this.plugin.saveSettings()
				}))
		new Setting(proc)
			.setName('Automatic grammer tweaks')
			.setDesc("turns itll -> it'll. Will not change the following: i(')d,he(')ll,we(')re as theres no contextualization.")
			.addToggle(bool => bool
				.setValue(this.plugin.settings.GrammerFix)
				.onChange(async (value) => {
					this.plugin.settings.GrammerFix = value
					await this.plugin.saveSettings()
				}))

		////////////////////[IDE:hide](CMD:"CTRL-DOWN-SNAP")
		containerEl.createEl("hr", { cls: "qol-setting-sep" })
		containerEl.createDiv({ text: "All of the recursive functions within qol. These will be more intensive depending on the amount of instructions. You can see the timecomplexity when it says O(n) or O(files) meaning it would have to do something on every file.", cls: "qol-setting-desc" })
		let recurse = this.containerEl.createEl("details")
		recurse.createEl("summary", { text: "Recursive", title: "Recursive settings", cls: "qol-setting-title" })
		
		f = new Setting(recurse)
			.setName('Recursively expand/collapse folder')
			.addToggle(bool => bool
				.setValue(this.plugin.settings.ExpandFolder)
				.onChange(async (value) => {
					this.plugin.settings.ExpandFolder = value
					await this.plugin.saveSettings()
				}))
			.setDesc("Right Click (or hold) on a folder and press 'Expand recursively' or 'Collapse recursively' to trigger.");
		proc.createEl("p", {parent:f.descEl,cls:"qol-setting-subtext",text:"O(n file and folders)"})

		////////////////////[IDE:hide](CMD:"CTRL-DOWN-SNAP")
		containerEl.createEl("hr", { cls: "qol-setting-sep" })
		containerEl.createDiv({ text: "A list of all of the settings that would not be worth creating a new tab for.", cls: "qol-setting-desc" })
		let misc = this.containerEl.createEl("details")
		misc.createEl("summary", { text: "Misc", title: "Misc settings", cls: "qol-setting-title" })

		new Setting(misc)
			.setName('Functions work with its counterpart off')
			.setDesc("If disabled, a function like 'Expand all folders within root' will not work if 'qol/settings/Recursive/Recursively expand/collapse folder' is disabled.")
			.addToggle(bool => bool
				.setValue(this.plugin.settings.FunctionBypass)
				.onChange(async (value) => {
					this.plugin.settings.FunctionBypass = value
					await this.plugin.saveSettings()
				}))
		new Setting(misc)
			.setName('Touchscreen support')
			.setDesc("Enables the ability to drag files within the filetree using a touchscreen.")
			.addToggle(bool => bool
				.setValue(this.plugin.settings.TouchScreen)
				.onChange(async (value) => {
					this.plugin.settings.TouchScreen = value
					HookTouchOnFiles({ settings: this.plugin.settings, app: this.app })
					await this.plugin.saveSettings()
				}))

	}
}
