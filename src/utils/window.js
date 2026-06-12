export function resolvePosition(value, total) {
  if (typeof value === "string" && value.endsWith("%")) {
    return Math.round((parseFloat(value) / 100) * total);
  }

  return value;
}

export function getDefaultPosition(item, viewportSize) {
  return {
    x: resolvePosition(item.x, viewportSize.width),
    y: resolvePosition(item.y, viewportSize.height),
  };
}

const MENU_BAR_HEIGHT = 28;

export function getWindowProps(config, viewportSize, isMobile) {
  const { x, y, width, height } = config;
  const margin = isMobile ? 12 : 24;
  const bottomReserve = isMobile ? 110 : 100;
  const availableWidth = Math.max(240, viewportSize.width - margin * 2);
  const availableHeight = Math.max(
    240,
    viewportSize.height - MENU_BAR_HEIGHT - margin - bottomReserve,
  );
  const windowWidth = Math.min(width, availableWidth);
  const windowHeight = Math.min(height, availableHeight);
  const maxX = Math.max(margin, viewportSize.width - windowWidth - margin);
  const maxY = Math.max(
    MENU_BAR_HEIGHT + 8,
    viewportSize.height - windowHeight - bottomReserve,
  );

  const mobileY = Math.max(
    MENU_BAR_HEIGHT + 10,
    (viewportSize.height - bottomReserve - windowHeight) / 2,
  );

  return {
    default: {
      x: isMobile
        ? Math.round((viewportSize.width - windowWidth) / 2)
        : Math.min(Math.max(x, margin), maxX),
      y: isMobile ? mobileY : Math.min(Math.max(y, MENU_BAR_HEIGHT + 8), maxY),
      width: windowWidth,
      height: windowHeight,
    },
    minWidth: Math.min(config.minWidth || 240, availableWidth),
    minHeight: Math.min(config.minHeight || 240, availableHeight),
    maxWidth: availableWidth,
    maxHeight: availableHeight,
    enableResizing: !isMobile,
    bounds: ".desktop-drag-bounds",
  };
}
