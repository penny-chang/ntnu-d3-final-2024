// Global variables for SVG containers and dimensions
let charts = {
  mapSvg: null,
  educationSvg: null,
  scatterSvg: null,
  womenEducationSvg: null,
  genderAgeSvg: null,
  dimensions: {},
};

// Initialize tooltip
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Calculate dimensions and initialize SVG containers
function initializeCharts() {
  // Map dimensions
  const mapWidth = document.querySelector(".map-container").clientWidth - 30;
  const mapHeight = document.querySelector(".map-container").clientHeight - 50;

  // Education chart dimensions
  const educationWidth =
    document.querySelector(".education-distribution").clientWidth - 30;
  const educationHeight = 200;

  // Singles scatter dimensions
  const scatterWidth =
    document.querySelector(".education-distribution").clientWidth - 30;
  const scatterHeight = 200;

  // Women education chart dimensions
  const womenEducationWidth =
    document.querySelector(".women-education-age").clientWidth - 30;
  const womenEducationHeight =
    document.querySelector(".women-education-age").clientHeight - 50;

  // Gender age chart dimensions
  const genderAgeWidth =
    document.querySelector(".singles-distribution").clientWidth - 30;
  const genderAgeHeight =
    document.querySelector(".singles-distribution").clientHeight - 50;

  // Initialize SVG containers
  charts.mapSvg = d3
    .select("#taiwan-map")
    .append("svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight);

  charts.educationSvg = d3
    .select("#education-chart")
    .append("svg")
    .attr("width", educationWidth)
    .attr("height", educationHeight);

  charts.scatterSvg = d3
    .select("#singles-scatter")
    .append("svg")
    .attr("width", scatterWidth)
    .attr("height", scatterHeight);

  charts.womenEducationSvg = d3
    .select("#women-education-chart")
    .append("svg")
    .attr("width", womenEducationWidth)
    .attr("height", womenEducationHeight);

  charts.genderAgeSvg = d3
    .select("#gender-age-chart")
    .append("svg")
    .attr("width", genderAgeWidth)
    .attr("height", genderAgeHeight);

  // Store dimensions
  charts.dimensions = {
    map: { width: mapWidth, height: mapHeight },
    education: { width: educationWidth, height: educationHeight },
    scatter: { width: scatterWidth, height: scatterHeight },
    womenEducation: {
      width: womenEducationWidth,
      height: womenEducationHeight,
    },
    genderAge: { width: genderAgeWidth, height: genderAgeHeight },
  };

  // Initialize individual charts
  initializeMap();
  initializeEducationChart();
  initializeScatterPlot();
  initializeWomenEducationChart();
  initializeGenderAgeChart();
}

// Initialize Taiwan Map
function initializeMap() {
  // TODO: Add map visualization code
  const svg = charts.mapSvg;
  // Add map rendering logic here
}

// Initialize Education Distribution Chart
function initializeEducationChart() {
  // TODO: Add education chart visualization code
  const svg = charts.educationSvg;
  // Add education chart rendering logic here
}

// Initialize Singles Rate Scatter Plot
function initializeScatterPlot() {
  // TODO: Add scatter plot visualization code
  const svg = charts.scatterSvg;
  // Add scatter plot rendering logic here
}

// Initialize Women's Education Age Chart
function initializeWomenEducationChart() {
  // TODO: Add women's education visualization code
  const svg = charts.womenEducationSvg;
  // Add women's education chart rendering logic here
}

// Initialize Gender Age Distribution Chart
function initializeGenderAgeChart() {
  // TODO: Add gender age chart visualization code
  const svg = charts.genderAgeSvg;
  // Add gender age chart rendering logic here
}

// Handle window resize
function handleResize() {
  // Clear existing SVGs
  d3.selectAll("svg").remove();
  // Reinitialize charts with new dimensions
  initializeCharts();
}

// Add event listeners
window.addEventListener("load", initializeCharts);
window.addEventListener("resize", debounce(handleResize, 250));

// Utility function to debounce resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
