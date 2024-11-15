const config = require('../config');
const fs = require('fs-extra');

async function createDir(name, path) {
    if (!fs.existsSync(path)){
        await fs.mkdir(path, { recursive: true }).then(
            async () => console.log(`Storage ${name} dir created: ${path}`)
        );
    } else {
        console.log(`Storage ${name} dir: ${path}`);
    }
}

module.exports = async function() {
    await createDir('downloads', config.nftImages.storeDownloadsPath);
    await createDir('compresses', config.nftImages.storeCompressesPath);
};
