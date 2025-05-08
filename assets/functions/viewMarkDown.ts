import { App, Modal, Component, MarkdownRenderer } from 'obsidian'

export default class qolMarkdownModal extends Modal {
	markd = ""
	component: Component;
	constructor(app: App, markdown: string) {
		super(app)
		this.markd = markdown
		this.component = new Component()
	}

	onOpen() {
		// const { contentEl } = this
		// contentEl.setText(this.markd)
		MarkdownRenderer.render(this.app, this.markd, this.contentEl, "temp.md", this.component)
		// MarkdownRenderer.render(this.app,this.markd,this.component,)
	}

	onClose() {
		const { contentEl } = this
		contentEl.empty()
	}
}