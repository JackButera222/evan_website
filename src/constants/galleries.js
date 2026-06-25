import wallpaper from "../assets/wallpaper.png";
import hero from "../assets/hero.png";

// Static gallery items
export const galleryPhotosStatic = [
  { src: wallpaper, alt: "Colorful macOS wallpaper", position: "center" },
  {
    src: wallpaper,
    alt: "Blue and pink wallpaper detail",
    position: "18% 42%",
  },
  { src: wallpaper, alt: "Orange wallpaper detail", position: "74% 45%" },
  { src: wallpaper, alt: "Purple wallpaper detail", position: "52% 72%" },
  { src: hero, alt: "Portrait photo", position: "center" },
  { src: wallpaper, alt: "Green wallpaper detail", position: "35% 24%" },
  { src: wallpaper, alt: "Bright wallpaper detail", position: "82% 72%" },
  { src: wallpaper, alt: "Soft wallpaper detail", position: "10% 74%" },
];

// Build-time resized variants via vite-imagetools: small WebP thumbnails for
// the grids, capped WebP for the full-screen preview. Originals stay untouched.
const portfolioThumbModules = import.meta.glob(
  "/src/assets/portfolio/photos/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default", query: { w: 480, format: "webp", quality: 70 } },
);
const portfolioFullModules = import.meta.glob(
  "/src/assets/portfolio/photos/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default", query: { w: 1600, format: "webp", quality: 80 } },
);
const portfolioVideoModules = import.meta.glob(
  "/src/assets/portfolio/videos/*.{mp4,webm,ogg}",
  { eager: true, import: "default" },
);

const portfolioPhotos = Object.keys(portfolioFullModules).map((p) => ({
  src: portfolioFullModules[p],
  thumb: portfolioThumbModules[p],
  alt: p.split("/").pop(),
  position: "center",
}));

const portfolioVideos = Object.keys(portfolioVideoModules).map((p) => ({
  src: portfolioVideoModules[p],
  thumb: portfolioVideoModules[p],
  alt: p.split("/").pop(),
  type: "video",
}));

export const galleryPhotos = [...portfolioPhotos, ...portfolioVideos];
