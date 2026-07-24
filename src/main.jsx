import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import wallpaper from './assets/wallpaper.png'

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Remove the static boot cover once React has painted, the lock screen
// wallpaper is loaded, AND the viewport size has stopped changing — so the
// desktop never peeks through. That last condition matters on mobile: on a
// cold load the network delay is enough for the browser's address bar to
// finish showing/hiding before we'd reveal anything, but on a cached reload
// everything resolves almost instantly, sometimes before the address bar
// animation settles, which briefly exposes the true (pre-settle) viewport
// edges — showing a sliver of the menu bar/dock behind the lock screen.
// A timeout caps the wait in case the image stalls or the viewport never
// settles (e.g. address bar still animating after 4s).
const removeCover = () => {
  const cover = document.getElementById('boot-cover');
  if (cover) cover.remove();
};

const painted = new Promise((resolve) => {
  requestAnimationFrame(() => requestAnimationFrame(resolve));
});
const wallpaperLoaded = new Promise((resolve) => {
  const img = new Image();
  img.onload = resolve;
  img.onerror = resolve;
  img.src = wallpaper;
});
const viewportStable = new Promise((resolve) => {
  const SETTLE_MS = 150;
  let settleTimer = window.setTimeout(resolve, SETTLE_MS);
  const onResize = () => {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(finish, SETTLE_MS);
  };
  const finish = () => {
    window.removeEventListener('resize', onResize);
    window.visualViewport?.removeEventListener('resize', onResize);
    resolve();
  };
  window.addEventListener('resize', onResize);
  window.visualViewport?.addEventListener('resize', onResize);
});
const timeout = new Promise((resolve) => setTimeout(resolve, 4000));

Promise.race([
  Promise.all([painted, wallpaperLoaded, viewportStable]),
  timeout,
]).then(removeCover);
