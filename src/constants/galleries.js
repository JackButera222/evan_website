// Build-time resized variants via vite-imagetools: small WebP thumbnails
// for the grids, capped WebP for the lightbox. Originals stay untouched.
const thumbModules = import.meta.glob(
  "/src/assets/portfolio/photos/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default", query: { w: 480, format: "webp", quality: 70 } },
);
const fullModules = import.meta.glob(
  "/src/assets/portfolio/photos/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default", query: { w: 1600, format: "webp", quality: 80 } },
);
const portfolioVideoModules = import.meta.glob(
  "/src/assets/portfolio/videos/*.{mp4,webm,ogg}",
  { eager: true, import: "default" },
);

const portfolioPhotos = Object.keys(fullModules).map((path) => ({
  src: fullModules[path],
  thumb: thumbModules[path],
  alt: path.split("/").pop(),
  position: "center",
}));

const portfolioVideos = Object.keys(portfolioVideoModules).map((path) => ({
  src: portfolioVideoModules[path],
  thumb: portfolioVideoModules[path],
  alt: path.split("/").pop(),
  type: "video",
}));

export const galleryPhotos = [...portfolioPhotos, ...portfolioVideos];
