

const strings: { [key: string]: string } = {
    "TITLE": "QOL - quality of life",
    "DESC": "Adds several improvements and fixes to Obsidian.",

    "SETTINGS_WORD_PROCESSING_TITLE": "Word processing",
    "SETTINGS_WORD_PROCESSING_DESC": "Many utilities while editing",

    "SETTINGS_WORD_PROCESSING_NONSYMBOL_COUNT_TITLE": "Non-Symbol character count",
    "SETTINGS_WORD_PROCESSING_NONSYMBOL_COUNT_DESC": "Get how many characters youve typed without spaces,underscores,numbers,etc",

    "SETTINGS_WORD_PROCESSING_AUTO_SPACE_TITLE": "Automatic space on period",
    "SETTINGS_WORD_PROCESSING_AUTO_SPACE_DESC": "Automatically place a space whenever you press period. Occurs when typing next sentence.",

    "SETTINGS_WORD_PROCESSING_AUTO_SPACE_SPACING_TITLE": "Automatic space - Double spacing",
    "SETTINGS_WORD_PROCESSING_AUTO_SPACE_SPACING_DESC": "Changes the 'Automatic space on period' to have two spaces instead of one.",

    "SETTINGS_WORD_PROCESSING_AUTO_SHIFT_TITLE": "Automatic capitals",
    "SETTINGS_WORD_PROCESSING_AUTO_SHIFT_DESC": "Starts each new sentence with a capital letter.",

    "SETTINGS_WORD_PROCESSING_GRAMMER_TITLE": "Automatic grammer tweaks",
    "SETTINGS_WORD_PROCESSING_GRAMMER_DESC": "turns itll -> it'll. Will not change the following: i(')d,he(')ll,we(')re as theres no contextualization.",

    "SETTINGS_WORD_PROCESSING_WRITE_TIMER_TITLE": "Writing / Break timer",
    "SETTINGS_WORD_PROCESSING_WRITE_TIMER_DESC": "Adds a timer in the status bar thats in the format you chose below",

    "SETTINGS_WORD_PROCESSING_WRITE_TIMER_FORMAT_TITLE": "Writing timer format:",
    "SETTINGS_WORD_PROCESSING_WRITE_TIMER_FORMAT_DESC": "%t = total time; %w = writing time; %b = break time",

    "SETTINGS_RECURSIVE_TITLE": "Recursive",
    "SETTINGS_RECURSIVE_DESC": "All of the recursive functions within qol. These will be more intensive depending on the amount of instructions. You can see the timecomplexity when it says O(n) or O(files) meaning it would have to do something on every file.",

    "SETTINGS_RECURSIVE_FOLDERS_TITLE": "Recursively expand/collapse folder",
    "SETTINGS_RECURSIVE_FOLDERS_DESC": "Right Click (or hold) on a folder and press 'Expand recursively' or 'Collapse recursively' to trigger.",
    "SETTINGS_RECURSIVE_FOLDERS_DESC_SUB": "O(n file and folders)",

    "SETTINGS_MISC_TITLE": "Misc",
    "SETTINGS_MISC_DESC": "A list of all of the settings that would not be worth creating a new tab for.",

    "SETTINGS_MISC_FUNCTIONS_TITLE": "Functions work with its counterpart off",
    "SETTINGS_MISC_FUNCTIONS_DESC": "If disabled, a function like 'Expand all folders within root' will not work if 'qol/settings/Recursive/Recursively expand/collapse folder' is disabled.",

    "SETTINGS_TOUCH_SCREEN_TITLE": "TouchScreen",
    "SETTINGS_TOUCH_SCREEN_DESC": "Contains support for computer touchscreens that are not already integrated in to Obsidian.",

    "SETTINGS_TOUCH_SCREEN_ENABLED_TITLE": "Touchscreen support",
    "SETTINGS_TOUCH_SCREEN_ENABLED_DESC": "Enables all of the TouchScreen features.",

    "SETTINGS_TOUCH_SCREEN_FILE_DRAG_TITLE": "Touchscreen - File dragging",
    "SETTINGS_TOUCH_SCREEN_FILE_DRAG_DESC": "Enables the ability to drag files within the filetree using a touchscreen.",

    "SETTINGS_TOUCH_SCREEN_FILE_DRAG_ROOT_WARN_TITLE": "Touchscreen - File Dragging: Root warnings",
    "SETTINGS_TOUCH_SCREEN_FILE_DRAG_ROOT_WARN_DESC": "Whenever moving a file in to root it will confirm if you want to continue or cancel the operation.",

    "SETTINGS_PLUGIN_TITLE": "Plugin config",
    "SETTINGS_PLUGIN_DESC": "Settings to change internal features.",

    "SETTINGS_PLUGIN_UPDATE_CHECK_TITLE": "Update checking",
    "SETTINGS_PLUGIN_UPDATE_CHECK_DESC": "When enabled you will receive a Notice every time the plugin needs an update.",
    "SETTINGS_PLUGIN_UPDATE_CHECK_DESC_SUB": "Sends an HTTPS request to github on startup to check for updates. Does not store any data. Has a cooldown of half an hour.",

    "SETTINGS_PLUGIN_LANGUAGE_TITLE":"Global plugin language",
    "SETTINGS_PLUGIN_LANGUAGE_DESC":"This is the language that will be set throughout the plugin.",

    "SETTINGS_PLUGIN_CHANGELOG_TITLE":"ChangeLog on update/start",
    "SETTINGS_PLUGIN_CHANGELOG_DESC":"See whats added to the plugin when its updated.",
}

export default (key: string) => {
    if (key && strings[key]) {
        return strings[key]
    } else {
        return "LNG(" + key + ")"
    }
}