// Shared glyph size so the dock icons and the desktop icons match.
export const ICON_SIZE = { desktop: 78, mobile: 60 };

// QuickTime player size (10% smaller than the previous 400 / 240).
const QUICKTIME_SIZE = { desktop: 360, mobile: 216 };

// Deterministic placement for the draggable desktop items, recomputed from the
// viewport. The QuickTime player and the IAC Pack icon are laid out as a
// horizontally-centered pair (the icon beside the player, or stacked beneath it
// when the window is too narrow), so they default near the middle of the screen
// and never overlap or drift off-screen across resizes or mobile/desktop switches.
export function getDesktopLayout(viewportSize, isMobile) {
  const { width: vw, height: vh } = viewportSize;
  const margin = isMobile ? 16 : 28;
  const top = isMobile ? 52 : 56;
  const iconSize = isMobile ? ICON_SIZE.mobile : ICON_SIZE.desktop;
  const iconBoxWidth = iconSize + 28; // padding around the glyph for the label
  const iconBoxHeight = iconSize + 24; // room for the label beneath the glyph
  const gap = isMobile ? 18 : 48;

  const target = isMobile ? QUICKTIME_SIZE.mobile : QUICKTIME_SIZE.desktop;
  const quicktimeSize = Math.max(160, Math.min(target, vw - margin * 2));

  const quicktimeY = Math.max(top, Math.round(vh * 0.13));
  const center = vw / 2;

  // QuickTime sits just left of centre, the IAC Pack icon just right of centre,
  // with the gap straddling the centre line. Clamped to stay apart and on-screen.
  let quicktimeX = Math.max(margin, Math.round(center - gap / 2 - quicktimeSize));
  let checkoutX = Math.round(center + gap / 2);
  checkoutX = Math.max(checkoutX, quicktimeX + quicktimeSize + gap);
  checkoutX = Math.min(checkoutX, vw - margin - iconBoxWidth);

  const fitsSideBySide = checkoutX >= quicktimeX + quicktimeSize + gap;

  let checkout;
  if (fitsSideBySide) {
    checkout = {
      x: checkoutX,
      y: quicktimeY + Math.round((quicktimeSize - iconBoxHeight) / 2),
    };
  } else {
    // Too narrow for side-by-side: centre the player and stack the icon beneath.
    quicktimeX = Math.max(margin, Math.round((vw - quicktimeSize) / 2));
    checkout = {
      x: Math.round(quicktimeX + (quicktimeSize - iconBoxWidth) / 2),
      y: quicktimeY + quicktimeSize + gap,
    };
  }

  return {
    quicktime: {
      x: quicktimeX,
      y: quicktimeY,
      width: quicktimeSize,
      height: quicktimeSize,
    },
    checkout: {
      x: checkout.x,
      y: checkout.y,
      width: iconBoxWidth,
      height: iconBoxHeight,
      iconSize,
    },
  };
}

export const WINDOW_CONFIGS = {
  photos: {
    x: 190,
    y: 90,
    width: 800,
    height: 600,
    minWidth: 380,
    minHeight: 300,
  },
  contacts: {
    x: 250,
    y: 120,
    width: 560,
    height: 520,
    minWidth: 360,
    minHeight: 420,
  },
  notes: {
    x: 300,
    y: 80,
    width: 560,
    height: 540,
    minWidth: 360,
    minHeight: 360,
  },
  trash: {
    x: 360,
    y: 110,
    width: 430,
    height: 500,
    minWidth: 320,
    minHeight: 340,
  },
  finder: {
    x: 160,
    y: 120,
    width: 620,
    height: 390,
    minWidth: 380,
    minHeight: 300,
  },
};
