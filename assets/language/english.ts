

const strings: { [key: string]: string } = {

    //SETTINGS
    "CONTRIBUTE": "if you have any issues or features please report the <a href='https://github.com/networkmastered/obsidian-qol/issues/new'>here</a>. You can also help contribute to the plugin or language support <a href='https://github.com/networkmastered/obsidian-qol/'>here</a>.", //ihtm

    "TITLE": "QOL - quality of life",
    "DESC": "Adds several improvements and fixes to Obsidian.",

    "SETTINGS_WORD_PROCESSING_TITLE": "Word processing",
    "SETTINGS_WORD_PROCESSING_DESC": "Many utilities while editing",

    "SETTINGS_WORD_PROCESSING_NONSYMBOL_COUNT_TITLE": "Non-Symbol character count",
    "SETTINGS_WORD_PROCESSING_NONSYMBOL_COUNT_DESC": "Get how many characters youve typed without spaces,underscores,numbers,etc",
    "SETTINGS_WORD_PROCESSING_NONSYMBOL_COUNT_SUB": "O(n of characters)",

    "SETTINGS_WORD_PROCESSING_AUTO_SPACE_TITLE": "Automatic space on period",
    "SETTINGS_WORD_PROCESSING_AUTO_SPACE_DESC": "Automatically place a space whenever you press period. Occurs when typing next sentence.",

    "SETTINGS_WORD_PROCESSING_AUTO_SPACE_SPACING_TITLE": "Automatic space - Double spacing",
    "SETTINGS_WORD_PROCESSING_AUTO_SPACE_SPACING_DESC": "Changes the 'Automatic space on period' to have two spaces instead of one.",

    "SETTINGS_WORD_PROCESSING_AUTO_SHIFT_TITLE": "Automatic capitals",
    "SETTINGS_WORD_PROCESSING_AUTO_SHIFT_DESC": "Starts each new sentence with a capital letter.",

    "SETTINGS_WORD_PROCESSING_GRAMMER_TITLE": "Automatic grammer tweaks",
    "SETTINGS_WORD_PROCESSING_GRAMMER_DESC": "changes itll -> it'll. Will not change the following: i(')d,he(')ll,we(')re as theres no contextualization.",

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
    "SETTINGS_TOUCH_SCREEN_FILE_DRAG_SUB": "binds: (n file and folders * 3)",

    "SETTINGS_TOUCH_SCREEN_FILE_DRAG_ROOT_WARN_TITLE": "Touchscreen - File dragging: Root warnings",
    "SETTINGS_TOUCH_SCREEN_FILE_DRAG_ROOT_WARN_DESC": "Whenever moving a file in to root it will confirm if you want to continue or cancel the operation.",

    "SETTINGS_PLUGIN_TITLE": "Plugin config",
    "SETTINGS_PLUGIN_DESC": "Settings to change internal features.",

    "SETTINGS_PLUGIN_UPDATE_CHECK_TITLE": "Update checking",
    "SETTINGS_PLUGIN_UPDATE_CHECK_DESC": "When enabled you will receive a Notice every time the plugin has an update.",
    "SETTINGS_PLUGIN_UPDATE_CHECK_DESC_SUB": "Sends an HTTPS request to github on startup to check for updates. Does not store any data. Has a cooldown of half an hour.",

    "SETTINGS_PLUGIN_LANGUAGE_TITLE": "Global plugin language",
    "SETTINGS_PLUGIN_LANGUAGE_DESC": "This is the language that will be set throughout the plugin.",

    "SETTINGS_PLUGIN_CHANGELOG_TITLE": "ChangeLog on update/start",
    "SETTINGS_PLUGIN_CHANGELOG_DESC": "See whats added to the plugin when its updated.",

    "SETTINGS_FILE_EXPLORER_TITLE": "File explorer",
    "SETTINGS_FILE_EXPLORER_DESC": "A custom file explorer that implaments some new features. The new file explorer will be opened at the right like the original file explorer. The file explorer cannot be closed. Please disable the setting instead",
    "SETTINGS_FILE_EXPLORER_ENABLED_TITLE": "Enable file explorer",
    "SETTINGS_FILE_EXPLORER_ENABLED_DESC": "If disabled, you can close the QOL File explorer by rightclicking the book with plus at the top and pressing 'Close'. Or reload Obsidian.",
    
    "SETTINGS_FILE_EXPLORER_WARNINGS_TITLE": "Deletion warning",
    "SETTINGS_FILE_EXPLORER_WARNINGS_DESC": "When deleting a file you will receive a message asking if you would like to delete it. Disabling this removes that. This can be disabled by the checkbox within the prompt.",
    "SETTINGS_FILE_EXPLORER_REFRESHER_TITLE": "Full tree reloading",
    "SETTINGS_FILE_EXPLORER_REFRESHER_DESC": "Every time a change is made it will reload the entire view. Else it will only change what was changed",

    // FILE EXPLORER

    "FILE_EXPLORER_ICON_HOVER": "QOL: File explorer",
    "FILE_EXPLORER_ICON_HOVER_DISABLED": "QOL: File explorer(already open!)",

    // {FILE_EXPLORER_CONTEXT_FILE}\n[size]
    "FILE_EXPLORER_CONTEXT_FILE": "File",
    // {FILE_EXPLORER_CONTEXT_FILE}\n[itemCount] {FILE_EXPLORER_CONTEXT_ITEMS}
    "FILE_EXPLORER_CONTEXT_FOLDER": "Folder",
    "FILE_EXPLORER_CONTEXT_ITEMS": "Items",

    "FILE_EXPLORER_VIEW_TITLE": "QOL file explorer",
    "FILE_EXPLORER_VIEW_WARN": "Please disable QOL file explorer in the plugin's settings.",

    "FILE_EXPLORER_CREATE_FOLDER": "# Enter quantity:\n&nbsp\n&nbsp\n&nbsp",
    "FILE_EXPLORER_CREATE_FOLDER_CONTENT": "Create folders:",
    "FILE_EXPLORER_CREATE_FOLDER_CONTEXT": "Create multiple",
    "FILE_EXPLORER_CREATE_FOLDER_MULTPLE_ERROR": "Cannot create over 100 folders at a time. Cancelled",
    "FILE_EXPLORER_CREATE_FOLDER_MULTPLE_NO_NUMBER": "Please enter a number. Cancelled",
    "FILE_EXPLORER_CREATE_FOLDER_MULTPLE_PLACEHOLDER": "Qnt: 1-100 enter a number or 'New folder [AMT]'",

    "FILE_EXPLORER_RENAME": "# Rename '**{{name}}**':\n&nbsp",
    "FILE_EXPLORER_RENAME_ACTION": "Rename",
    "FILE_EXPLORER_RENAME_CONTENT": "New name:",

    "FUNC_NEW_FILE": "New Note",
    "FUNC_NEW_FOLDER": "New folder",
    "FUNC_SCROLL_TO_ACTIVE": "Scroll to active file",
    "FUNC_EXPAND_ALL": "Expand all",
    "FUNC_COLLAPSE_ALL": "Collapse all",
    "FUNC_DELETE": "Delete",
    "FUNC_DELETE_WARN_TITLE":"# Move to trash\n&nbsp\nAre you sure you want to delete '**{file}**'\n\nIt will be moved to your **system trash**.\n\n",
    "FUNC_DELETE_WARN_CONTENT":"Move to trash",
    "FUNC_DELETE_ACTION":"Delete",
    "FUNC_DELETE_DONTSOHW":"Don't show again",


    "CANCEL":"Cancel",
    "CONFIRM":"Confirm",

    //Must support Obsidian's file/folder naming:

    "FILE_EXPLORER_NEW_FILE": "Untitiled",
}









export default (key: string) => {
    if (key && strings[key]) {
        return strings[key]
    } else {
        return "LNG(" + key + ")"
    }
}