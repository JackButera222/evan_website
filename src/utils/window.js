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
    width: item.width,
    height: item.height,
  };
}

export function getWindowProps(config, viewportSize, isMobile) {
  const { width, height } = config;
  const margin = isMobile ? 20 : 24;
  const bottomReserve = isMobile ? 132 : 96;
  const topBarrier = isMobile ? 34 : 32;
  const availableWidth = Math.max(240, viewportSize.width - margin * 2);
  const availableHeight = Math.max(
    240,
    viewportSize.height - margin - bottomReserve,
  );
  const windowWidth = Math.min(isMobile ? 360 : width, availableWidth);
  const windowHeight = Math.min(isMobile ? (config.mobileHeight ?? 380) : height, availableHeight);
  // All windows open centered in the viewport (clamped below the menu bar)
  const centeredX = Math.round((viewportSize.width - windowWidth) / 2);
  const centeredY = Math.max(
    topBarrier,
    Math.round((viewportSize.height - windowHeight) / 2) - (isMobile ? 30 : 40),
  );

  return {
    default: {
      x: centeredX,
      y: centeredY,
      width: windowWidth,
      height: windowHeight,
    },
    minWidth: Math.min(isMobile ? 0 : config.minWidth || 240, availableWidth),
    minHeight: Math.min(isMobile ? 0 : config.minHeight || 240, availableHeight),
    maxWidth: availableWidth,
    maxHeight: availableHeight,
    disableDragging: false,
    enableResizing: !isMobile,
    bounds: ".desktop-drag-bounds",
  };
}
