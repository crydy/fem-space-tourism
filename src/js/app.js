import { fastLog } from './utils/functions.js';
import setBrowserWEBPSupportMark from  './utils/webp-support.js';
import { mobileMenu } from  './modules/mobile-menu.js';


// start the code after HTML loading
window.addEventListener('DOMContentLoaded', () => {

    fastLog();

    setBrowserWEBPSupportMark();

    mobileMenu();
});