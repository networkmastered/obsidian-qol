import { Editor, MarkdownView, Notice, Plugin, ItemView, WorkspaceLeaf, TFile, TFolder, setTooltip, TAbstractFile, Menu, MenuItem } from 'obsidian'
import Dict from "./../language/LanguageSelector"
import ConfirmationPrompt from "./conformation"
import qolPlugin, { mainSettings as settingscope } from 'main'
import { createEl } from './create'

export let classN: string = "qol-file-explorer"

let cb: undefined | Function = undefined

const fileIcons: { [key: string]: string } = {
    "md": "M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5 M14 2v4a2 2 0 0 0 2 2h4 M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
    "txt": "M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5 M14 2v4a2 2 0 0 0 2 2h4 M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
    "ctxt": "M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5 M14 2v4a2 2 0 0 0 2 2h4 M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",

    "canvas": "m14.622 17.897-10.68-2.913 M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15",
    "cexcalidraw": "m14.622 17.897-10.68-2.913 M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15",

    "avif": "M14.2639 15.9375L12.5958 14.2834C11.7909 13.4851 11.3884 13.086 10.9266 12.9401C10.5204 12.8118 10.0838 12.8165 9.68048 12.9536C9.22188 13.1095 8.82814 13.5172 8.04068 14.3326L4.04409 18.2801M14.2639 15.9375L14.6053 15.599C15.4112 14.7998 15.8141 14.4002 16.2765 14.2543C16.6831 14.126 17.12 14.1311 17.5236 14.2687C17.9824 14.4251 18.3761 14.8339 19.1634 15.6514L20 16.4934M14.2639 15.9375L18.275 19.9565M18.275 19.9565C17.9176 20 17.4543 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4.12796 18.7313 4.07512 18.5321 4.04409 18.2801M18.275 19.9565C18.5293 19.9256 18.7301 19.8727 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V16.4934M4.04409 18.2801C4 17.9221 4 17.4575 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.07989 4 7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.4934M17 8.99989C17 10.1045 16.1046 10.9999 15 10.9999C13.8954 10.9999 13 10.1045 13 8.99989C13 7.89532 13.8954 6.99989 15 6.99989C16.1046 6.99989 17 7.89532 17 8.99989Z",
    "bmp": "M14.2639 15.9375L12.5958 14.2834C11.7909 13.4851 11.3884 13.086 10.9266 12.9401C10.5204 12.8118 10.0838 12.8165 9.68048 12.9536C9.22188 13.1095 8.82814 13.5172 8.04068 14.3326L4.04409 18.2801M14.2639 15.9375L14.6053 15.599C15.4112 14.7998 15.8141 14.4002 16.2765 14.2543C16.6831 14.126 17.12 14.1311 17.5236 14.2687C17.9824 14.4251 18.3761 14.8339 19.1634 15.6514L20 16.4934M14.2639 15.9375L18.275 19.9565M18.275 19.9565C17.9176 20 17.4543 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4.12796 18.7313 4.07512 18.5321 4.04409 18.2801M18.275 19.9565C18.5293 19.9256 18.7301 19.8727 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V16.4934M4.04409 18.2801C4 17.9221 4 17.4575 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.07989 4 7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.4934M17 8.99989C17 10.1045 16.1046 10.9999 15 10.9999C13.8954 10.9999 13 10.1045 13 8.99989C13 7.89532 13.8954 6.99989 15 6.99989C16.1046 6.99989 17 7.89532 17 8.99989Z",
    "gif": "M14.2639 15.9375L12.5958 14.2834C11.7909 13.4851 11.3884 13.086 10.9266 12.9401C10.5204 12.8118 10.0838 12.8165 9.68048 12.9536C9.22188 13.1095 8.82814 13.5172 8.04068 14.3326L4.04409 18.2801M14.2639 15.9375L14.6053 15.599C15.4112 14.7998 15.8141 14.4002 16.2765 14.2543C16.6831 14.126 17.12 14.1311 17.5236 14.2687C17.9824 14.4251 18.3761 14.8339 19.1634 15.6514L20 16.4934M14.2639 15.9375L18.275 19.9565M18.275 19.9565C17.9176 20 17.4543 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4.12796 18.7313 4.07512 18.5321 4.04409 18.2801M18.275 19.9565C18.5293 19.9256 18.7301 19.8727 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V16.4934M4.04409 18.2801C4 17.9221 4 17.4575 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.07989 4 7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.4934M17 8.99989C17 10.1045 16.1046 10.9999 15 10.9999C13.8954 10.9999 13 10.1045 13 8.99989C13 7.89532 13.8954 6.99989 15 6.99989C16.1046 6.99989 17 7.89532 17 8.99989Z",
    "jpeg": "M14.2639 15.9375L12.5958 14.2834C11.7909 13.4851 11.3884 13.086 10.9266 12.9401C10.5204 12.8118 10.0838 12.8165 9.68048 12.9536C9.22188 13.1095 8.82814 13.5172 8.04068 14.3326L4.04409 18.2801M14.2639 15.9375L14.6053 15.599C15.4112 14.7998 15.8141 14.4002 16.2765 14.2543C16.6831 14.126 17.12 14.1311 17.5236 14.2687C17.9824 14.4251 18.3761 14.8339 19.1634 15.6514L20 16.4934M14.2639 15.9375L18.275 19.9565M18.275 19.9565C17.9176 20 17.4543 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4.12796 18.7313 4.07512 18.5321 4.04409 18.2801M18.275 19.9565C18.5293 19.9256 18.7301 19.8727 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V16.4934M4.04409 18.2801C4 17.9221 4 17.4575 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.07989 4 7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.4934M17 8.99989C17 10.1045 16.1046 10.9999 15 10.9999C13.8954 10.9999 13 10.1045 13 8.99989C13 7.89532 13.8954 6.99989 15 6.99989C16.1046 6.99989 17 7.89532 17 8.99989Z",
    "jpg": "M14.2639 15.9375L12.5958 14.2834C11.7909 13.4851 11.3884 13.086 10.9266 12.9401C10.5204 12.8118 10.0838 12.8165 9.68048 12.9536C9.22188 13.1095 8.82814 13.5172 8.04068 14.3326L4.04409 18.2801M14.2639 15.9375L14.6053 15.599C15.4112 14.7998 15.8141 14.4002 16.2765 14.2543C16.6831 14.126 17.12 14.1311 17.5236 14.2687C17.9824 14.4251 18.3761 14.8339 19.1634 15.6514L20 16.4934M14.2639 15.9375L18.275 19.9565M18.275 19.9565C17.9176 20 17.4543 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4.12796 18.7313 4.07512 18.5321 4.04409 18.2801M18.275 19.9565C18.5293 19.9256 18.7301 19.8727 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V16.4934M4.04409 18.2801C4 17.9221 4 17.4575 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.07989 4 7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.4934M17 8.99989C17 10.1045 16.1046 10.9999 15 10.9999C13.8954 10.9999 13 10.1045 13 8.99989C13 7.89532 13.8954 6.99989 15 6.99989C16.1046 6.99989 17 7.89532 17 8.99989Z",
    "png": "M14.2639 15.9375L12.5958 14.2834C11.7909 13.4851 11.3884 13.086 10.9266 12.9401C10.5204 12.8118 10.0838 12.8165 9.68048 12.9536C9.22188 13.1095 8.82814 13.5172 8.04068 14.3326L4.04409 18.2801M14.2639 15.9375L14.6053 15.599C15.4112 14.7998 15.8141 14.4002 16.2765 14.2543C16.6831 14.126 17.12 14.1311 17.5236 14.2687C17.9824 14.4251 18.3761 14.8339 19.1634 15.6514L20 16.4934M14.2639 15.9375L18.275 19.9565M18.275 19.9565C17.9176 20 17.4543 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4.12796 18.7313 4.07512 18.5321 4.04409 18.2801M18.275 19.9565C18.5293 19.9256 18.7301 19.8727 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V16.4934M4.04409 18.2801C4 17.9221 4 17.4575 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.07989 4 7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.4934M17 8.99989C17 10.1045 16.1046 10.9999 15 10.9999C13.8954 10.9999 13 10.1045 13 8.99989C13 7.89532 13.8954 6.99989 15 6.99989C16.1046 6.99989 17 7.89532 17 8.99989Z",
    "svg": "M14.2639 15.9375L12.5958 14.2834C11.7909 13.4851 11.3884 13.086 10.9266 12.9401C10.5204 12.8118 10.0838 12.8165 9.68048 12.9536C9.22188 13.1095 8.82814 13.5172 8.04068 14.3326L4.04409 18.2801M14.2639 15.9375L14.6053 15.599C15.4112 14.7998 15.8141 14.4002 16.2765 14.2543C16.6831 14.126 17.12 14.1311 17.5236 14.2687C17.9824 14.4251 18.3761 14.8339 19.1634 15.6514L20 16.4934M14.2639 15.9375L18.275 19.9565M18.275 19.9565C17.9176 20 17.4543 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4.12796 18.7313 4.07512 18.5321 4.04409 18.2801M18.275 19.9565C18.5293 19.9256 18.7301 19.8727 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V16.4934M4.04409 18.2801C4 17.9221 4 17.4575 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.07989 4 7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.4934M17 8.99989C17 10.1045 16.1046 10.9999 15 10.9999C13.8954 10.9999 13 10.1045 13 8.99989C13 7.89532 13.8954 6.99989 15 6.99989C16.1046 6.99989 17 7.89532 17 8.99989Z",
    "webp": "M14.2639 15.9375L12.5958 14.2834C11.7909 13.4851 11.3884 13.086 10.9266 12.9401C10.5204 12.8118 10.0838 12.8165 9.68048 12.9536C9.22188 13.1095 8.82814 13.5172 8.04068 14.3326L4.04409 18.2801M14.2639 15.9375L14.6053 15.599C15.4112 14.7998 15.8141 14.4002 16.2765 14.2543C16.6831 14.126 17.12 14.1311 17.5236 14.2687C17.9824 14.4251 18.3761 14.8339 19.1634 15.6514L20 16.4934M14.2639 15.9375L18.275 19.9565M18.275 19.9565C17.9176 20 17.4543 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4.12796 18.7313 4.07512 18.5321 4.04409 18.2801M18.275 19.9565C18.5293 19.9256 18.7301 19.8727 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V16.4934M4.04409 18.2801C4 17.9221 4 17.4575 4 16.8V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.07989 4 7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.4934M17 8.99989C17 10.1045 16.1046 10.9999 15 10.9999C13.8954 10.9999 13 10.1045 13 8.99989C13 7.89532 13.8954 6.99989 15 6.99989C16.1046 6.99989 17 7.89532 17 8.99989Z",

    "flac": "M16 9C16.5 9.5 17 10.5 17 12C17 13.5 16.5 14.5 16 15M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z",
    "m4a": "M16 9C16.5 9.5 17 10.5 17 12C17 13.5 16.5 14.5 16 15M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z",
    "mp3": "M16 9C16.5 9.5 17 10.5 17 12C17 13.5 16.5 14.5 16 15M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z",
    "ogg": "M16 9C16.5 9.5 17 10.5 17 12C17 13.5 16.5 14.5 16 15M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z",
    "wav": "M16 9C16.5 9.5 17 10.5 17 12C17 13.5 16.5 14.5 16 15M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z",
    "3gp": "M16 9C16.5 9.5 17 10.5 17 12C17 13.5 16.5 14.5 16 15M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z",

    "mkv": "M0,74.451v363.098h512V74.451H0z M71.524,167.241H47.957c-4.215,0-7.633-3.417-7.633-7.632v-42.974   c0-4.215,3.418-7.631,7.633-7.631h23.566c4.215,0,7.631,3.416,7.631,7.631v42.974C79.154,163.824,75.738,167.241,71.524,167.241z    M47.957,221.844h23.566c4.215,0,7.631,3.417,7.631,7.633v42.974c0,4.215-3.416,7.632-7.631,7.632H47.957   c-4.215,0-7.633-3.417-7.633-7.632v-42.974C40.324,225.261,43.742,221.844,47.957,221.844z M47.957,344.758h23.566   c4.215,0,7.631,3.418,7.631,7.632v42.975c0,4.215-3.416,7.632-7.631,7.632H47.957c-4.215,0-7.633-3.417-7.633-7.632V352.39   C40.324,348.176,43.742,344.758,47.957,344.758z M198.982,326.856V185.144c0-5.875,6.359-9.547,11.447-6.609l122.725,70.856   c5.088,2.937,5.088,10.281,0,13.218L210.43,333.465C205.342,336.402,198.982,332.73,198.982,326.856z M464.041,167.241h-23.565   c-4.215,0-7.633-3.417-7.633-7.632v-42.974c0-4.215,3.418-7.631,7.633-7.631h23.565c4.215,0,7.631,3.416,7.631,7.631v42.974   C471.672,163.824,468.256,167.241,464.041,167.241z M440.476,221.844h23.565c4.215,0,7.631,3.417,7.631,7.633v42.974   c0,4.215-3.416,7.632-7.631,7.632h-23.565c-4.215,0-7.633-3.417-7.633-7.632v-42.974   C432.844,225.261,436.262,221.844,440.476,221.844z M440.476,344.758h23.565c4.215,0,7.631,3.418,7.631,7.632v42.975   c0,4.215-3.416,7.632-7.631,7.632h-23.565c-4.215,0-7.633-3.417-7.633-7.632V352.39   C432.844,348.176,436.262,344.758,440.476,344.758z",
    "mov": "M0,74.451v363.098h512V74.451H0z M71.524,167.241H47.957c-4.215,0-7.633-3.417-7.633-7.632v-42.974   c0-4.215,3.418-7.631,7.633-7.631h23.566c4.215,0,7.631,3.416,7.631,7.631v42.974C79.154,163.824,75.738,167.241,71.524,167.241z    M47.957,221.844h23.566c4.215,0,7.631,3.417,7.631,7.633v42.974c0,4.215-3.416,7.632-7.631,7.632H47.957   c-4.215,0-7.633-3.417-7.633-7.632v-42.974C40.324,225.261,43.742,221.844,47.957,221.844z M47.957,344.758h23.566   c4.215,0,7.631,3.418,7.631,7.632v42.975c0,4.215-3.416,7.632-7.631,7.632H47.957c-4.215,0-7.633-3.417-7.633-7.632V352.39   C40.324,348.176,43.742,344.758,47.957,344.758z M198.982,326.856V185.144c0-5.875,6.359-9.547,11.447-6.609l122.725,70.856   c5.088,2.937,5.088,10.281,0,13.218L210.43,333.465C205.342,336.402,198.982,332.73,198.982,326.856z M464.041,167.241h-23.565   c-4.215,0-7.633-3.417-7.633-7.632v-42.974c0-4.215,3.418-7.631,7.633-7.631h23.565c4.215,0,7.631,3.416,7.631,7.631v42.974   C471.672,163.824,468.256,167.241,464.041,167.241z M440.476,221.844h23.565c4.215,0,7.631,3.417,7.631,7.633v42.974   c0,4.215-3.416,7.632-7.631,7.632h-23.565c-4.215,0-7.633-3.417-7.633-7.632v-42.974   C432.844,225.261,436.262,221.844,440.476,221.844z M440.476,344.758h23.565c4.215,0,7.631,3.418,7.631,7.632v42.975   c0,4.215-3.416,7.632-7.631,7.632h-23.565c-4.215,0-7.633-3.417-7.633-7.632V352.39   C432.844,348.176,436.262,344.758,440.476,344.758z",
    "mp4": "M0,74.451v363.098h512V74.451H0z M71.524,167.241H47.957c-4.215,0-7.633-3.417-7.633-7.632v-42.974   c0-4.215,3.418-7.631,7.633-7.631h23.566c4.215,0,7.631,3.416,7.631,7.631v42.974C79.154,163.824,75.738,167.241,71.524,167.241z    M47.957,221.844h23.566c4.215,0,7.631,3.417,7.631,7.633v42.974c0,4.215-3.416,7.632-7.631,7.632H47.957   c-4.215,0-7.633-3.417-7.633-7.632v-42.974C40.324,225.261,43.742,221.844,47.957,221.844z M47.957,344.758h23.566   c4.215,0,7.631,3.418,7.631,7.632v42.975c0,4.215-3.416,7.632-7.631,7.632H47.957c-4.215,0-7.633-3.417-7.633-7.632V352.39   C40.324,348.176,43.742,344.758,47.957,344.758z M198.982,326.856V185.144c0-5.875,6.359-9.547,11.447-6.609l122.725,70.856   c5.088,2.937,5.088,10.281,0,13.218L210.43,333.465C205.342,336.402,198.982,332.73,198.982,326.856z M464.041,167.241h-23.565   c-4.215,0-7.633-3.417-7.633-7.632v-42.974c0-4.215,3.418-7.631,7.633-7.631h23.565c4.215,0,7.631,3.416,7.631,7.631v42.974   C471.672,163.824,468.256,167.241,464.041,167.241z M440.476,221.844h23.565c4.215,0,7.631,3.417,7.631,7.633v42.974   c0,4.215-3.416,7.632-7.631,7.632h-23.565c-4.215,0-7.633-3.417-7.633-7.632v-42.974   C432.844,225.261,436.262,221.844,440.476,221.844z M440.476,344.758h23.565c4.215,0,7.631,3.418,7.631,7.632v42.975   c0,4.215-3.416,7.632-7.631,7.632h-23.565c-4.215,0-7.633-3.417-7.633-7.632V352.39   C432.844,348.176,436.262,344.758,440.476,344.758z",
    "ogv": "M0,74.451v363.098h512V74.451H0z M71.524,167.241H47.957c-4.215,0-7.633-3.417-7.633-7.632v-42.974   c0-4.215,3.418-7.631,7.633-7.631h23.566c4.215,0,7.631,3.416,7.631,7.631v42.974C79.154,163.824,75.738,167.241,71.524,167.241z    M47.957,221.844h23.566c4.215,0,7.631,3.417,7.631,7.633v42.974c0,4.215-3.416,7.632-7.631,7.632H47.957   c-4.215,0-7.633-3.417-7.633-7.632v-42.974C40.324,225.261,43.742,221.844,47.957,221.844z M47.957,344.758h23.566   c4.215,0,7.631,3.418,7.631,7.632v42.975c0,4.215-3.416,7.632-7.631,7.632H47.957c-4.215,0-7.633-3.417-7.633-7.632V352.39   C40.324,348.176,43.742,344.758,47.957,344.758z M198.982,326.856V185.144c0-5.875,6.359-9.547,11.447-6.609l122.725,70.856   c5.088,2.937,5.088,10.281,0,13.218L210.43,333.465C205.342,336.402,198.982,332.73,198.982,326.856z M464.041,167.241h-23.565   c-4.215,0-7.633-3.417-7.633-7.632v-42.974c0-4.215,3.418-7.631,7.633-7.631h23.565c4.215,0,7.631,3.416,7.631,7.631v42.974   C471.672,163.824,468.256,167.241,464.041,167.241z M440.476,221.844h23.565c4.215,0,7.631,3.417,7.631,7.633v42.974   c0,4.215-3.416,7.632-7.631,7.632h-23.565c-4.215,0-7.633-3.417-7.633-7.632v-42.974   C432.844,225.261,436.262,221.844,440.476,221.844z M440.476,344.758h23.565c4.215,0,7.631,3.418,7.631,7.632v42.975   c0,4.215-3.416,7.632-7.631,7.632h-23.565c-4.215,0-7.633-3.417-7.633-7.632V352.39   C432.844,348.176,436.262,344.758,440.476,344.758z",
    "webm": "M0,74.451v363.098h512V74.451H0z M71.524,167.241H47.957c-4.215,0-7.633-3.417-7.633-7.632v-42.974   c0-4.215,3.418-7.631,7.633-7.631h23.566c4.215,0,7.631,3.416,7.631,7.631v42.974C79.154,163.824,75.738,167.241,71.524,167.241z    M47.957,221.844h23.566c4.215,0,7.631,3.417,7.631,7.633v42.974c0,4.215-3.416,7.632-7.631,7.632H47.957   c-4.215,0-7.633-3.417-7.633-7.632v-42.974C40.324,225.261,43.742,221.844,47.957,221.844z M47.957,344.758h23.566   c4.215,0,7.631,3.418,7.631,7.632v42.975c0,4.215-3.416,7.632-7.631,7.632H47.957c-4.215,0-7.633-3.417-7.633-7.632V352.39   C40.324,348.176,43.742,344.758,47.957,344.758z M198.982,326.856V185.144c0-5.875,6.359-9.547,11.447-6.609l122.725,70.856   c5.088,2.937,5.088,10.281,0,13.218L210.43,333.465C205.342,336.402,198.982,332.73,198.982,326.856z M464.041,167.241h-23.565   c-4.215,0-7.633-3.417-7.633-7.632v-42.974c0-4.215,3.418-7.631,7.633-7.631h23.565c4.215,0,7.631,3.416,7.631,7.631v42.974   C471.672,163.824,468.256,167.241,464.041,167.241z M440.476,221.844h23.565c4.215,0,7.631,3.417,7.631,7.633v42.974   c0,4.215-3.416,7.632-7.631,7.632h-23.565c-4.215,0-7.633-3.417-7.633-7.632v-42.974   C432.844,225.261,436.262,221.844,440.476,221.844z M440.476,344.758h23.565c4.215,0,7.631,3.418,7.631,7.632v42.975   c0,4.215-3.416,7.632-7.631,7.632h-23.565c-4.215,0-7.633-3.417-7.633-7.632V352.39   C432.844,348.176,436.262,344.758,440.476,344.758z",

    "pdf": "M4 4C4 3.44772 4.44772 3 5 3H14H14.5858C14.851 3 15.1054 3.10536 15.2929 3.29289L19.7071 7.70711C19.8946 7.89464 20 8.149 20 8.41421V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V4Z M20 8H15V3 M11.5 13H11V17H11.5C12.6046 17 13.5 16.1046 13.5 15C13.5 13.8954 12.6046 13 11.5 13Z M15.5 17V13L17.5 13 M16 15H17 M7 17L7 15.5M7 15.5L7 13L7.75 13C8.44036 13 9 13.5596 9 14.25V14.25C9 14.9404 8.44036 15.5 7.75 15.5H7Z",
}
const byteFrmts = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
]
function formatSize(B: number) {
    let i = 0
    while (B > 1024) {
        i++
        B /= 1024
    }
    if (i == 0) return B + "B"
    return B.toFixed(2) + byteFrmts[i % 6]
}

