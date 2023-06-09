import { fastLog, waitDOMContent, setBrowserWEBPSupportMark } from './utils/functions.js';
import { pagesSetup } from './utils/project-setup.js'; // all setups here
import { setupMobileMenu } from  './modules/mobile-menu.js';
import fillPage from './modules/pages.js';

fastLog();
waitDOMContent()
    .then(() => setBrowserWEBPSupportMark())
    .then(webpSupport => {
        setupMobileMenu();
        fillPage(pagesSetup.jsonDataPath, webpSupport);
    });