const fs = require('fs');
const path = require('path');

const sessionFilePath = path.join(__dirname, '../src/lib/session.ts');

try {
    let content = fs.readFileSync(sessionFilePath, 'utf8');

    const regex = /export const SESSION_COOKIE_NAME = "mbg_session(_v\d+)?";/;

    const match = content.match(regex);

    if (match) {
        let newVersion = 2;
        if (match[1]) {
            const currentVersion = parseInt(match[1].replace('_v', ''), 10);
            newVersion = currentVersion + 1;
        }

        const newLine = `export const SESSION_COOKIE_NAME = "mbg_session_v${newVersion}";`;
        content = content.replace(regex, newLine);

        fs.writeFileSync(sessionFilePath, content, 'utf8');
        console.log(`Successfully updated session cookie name to: mbg_session_v${newVersion}`);
        console.log('This will invalidate all existing sessions and trigger a hot reload.');
    } else {
        console.error('Could not find SESSION_COOKIE_NAME definition in src/lib/session.ts');
        process.exit(1);
    }

} catch (error) {
    console.error('Error updating session file:', error);
    process.exit(1);
}
