import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, requestUrl, Setting, TFile, TFolder, ToggleComponent } from 'obsidian'

interface qolSettings {
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




	//Private Settings
	LastUpdateCheck: number
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




	// Private Settings
	LastUpdateCheck: 0,
}

let USER_TIMINGS:
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
		// lastKeyPress: 0,
		// breakTime: 0,
		// writeTime: 0,
		files: {}
	}
}

function GrabWorkspaceElement() {
	return this.app.workspace.getLeavesOfType('file-explorer')[0] || undefined
}

let hooked: Array<Element> = []
let fileExplorerElement: Element | undefined = undefined
//@ts-ignore
function HookTouchOnFiles(local_this) {
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

export default class qolPlugin extends Plugin {
	settings: qolSettings

	async onload() {
		await this.loadSettings()

		setTimeout(() => {
			if (new Date().getTime() - this.settings.LastUpdateCheck > 1000 * 60 * 30) {
				this.settings.LastUpdateCheck = new Date().getTime()
				this.saveSettings()
				// const req = new XMLHttpRequest()
				// req.addEventListener("load",(data)=>{
				// 	console.log(data)
				// })
				// req.open("GET","https://api.github.com/repos/networkmastered/obsidian-qol/releases/latest")
				// req.setRequestHeader("default-src","none")
				// req.send()
				//SECURITY_POLICY_VIOLATION:'Content Security Policy'

				// const req = new XMLHttpRequest()
				// req.addEventListener("load", (data) => {
				// 	let res = req.responseText
				// 	let json = undefined
				// 	try { json = JSON.parse(res) } catch (_) { }
				// 	if (res && json) {
				// 		if (json.latestVersion) {
				// 			if (json.latestVersion != this.manifest.version) {
				// 				new Notice(`QOL: An update is avalible! You can update by checking for updates in the community plugins tab. (${this.manifest.version}->${json.latestVersion})`)
				// 			}
				// 		}
				// 	}
				// })
				// req.open("GET", "https://networkmastered.github.io/endpoints/obsidian/qol.json")
				// req.setRequestHeader("default-src", "none")
				// req.send()
				// cross-platform requirement

				// requestUrl("https://networkmastered.github.io/endpoints/obsidian/qol.json").then((res) => {
				// 	console.log(res)
				// 	if (res.json) {
				// 		if (res.json.latestVersion) {
				// 			console.log(res.json.latestVersion)
				// 			if (res.json.latestVersion != this.manifest.version) {
				// 				new Notice(`QOL: An update is avalible! You can update by checking for updates in the community plugins tab. (${this.manifest.version}->${res.json.latestVersion})`)
				// 			}
				// 		}
				// 	}
				// })
				// Ability to now access github api
				requestUrl("https://api.github.com/repos/networkmastered/obsidian-qol/releases/latest").then((res) => {
					if (res.json) {
						if (!res.json.draft && res.json.assets.length > 2 && res.json.body && res.json.body.length > 0 && res.json.author.id == res.json.assets[0].uploader.id && res.json.author.id == 174283352) {
							if (res.json.tag_name != this.manifest.version) {
								new Notice(`QOL: An update is avalible! You can update by checking for updates in the community plugins tab. (${this.manifest.version}->${res.json.tag_name})`,10000)
							}
						}
					}
				})
			}
		}, 6000) //lazy load

		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	new Notice('This is a notice!')
		// })
		// ribbonIconEl.addClass('my-plugin-ribbon-class')

		const NonSymbolCountText = this.addStatusBarItem()
		NonSymbolCountText.setText('')
		this.registerEvent(
			this.app.workspace.on("editor-change", (_, i) => {
				setTimeout(() => { //let file update also somewhat syncs with Obsidian's char count
					//@ts-ignore
					if (this.settings.NonSymbChars && i && i.data) {
						//@ts-ignore
						let rl = i.data.replaceAll(/[A-Za-z]*/gm, "").length
						//@ts-ignore
						NonSymbolCountText.setText((i.data.length - rl) + " non-symbols")
					} else {
						NonSymbolCountText.setText("")
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
								NonSymbolCountText.setText((str.length - rl) + " non-symbols")
							}
						}
					}, 100);
				} else {
					NonSymbolCountText.setText("")
				}
			})
		)


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
						//@ts-ignore
						WriteBreakTimerText.setText(this.settings.WriteTimerFormat.replaceAll("%t", USER_TIMINGS.writing.files[edit.file.path].totalTime).replaceAll("%w", USER_TIMINGS.writing.files[edit.file.path].writeTime).replaceAll("%b", USER_TIMINGS.writing.files[edit.file.path].breakTime))
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
				if (evt.key == " ") {
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
		setTimeout(() => HookTouchOnFiles(this), 5000)
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

		////////////////////[IDE:hide](CMD:"CTRL-DOWN-SNAP")(CMD:"EXEC title.cpp Word Processing")
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
		f.descEl.appendChild(proc.createEl("p", { cls: "qol-setting-subtext", text: "O(n of characters)" }))

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
		let WBT: ToggleComponent | undefined = undefined
		new Setting(proc)
			.setName('Writing / Break timer')
			.setDesc("Adds a timer in the status bar thats in the format you chose below")
			.addToggle(bool => {
				bool.setValue(this.plugin.settings.WriteTimer)
					.onChange(async (value) => {
						this.plugin.settings.WriteTimer = value
						await this.plugin.saveSettings()
					})
				WBT = bool
			})
		new Setting(proc)
			.setName('Writing Timer format:')
			.setDesc("%t = total time; %w = writing time; %b = break time")
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
		f.descEl.appendChild(proc.createEl("p", { cls: "qol-setting-subtext", text: "O(n file and folders)" }))


		////////////////////[IDE:hide](CMD:"CTRL-DOWN-SNAP")(CMD:"EXEC title.cpp Misc")
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

		////////////////////[IDE:hide](CMD:"CTRL-DOWN-SNAP")(CMD:"EXEC title.cpp Touch Screen")
		containerEl.createEl("hr", { cls: "qol-setting-sep" })
		containerEl.createDiv({ text: "Contains support for computer touchscreens that are not already integrated in to Obsidian.", cls: "qol-setting-desc" })
		let touch = this.containerEl.createEl("details")
		touch.createEl("summary", { text: "TouchScreen", title: "TouchScreen settings", cls: "qol-setting-title" })

		let TSS: ToggleComponent | undefined = undefined
		let TSF: ToggleComponent | undefined = undefined
		new Setting(touch)
			.setName('Touchscreen support')
			.setDesc("Enables all of the TouchScreen features")
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
			.setName('Touchscreen - File Dragging')
			.setDesc("Enables the ability to drag files within the filetree using a touchscreen.")
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
		f.descEl.appendChild(proc.createEl("p", { cls: "qol-setting-subtext", text: "binds: (n file and folders * 3)" }))
		new Setting(touch)
			.setName('Touchscreen - File Dragging: Root warnings')
			.setDesc("Whenever moving a file in to root it will confirm if you want to continue or cancel the operation.")
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



		////////////////////[IDE:hide](CMD:"CTRL-DOWN-SNAP")(CMD:"EXEC title.cpp Plugin Settings")
		containerEl.createEl("hr", { cls: "qol-setting-sep" })
		containerEl.createDiv({ text: "Contains support for computer touchscreens that are not already integrated in to Obsidian.", cls: "qol-setting-desc" })
		let config = this.containerEl.createEl("details")
		config.createEl("summary", { text: "Plugin Config", title: "Config settings", cls: "qol-setting-title" })

		f = new Setting(config)
			.setName('Update checking')
			.setDesc("When enabled you will receive a Notice every time the plugin needs an update.")
			.addToggle(bool => {
				bool.setValue(this.plugin.settings.UpdateChecking)
					.onChange(async (value) => {
						this.plugin.settings.UpdateChecking = value
						await this.plugin.saveSettings()
					})
				TSF = bool
			})
		f.descEl.appendChild(proc.createEl("p", { cls: "qol-setting-subtext", text: "Sends an HTTPS request to github on startup to check for updates. Does not store any data. Has a cooldown of half an hour." }))
	}
}