export let visible = false
export class FileExplorer extends ItemView {
    //                    any: Object | ArrayPointer?, better than //@ts-ignore
    tree: { [key: string]: any } = {}
    container = this.contentEl;
    canLoad = true
    expandState = false;
    scrollToActive = false;
    // container = this.containerEl.children[1];
    constructor(leaf: WorkspaceLeaf, kill?: boolean) {
        super(leaf)
        this.icon = "book-plus"
        if (kill || !settingscope?.FM_Enabled) {
            this.canLoad = false
        }
        //@ts-ignore
        this.app.workspace.on("qol-remotes-kill-workspace", () => {
            //does absolutly nothing
            this.canLoad = false
            this.unload(true)
        })
    }
    getViewType() { return classN }
    getDisplayText() { return Dict("FILE_EXPLORER_VIEW_TITLE") }

    recursePush(sn: { [key: string]: any }, rel: string = "") {
        let tr = {}
        Object.keys(sn).forEach((nd) => {
            let el = sn[nd]
            if (el.t == "folder") {
                let TAF = this.app.vault.getAbstractFileByPath(rel + (rel.length > 0 ? "/" : "") + nd)
                if (TAF) {
                    //@ts-ignore
                    tr[rel + (rel.length > 0 ? "/" : "") + nd] = { t: "folder", TAbstract: TAF, Point: sn[nd] }
                    let st = this.recursePush(sn[nd].children, rel + (rel.length > 0 ? "/" : "") + nd)
                    Object.keys(st).forEach((sti) => {
                        //@ts-ignore
                        tr[sti] = st[sti]
                    })
                }
            } else {
                let TAF = this.app.vault.getAbstractFileByPath(rel + (rel.length > 0 ? "/" : "") + nd)
                if (TAF) {
                    //@ts-ignore
                    tr[rel + (rel.length > 0 ? "/" : "") + nd] = { t: "file", TAbstract: TAF, TFile: sn[nd].TFile, Point: sn[nd] }
                }
            }
        })
        return tr
    }

