var mapSvg = d3.select("#taiwan-map");
const g = mapSvg.append("g");

mapSvg.call(
  d3.zoom().on("zoom", () => {
    g.attr("transform", d3.event.transform);
  })
);

var projectmethod = d3.geoMercator().center([123, 24]).scale(5500);
var pathGenerator = d3.geoPath().projection(projectmethod);

d3.select("body")
  .append("div")
  .attr("id", "tooltip")
  .attr("style", "position: absolute; opacity: 0;");

var projection = d3.geoMercator().center([123, 24]).scale(5500);

const mapJsonPromise = d3.json("./data/COUNTY_MOI_1090820.json");
const salaryCsvPromise = d3.csv("./data/salary.csv");

const geometriesPromise = mapJsonPromise.then((jsondata) => {
  const geometries = topojson.feature(
    jsondata,
    jsondata.objects["COUNTY_MOI_1090820"]
  );
  geometries.features.forEach((feature) => {
    feature.id = `county-${feature.properties.COUNTYCODE}`;
  });
  return geometries;
});

const featuresPromise = geometriesPromise.then((geometries) => {
  return geometries.features.filter((feature) => {
    return !HIDE_COUNTY.find((v) => v === feature.properties.COUNTYNAME);
  });
});

const countyIdMapPromise = featuresPromise.then((features) => {
  return features.reduce((result, feature) => ({
    ...result,
    [feature.properties.COUNTYCODE]: feature.id,
    [feature.properties.COUNTYNAME]: feature.id,
  }));
});

let selectedId = undefined;
const handleCountyClick = (feature = undefined) => {
  if (d3.event.target !== d3.event.currentTarget) {
    return;
  }
  if (selectedId) {
    d3.select(`#${selectedId}`).style("fill", COUNTY_COLOR);
    d3.select("#tooltip").style("opacity", 0);
  }
  selectedId = feature?.id;
  if (selectedId) {
    d3.select(`#${selectedId}`).style("fill", COUNTY_COLOR_SELECTED);
    d3.select("#tooltip")
      .style("opacity", 1)
      .html(
        `<div class="custom_tooltip">
          <span>County：${feature.properties.COUNTYNAME}</span>
          <br/>
          <span>Salary：${feature.salary}0K</span>
        </div>`
      );
    d3.select("#tooltip")
      .style("left", d3.event.pageX + 10 + "px")
      .style("top", d3.event.pageY + 10 + "px");
  }
  drawCityLines(feature?.properties?.COUNTYNAME);
  highlightSelectCity(feature?.properties?.COUNTYNAME);
};

const drawCounty = async () => {
  // 地圖的檔案先讀取
  const features = await featuresPromise;
  g.append("path");
  const paths = g.selectAll("path").data(features);
  paths
    .enter()
    .append("path")
    .attr("d", pathGenerator)
    .attr("class", "county")
    .attr("id", (feature) => feature.id)
    .style("fill", COUNTY_COLOR_ZERO);
};

const drawCountyPromise = drawCounty();

const drawSalaryGradientBar = ({
  id = "salaryGradientBar",
  size: [width, height] = [75, 25],
  value: [minValue, maxValue] = [0, 100],
  fontSize = 16,
}) => {
  const colors = [COUNTY_COLOR_ZERO, COUNTY_COLOR];
  const minValueText = `${minValue.toFixed(0)}0K`;
  const maxValueText = `${maxValue.toFixed(0)}0K`;
  const minValueTextWidth = getTextWidth(minValueText, { fontSize: fontSize });
  const maxValueTextWidth = getTextWidth(maxValueText, { fontSize: fontSize });
  const grad = mapSvg
    .append("defs")
    .append("linearGradient")
    .attr("id", id)
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "0%");

  grad
    .selectAll("stop")
    .data(colors)
    .enter()
    .append("stop")
    .style("stop-color", function (d) {
      return d;
    })
    .attr("offset", function (d, i) {
      return 100 * (i / (colors.length - 1)) + "%";
    });

  mapSvg
    .append("rect")
    .attr(
      "x",
      mapSvg.node().getBoundingClientRect().width -
        width -
        maxValueTextWidth / 2
    )
    .attr("y", mapSvg.node().getBoundingClientRect().height - height - fontSize)
    .attr("width", width)
    .attr("height", height)
    .style("fill", `url(#${id})`);
  mapSvg
    .append("text")
    .attr(
      "x",
      mapSvg.node().getBoundingClientRect().width -
        width -
        minValueTextWidth / 2 -
        maxValueTextWidth / 2
    )
    .attr("y", mapSvg.node().getBoundingClientRect().height)
    .style("fill", "black")
    .text(minValueText);
  mapSvg
    .append("text")
    .attr("x", mapSvg.node().getBoundingClientRect().width - maxValueTextWidth)
    .attr("y", mapSvg.node().getBoundingClientRect().height)
    .style("fill", "black")
    .text(maxValueText);
};

/**
 * [
 *   {
 *     id: value
 *   }
 * ]
 * @param {[{string, Number}]} values
 */
const fillCountyByCountyNameValue = async (values = {}) => {
  await drawCountyPromise;
  const minValue = Math.min(...Object.values(values));
  const maxValue = Math.max(...Object.values(values));
  Object.entries(values).forEach(([id, value]) => {
    const opacity = (value - minValue) / (maxValue - minValue);
    d3.select(`#${id}`)
      .style("fill", COUNTY_COLOR)
      .style("fill-opacity", opacity)
      .on("click", (feature) =>
        handleCountyClick({ ...feature, salary: value })
      );
  });
  mapSvg.on("click", () => handleCountyClick(undefined));
  drawSalaryGradientBar({ size: [75, 25], value: [minValue, maxValue] });
};

const fillCountyBySalary = async () => {
  const salaryList = await salaryCsvPromise;
  const countyIdMap = await countyIdMapPromise;
  fillCountyByCountyNameValue(
    salaryList.reduce(
      (result, salary) => ({
        ...result,
        [countyIdMap[salary["區域別"]]]: Number(salary["中位數(萬元)_女"]),
      }),
      {}
    )
  );
};

fillCountyBySalary();
