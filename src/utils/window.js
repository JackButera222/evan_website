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
  const { x, y, width, height } = config;
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
  const maxX = Math.max(margin, viewportSize.width - windowWidth - margin);
  const maxY = Math.max(
    margin,
    viewportSize.height - windowHeight - bottomReserve,
  );
  const minY = Math.max(topBarrier, margin);

  const mobileX = Math.round((viewportSize.width - windowWidth) / 2);
  const mobileY = Math.max(
    topBarrier,
    Math.round((viewportSize.height - windowHeight) / 2) - 30,
  );

  return {
    default: {
      x: isMobile ? mobileX : Math.min(Math.max(x, margin), maxX) + 150,
      y: isMobile
        ? mobileY
        : Math.min(Math.max(y, minY), maxY) - 50,
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
