import {cpSync} from 'fs';

const distFolder = './dist/ng/';

cpSync('./LICENSE.txt', `${distFolder}LICENSE.txt`);
cpSync('./README.md', `${distFolder}README.md`);
cpSync('./CONTRIBUTING.md', `${distFolder}CONTRIBUTING.md`);
cpSync('./CODE_OF_CONDUCT.md', `${distFolder}CODE_OF_CONDUCT.md`);