    async rebuildGUI() {
        this.container.empty()
        this.container.createDiv({ cls: "nav-header" }, (el) => {
            el.createDiv({ cls: "nav-buttons-container" }, (tb) => {
                tb.createDiv({ cls: "clickable-icon nav-action-button", attr: { "role": "button", "aria-label": "New Note" } }, (bt) => {
                    setTooltip(bt, bt.getAttribute("aria-label") || "")
                    createEl(bt, "svg", "Edit", "svg-icon lucide-edit")
                    bt.addEventListener("click", (ev) => {
                        let i = 0
                        while (true) {
                            let prbe = this.app.vault.getFileByPath("Untitled" + (i > 0 ? " " + i : "") + ".md")
                            if (!prbe) break
                            i++
                        }
                        this.app.vault.create("Untitled" + (i > 0 ? " " + i : "") + ".md", "").then((file) => {
                            this.tree["Untitled" + (i > 0 ? " " + i : "") + ".md"] = { path: file.path, t: "file", stats: file.stat, ext: file.extension, TFile: file }
                            this.rebuildGUI()
                        })
                    })
                })

                tb.createDiv({ cls: "clickable-icon nav-action-button", attr: { "role": "button", "aria-label": "New Folder" } }, (bt) => {
                    setTooltip(bt, bt.getAttribute("aria-label") || "")
                    createEl(bt, "svg", "FolderPlus", "svg-icon lucide-folder-plus")
                    bt.addEventListener("click", async (ev) => {
                        let amt = 0
                        let sn = "Untitled"
                        if (ev.altKey) {
                            await new Promise((r) => {
                                let self = new ConfirmationPrompt(this.app, "# Enter Quantity:\n&nbsp\n&nbsp\n&nbsp", "Fold Qnt", [["Confirm", "mod-submit"], ["Cancel", "mod-cancel"]], undefined, "New Name:", "", (result: number, _: boolean, rn: string) => {
                                    if (parseInt(rn.split(" ")[rn.split(" ").length - 1])) {
                                        if (rn && rn.length > 0 && parseInt(rn.trim().split(" ")[rn.trim().split(" ").length - 1])) {
                                            let i = parseInt(rn.trim().split(" ")[rn.trim().split(" ").length - 1])
                                            if (i <= 100) {
                                                amt = i
                                                sn = rn.trim().substring(0, rn.trim().length - (rn.trim().split(" ")[rn.trim().split(" ").length - 1].length + 1))
                                            } else {
                                                new Notice("It's not reccomended to create over 100 folders at a time.")
                                            }
                                        } else {
                                            new Notice("Please enter a number. Cancelled")
                                        }
                                    } else {
                                        if (rn && rn.length > 0 && parseInt(rn.trim())) {
                                            let i = parseInt(rn.trim())
                                            if (i <= 100) {
                                                amt = i
                                            } else {
                                                new Notice("It's not reccomended to create over 100 folders at a time.")
                                            }
                                        } else {
                                            new Notice("Please enter a number. Cancelled")
                                        }
                                    }
                                    self.close()
                                    r(true)
                                }, "Qnt: 1-100 enter a number or New Folder Qnt (Untitled 5)")
                                self.open()
                            })
                        } else {
                            amt = 1
                        }
                        for (let n = 0; n < amt; n++) {

                            let i = 0
                            while (true) {
                                let prbe = this.app.vault.getFolderByPath(sn + (i > 0 ? " " + i : ""))
                                if (!prbe) break
                                i++
                            }
                            await this.app.vault.createFolder(sn + (i > 0 ? " " + i : "")).then((fol) => this.rebuildGUI())
                            this.tree[sn + (i > 0 ? " " + i : "")] = { children: {}, t: "folder", collapsed: true }
                            console.log("created")
                        }
                        this.rebuildGUI()
                    })
                })

                tb.createDiv({ cls: "clickable-icon nav-action-button", attr: { "role": "button", "aria-label": "Expand All" } }, (bt) => {
                    setTooltip(bt, bt.getAttribute("aria-label") || "")
                    let svgico = createEl(bt, "svg", (this.expandState ? "ChevronsUpDown" : "ChevronsDownUp"), "svg-icon lucide-chevrons-down-up")
                    bt.addEventListener("click", (ev) => {
                        if (this.expandState) {
                            let tree = this.recursePush(this.tree)
                            Object.keys(tree).forEach((path: string) => {
                                //@ts-ignore
                                let f = tree[path]
                                if (f && f.t == "folder") {
                                    f.Point.collapsed = true
                                }
                            })
                        } else {
                            let tree = this.recursePush(this.tree)
                            Object.keys(tree).forEach((path: string) => {
                                //@ts-ignore
                                let f = tree[path]
                                if (f && f.t == "folder") {
                                    f.Point.collapsed = false
                                }
                            })
                        }
                        this.expandState = !this.expandState
                        this.rebuildGUI()
                    })
                })

                tb.createDiv({ cls: "clickable-icon nav-action-button" + (this.scrollToActive ? " is-active" : ""), attr: { "role": "button", "aria-label": "Scroll to active file" } }, (bt) => {
                    setTooltip(bt, bt.getAttribute("aria-label") || "")
                    let svgico = createEl(bt, "svg", "GalleryVertical", "svg-icon lucide-gallery-vertical")
                    bt.addEventListener("click", (ev) => {
                        this.scrollToActive = !this.scrollToActive
                        this.rebuildGUI()
                    })
                })
            })
        })
        let locRecurs = (lodir: { [key: string]: any }, el: Element, rel: string) => {
            Object.keys(lodir).forEach((attr: string) => {
                let data = lodir[attr]
                if (data.t && data.t == "folder") {
                    let mel = el.createDiv({ cls: "tree-item nav-folder" })
                    let title = mel.createDiv({ text: attr, cls: "tree-item-self nav-folder-title is-clickable mod-collapsible" })
                    setTooltip(title, Dict("FILE_EXPLORER_CONTEXT_FOLDER") + "\n" + Object.keys(data.children).length + " " + Dict("FILE_EXPLORER_CONTEXT_ITEMS"))
                    mel.addEventListener('contextmenu', (ev) => {
                        let TAF = this.app.vault.getFolderByPath(rel + (rel.length > 0 ? "/" : "") + attr)
                        let FM = new Menu()
                        FM.addSeparator()
                        FM.addItem((item) => {
                            item.setIcon("edit-3").setTitle("Rename").onClick((ev) => {
                                let self = new ConfirmationPrompt(this.app, "# Rename '**" + attr + "**':\n&nbsp", "Rename", [["Rename", "mod-rename"], ["Cancel", "mod-cancel"]], undefined, "New Name:", attr, (result: number, _: boolean, rn: string) => {
                                    if (result == 0) {
                                        self.markd = ""
                                        let abs = this.app.vault.getAbstractFileByPath(rel + (rel.length > 0 ? "/" : "") + attr)
                                        if (abs) this.app.vault.rename(abs, rel + (rel.length > 0 ? "/" : "") + rn)
                                        if (title) title.childNodes[0].textContent = rn
                                        self.close()
                                    } else {
                                        self.markd = ""
                                        self.close()
                                    }
                                })
                                self.open()
                            })
                        })
                        FM.addItem((item) => {
                            item.setIcon("trash-2").setTitle("Delete").onClick((ev) => {
                                if (settingscope && !settingscope.FM_Deletion_Warning) {
                                    let abs = this.app.vault.getAbstractFileByPath(rel + (rel.length > 0 ? "/" : "") + attr)
                                    if (abs) this.app.vault.trash(abs, true)
                                    if (mel) mel.remove()
                                } else {
                                    let self = new ConfirmationPrompt(this.app, "# Move to trash\n\nAre you sure you want to delete '**" + attr + "**'\n\nIt will be moved to your **system trash**.\n\n", "Move to trash", [["Delete", "mod-warning"], ["Cancel", "mod-cancel"]], "Don't show again", undefined, undefined, (result: number) => {
                                        if (result == 0) {
                                            self.markd = ""
                                            let abs = this.app.vault.getAbstractFileByPath(rel + (rel.length > 0 ? "/" : "") + attr)
                                            if (abs) this.app.vault.trash(abs, true)
                                            if (mel) mel.remove()
                                            self.close()
                                        } else {
                                            self.markd = ""
                                            self.close()
                                        }
                                    })
                                    self.open()
                                }
                            })
                            //@ts-ignore
                            item.setWarning(true)
                        })
                        FM.addSeparator()
                        FM.addItem((item) => {
                            let ss = lodir[attr].collapsed
                            item.setIcon(ss ? "chevrons-up-down" : "chevrons-down-up").setTitle(ss ? "Expand All" : "Collapse All").onClick((ev) => {
                                let tree = this.recursePush(this.tree)
                                Object.keys(tree).forEach((path: string) => {
                                    if (path.startsWith(rel + (rel.length > 0 ? "/" : "") + attr)) {
                                        //@ts-ignore
                                        let f = tree[path]
                                        if (f && f.t == "folder") {
                                            f.Point.collapsed = !ss
                                        }
                                    }
                                })
                                this.rebuildGUI()
                            })
                        })
                        if (TAF) this.app.workspace.trigger("file-menu", FM, TAF, "qol-triggered")
                        FM.showAtMouseEvent(ev)
                    })
                    let csvg = title.createDiv({ cls: "tree-item-icon collapse-icon" })
                    if (data.collapsed) {
                        csvg.addClass("is-collapsed")
                    }
                    // let csvg = title.createDiv({ cls: "tree-item-icon collapse-icon is-collapsed" })
                    //                            OBSIDIAN.D.TS invalid completion.
                    let svg = csvg.createSvg("svg"/*,{cls:"svg-icon right-triangle"}*/)
                    svg.addClasses(["svg-icon", "right-triangle"])
                    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
                    svg.setAttribute("width", "24")
                    svg.setAttribute("height", "24")
                    svg.setAttribute("viewBox", "0 0 24 24")
                    svg.setAttribute("fill", "none")
                    svg.setAttribute("stroke", "currentColor")
                    svg.setAttribute("stroke-width", "2")
                    svg.setAttribute("stroke-linecap", "round")
                    svg.setAttribute("stroke-linejoin", "round")
                    let ico = svg.createSvg("path")
                    if (Object.keys(data.children).length == 0) {
                        csvg.removeClass("is-collapsed")
                        data.collapsed = false
                        ico.setAttribute("d", "M21 9V7C21 6.44772 20.5523 6 20 6H10L9 4H4L3.21115 5.57771C3.07229 5.85542 3 6.16165 3 6.47214V9 M3.91321 20H20.0868C20.604 20 21.0359 19.6056 21.0827 19.0905L21.9009 10.0905C21.9541 9.50492 21.493 9 20.905 9H3.09503C2.507 9 2.0459 9.50492 2.09914 10.0905L2.91732 19.0905C2.96415 19.6056 3.39601 20 3.91321 20Z")
                    } else {
                        ico.setAttribute("d", "M3 8L12 17L21 8")
                    }
                    let cel = mel.createDiv({ cls: "tree-item-children nav-folder-children qol-FM-clipY" })
                    if (data.collapsed) cel.remove()
                    this.registerDomEvent(title, "click", (ev) => {
                        if (Object.keys(data.children).length > 0) {
                            if (data.collapsed) {
                                csvg.removeClass("is-collapsed")
                                mel.appendChild(cel)
                            } else {
                                csvg.addClass("is-collapsed")
                                cel.remove()
                            }
                            data.collapsed = !data.collapsed
                        }
                    })
                    locRecurs(data.children, cel, rel + "/" + attr)
                } else {
                    let mel = el.createDiv({ cls: "tree-item nav-file" })
                    let title = mel.createDiv({ cls: "tree-item-self nav-file-title tappable is-clickable" })
                    setTooltip(title, Dict("FILE_EXPLORER_CONTEXT_FILE") + "\n" + formatSize(data.stats.size))
                    this.registerDomEvent(title, "contextmenu", (ev) => {
                        let TAF = this.app.vault.getAbstractFileByPath(data.path)
                        let FM = new Menu()
                        if (TAF) this.app.workspace.trigger("file-menu", FM, TAF)
                        FM.showAtMouseEvent(ev)
                    })
                    this.registerDomEvent(title, "click", (ev) => {
                        if (data.path) {
                            let file = this.app.vault.getFileByPath(data.path)
                            if (file) this.app.workspace.getLeaf(true).openFile(file);
                        }
                    })
                    title.createDiv({ text: attr.substring(0, attr.length - (data.ext.length + 1)), cls: "tree-item-inner nav-file-title-content" })
                    if (data.ext && typeof (data.ext) == "string" && fileIcons[data.ext.toLowerCase()]) {
                        let csvg = title.createDiv({ cls: "tree-item-icon" })
                        let svg = csvg.createSvg("svg")
                        // svg.addClasses(["svg-icon", "right-triangle"])
                        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
                        svg.setAttribute("width", "24")
                        svg.setAttribute("height", "24")
                        svg.setAttribute("viewBox", "0 0 30 30")
                        svg.setAttribute("fill", "none")
                        svg.setAttribute("stroke", "currentColor")
                        svg.setAttribute("stroke-width", "2")
                        svg.setAttribute("stroke-linecap", "round")
                        svg.setAttribute("stroke-linejoin", "round")
                        let ico = svg.createSvg("path")
                        //@ts-ignore
                        ico.setAttribute("d", fileIcons[data.ext.toLowerCase()])
                        if (data.path.toLowerCase().endsWith(".excalidraw.md")) ico.setAttribute("d", fileIcons["cexcalidraw"])
                    }
                    if (data.ext != "md") {
                        let cls = title.createDiv({ text: data.ext.toUpperCase(), cls: "nav-file-tag" })
                    }
                }
            })
        }
        let fc = this.container.createDiv({ cls: "qol-tree-content nav-files-container node-insert-event show-unsupported" })
        Object.keys(this.tree).forEach((f) => {
            if (this.tree[f].t == "file") {
                let rc = {}
                //@ts-ignore
                rc[f] = this.tree[f]
                locRecurs(rc, fc, "")
            }
        })
        Object.keys(this.tree).forEach((f) => {
            if (this.tree[f].t == "folder") {
                let rc = {}
                //@ts-ignore
                rc[f] = this.tree[f]
                locRecurs(rc, fc, "")
            }
        })
        // locRecurs(this.tree, this.container, "")
    }

