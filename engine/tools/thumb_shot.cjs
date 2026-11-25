const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+process.argv[2]);await p.waitForFunction(()=>document.title==='done');
const el=await p.$('#c');await el.screenshot({path:process.argv[3],type:'jpeg',quality:88});await b.close();})();
