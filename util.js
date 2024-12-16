function getCanvasFont(el = document.body) {
  const fontWeight = getCssStyle(el, "font-weight") || "normal";
  const fontSize = getCssStyle(el, "font-size") || "16px";
  const fontFamily = getCssStyle(el, "font-family") || "Times New Roman";

  return `${fontWeight} ${fontSize} ${fontFamily}`;
}

function getTextWidth(
  text,
  {
    fontWeight = getComputedStyle(document.documentElement).getPropertyValue(
      "font-weight"
    ),
    fontSize = getComputedStyle(document.documentElement).getPropertyValue(
      "font-size"
    ),
    fontFamily = getComputedStyle(document.documentElement).getPropertyValue(
      "font-family"
    ),
  }
) {
  // re-use canvas object for better performance
  const canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const metrics = context.measureText(text);
  return metrics.width;
}
