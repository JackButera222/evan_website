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

  // Center the QuickTime + gap + icon pair horizontally as a unit.
  const pairWidth = quicktimeSize + gap + iconBoxWidth;
  const pairLeft = Math.max(margin, Math.round((vw - pairWidth) / 2) - 80);
  let quicktimeX = pairLeft;
  let checkoutX = pairLeft + quicktimeSize + gap;

  const fitsSideBySide = checkoutX + iconBoxWidth <= vw - margin;

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

  // Snake icon sits to the right side of the screen
  const snakeX = Math.min(vw - margin - iconBoxWidth, Math.round(vw * 0.5));
  const snakeY = Math.max(top, Math.round(vh * 0.7));

  // Mail ("hit me up") icon on the right side, above the snake icon
  const mailX = Math.min(vw - margin - iconBoxWidth, Math.round(vw * 0.65));
  const mailY = Math.max(top, Math.round(vh * 0.4));

  const layout = {
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
    mail: {
      x: mailX,
      y: mailY,
      width: iconBoxWidth,
      height: iconBoxHeight,
      iconSize,
    },
    snake: {
      x: snakeX,
      y: snakeY,
      width: iconBoxWidth,
      height: iconBoxHeight,
      iconSize,
    },
  };

  // Guarantee no default placements overlap: walk the items in order and push
  // any colliding item below the earlier one (wrapping horizontally if it
  // would run off the bottom of the screen).
  const pad = 8;
  const intersects = (a, b) =>
    a.x < b.x + b.width + pad &&
    a.x + a.width + pad > b.x &&
    a.y < b.y + b.height + pad &&
    a.y + a.height + pad > b.y;

  const order = ["quicktime", "checkout", "mail", "snake"];
  for (let i = 1; i < order.length; i++) {
    const item = layout[order[i]];
    for (let guard = 0; guard < 20; guard++) {
      const hit = order.slice(0, i).find((k) => intersects(item, layout[k]));
      if (!hit) break;
      item.y = layout[hit].y + layout[hit].height + gap;
      if (item.y + item.height > vh - margin) {
        // No room below: shift sideways instead and retry from the top.
        item.y = top;
        item.x = Math.max(
          margin,
          Math.min(vw - margin - item.width, item.x + item.width + gap),
        );
      }
    }
  }

  return layout;
}

export const WINDOW_CONFIGS = {
  photos: {
    x: 190,
    y: 90,
    width: 800,
    height: 600,
    minWidth: 380,
    minHeight: 300,
    mobileHeight: 520,
  },
  contacts: {
    x: 250,
    y: 120,
    width: 560,
    height: 520,
    minWidth: 360,
    minHeight: 420,
    mobileHeight: 520,

  },
  notes: {
    x: 300,
    y: 130,
    width: 560,
    height: 640,
    minWidth: 360,
    minHeight: 360,
    mobileHeight: 520,
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
  camera: {
    x: 280,
    y: 80,
    width: 420,
    height: 500,
    minWidth: 300,
    minHeight: 380,
    mobileHeight: 520,
  },
  snake: {
    x: 320,
    y: 80,
    width: 380,
    height: 560,
    minWidth: 340,
    minHeight: 500,
    mobileHeight: 580,
  },
};
