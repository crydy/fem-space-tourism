import { fastLog } from './utils/functions.js';
import waitDOMContent from './utils/dom-waiting.js';
import setBrowserWEBPSupportMark from  './utils/webp-support.js';
import { setupMobileMenu } from  './modules/mobile-menu.js';
import fillPage from './modules/interactive-data.js';

const jsonDataPath = 'files/data.json';

const CREW_SLIDE_INTERVAL = 8000;
const CREW_SLIDE_DALAY_AFTER_CLICK = 15000;

fastLog();

waitDOMContent()
.then(() => setBrowserWEBPSupportMark())
.then(webpSupport => {

    setupMobileMenu();
    
    fillPage(
        jsonDataPath,
        webpSupport,
        CREW_SLIDE_INTERVAL,
        CREW_SLIDE_DALAY_AFTER_CLICK
    );
});