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

// Remove the static boot cover once React has painted AND the lock screen
// wallpaper is loaded, so the desktop never peeks through. A timeout caps the
// wait in case the image stalls.
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
const timeout = new Promise((resolve) => setTimeout(resolve, 4000));

Promise.race([Promise.all([painted, wallpaperLoaded]), timeout]).then(removeCover);
