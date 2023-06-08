export default function waitDOMContent() {
    return new Promise( resolve => {
        window.addEventListener('DOMContentLoaded', () => resolve());
    });
}