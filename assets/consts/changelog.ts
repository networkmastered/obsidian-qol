let cl:{[key:string]:string} = {
    "1.3.0":
        `# QOL(Quality of Life) (1.3.0):
Thank you for using Quality of Life!

Updates:

- Language Option

- ChangeLog

- ChangeLog Setting



- The plugin was refactored into different files to be easier to edit.`,
    "1.4.0":
        `# Quality of Life (1.4.0):
Thank you for using Quality of Life!

Updates:

- QOL file explorer BETA released, please report any issues.

- Confirmation prompts

- File explorer deletion warning

- File explorer Folder context menu

- Icon creation system

- Bug fixes

- TODO: re-write the README`,
"1.5.0":`
Development test unreleased.
`,
"1.5.5":`# Quality of Life (1.5.5):

Thank you for using Quality of Life!

Updates:

- Patch for command names.

- Attempt to get file manager not erroring on start. Error is app.js and goes down the stack to the plugin.

- No longer using the compressed icons as it is more beneficial to just not use what you don't need. This also helps with performance at startup.

- Bug fix: check update setting now has an effect`,

}
export default cl