    async onload() {
        if (this.canLoad) {
            visible = true
            if (cb) cb()
            this.container.empty();

            const bf = this.app.vault.getFiles();     //building-files
            const bd = this.app.vault.getAllFolders();//building-directories

            if (bf && bd) {
                // const tree: { [key: string]: any } = {}
                bf.forEach((file: TFile) => {
                    let innerf = this.tree
                    let spath = file.path.split("/")
                    spath.forEach((path, ind) => {
                        if (ind + 1 < spath.length) {
                            if (!innerf[path]) innerf[path] = { children: {}, t: "folder", collapsed: true }
                            innerf = innerf[path].children
                        } else {
                            innerf[path] = { path: file.path, t: "file", stats: file.stat, ext: file.extension, TFile: file }
                        }
                    })
                })
                bd.forEach((dir: TFolder) => {
                    let innerf = this.tree
                    let spath = dir.path.split("/")
                    spath.forEach((path) => {
                        if (!innerf[path]) {
                            innerf[path] = { children: {}, t: "folder" }
                        }
                        innerf = innerf[path].children
                    })
                })

                this.rebuildGUI()
            }


            // files.forEach((file: TFile) => {
            //     const item = container.createEl('button', { text: file.path });
            // });
        } else {
            this.leaf.detach()
            this.unload()
        }
    }
    async unload(sent?: boolean) {
        if (this.canLoad) {
            visible = false
            //     if (cb) cb()
            if (settingscope?.FM_Enabled && !sent) {
                new Notice("Please disable QOL file explorer in the plugin's settings.")
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
        }
    }
}

export function ConstructExplorer() {

}
export function setCB(cbf: Function) {
    cb = cbf
}