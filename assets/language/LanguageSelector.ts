import English from "./english"

const langs: { [key: string]: {["parser"]:Function,["name"]:string} } = {
    "EN": {parser:English,name:"English"} //TRUNC NAME: {parser:FUNC,name:LocalEName}
}

let cache = "EN"

export default (key: (
    "" |
    "TITLE" |
    "DESC" |
    "SETTINGS_WORD_PROCESSING_DESC" |
    "SETTINGS_WORD_PROCESSING_TITLE" |
    "SETTINGS_WORD_PROCESSING_NONSYMBOL_COUNT_TITLE" |
    "SETTINGS_WORD_PROCESSING_NONSYMBOL_COUNT_DESC" |
    "SETTINGS_WORD_PROCESSING_AUTO_SPACE_TITLE" |
    "SETTINGS_WORD_PROCESSING_AUTO_SPACE_DESC" |
    "SETTINGS_WORD_PROCESSING_AUTO_SPACE_SPACING_TITLE" |
    "SETTINGS_WORD_PROCESSING_AUTO_SPACE_SPACING_DESC" |
    "SETTINGS_WORD_PROCESSING_AUTO_SHIFT_TITLE" |
    "SETTINGS_WORD_PROCESSING_AUTO_SHIFT_DESC" |
    "SETTINGS_WORD_PROCESSING_GRAMMER_TITLE" |
    "SETTINGS_WORD_PROCESSING_GRAMMER_DESC" |
    "SETTINGS_WORD_PROCESSING_WRITE_TIMER_TITLE" |
    "SETTINGS_WORD_PROCESSING_WRITE_TIMER_DESC" |
    "SETTINGS_WORD_PROCESSING_WRITE_TIMER_FORMAT_TITLE" |
    "SETTINGS_WORD_PROCESSING_WRITE_TIMER_FORMAT_DESC" |
    "SETTINGS_RECURSIVE_TITLE" |
    "SETTINGS_RECURSIVE_DESC" |
    "SETTINGS_RECURSIVE_FOLDERS_TITLE" |
    "SETTINGS_RECURSIVE_FOLDERS_DESC" |
    "SETTINGS_RECURSIVE_FOLDERS_DESC_SUB" |
    "SETTINGS_MISC_TITLE" |
    "SETTINGS_MISC_DESC" |
    "SETTINGS_MISC_FUNCTIONS_TITLE" |
    "SETTINGS_MISC_FUNCTIONS_DESC" |
    "SETTINGS_TOUCH_SCREEN_TITLE" |
    "SETTINGS_TOUCH_SCREEN_DESC" |
    "SETTINGS_TOUCH_SCREEN_ENABLED_TITLE" |
    "SETTINGS_TOUCH_SCREEN_ENABLED_DESC" |
    "SETTINGS_TOUCH_SCREEN_FILE_DRAG_TITLE" |
    "SETTINGS_TOUCH_SCREEN_FILE_DRAG_DESC" |
    "SETTINGS_TOUCH_SCREEN_FILE_DRAG_ROOT_WARN_TITLE" |
    "SETTINGS_TOUCH_SCREEN_FILE_DRAG_ROOT_WARN_DESC" |
    "SETTINGS_PLUGIN_TITLE" |
    "SETTINGS_PLUGIN_DESC" |
    "SETTINGS_PLUGIN_UPDATE_CHECK_TITLE" |
    "SETTINGS_PLUGIN_UPDATE_CHECK_DESC" |
    "SETTINGS_PLUGIN_UPDATE_CHECK_DESC_SUB"|
    "SETTINGS_PLUGIN_LANGUAGE_TITLE"|
    "SETTINGS_PLUGIN_LANGUAGE_DESC" |
    "SETTINGS_PLUGIN_CHANGELOG_TITLE" |
    "SETTINGS_PLUGIN_CHANGELOG_DESC"
), userLanguage?: undefined | string): string => {
    if (userLanguage == "LANG") {
        let out = "English"
        Object.keys(langs).forEach((l) => {
            if(l==key) out = langs[l].name
        })
        return out
    }
    if (key == "") {
        if (userLanguage) {
            cache = userLanguage
            return ""
        } else {
            let str = ""
            Object.keys(langs).forEach((l) => {
                str += (str.length > 0 ? "," : "") + l
            })
            return str
        }
    }
    if (userLanguage && langs[userLanguage]) {
        cache = userLanguage
        return langs[userLanguage].parser(key)
    } else {
        return langs[cache].parser(key)
    }
    return "cannot find a string"
}