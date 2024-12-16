// Set up margins
const scatterplotMargin = { top: 50, right: 30, bottom: 40, left: 60 }; // Increased top margin

const scatterplotWidth =
  chartClassWidth - scatterplotMargin.left - scatterplotMargin.right;
const scatterplotHeight =
  chartClassHeight - scatterplotMargin.top - scatterplotMargin.bottom;

const singleEduCsvPromise = d3.csv(
  "./data/city-single-education-population.csv"
);

var scatterSvg = d3
  .select("#singles-scatter")
  .attr("width", chartClassWidth)
  .attr("height", chartClassHeight);

const scatterG = scatterSvg
  .append("g")
  .attr(
    "transform",
    `translate(${scatterplotMargin.left},${scatterplotMargin.top})`
  );

const scatterplotStyle = {
  maleDotColor: "#4e79a7",
  femaleDotColor: "#e15759",
  dotOpacity: 0.9,
};

async function drawScatterPlot(rawData) {
  // Arrange data
  const citiesName = [
    "臺北市",
    "新北市",
    "基隆市",
    "桃園市",
    "新竹縣",
    "新竹市",
    "苗栗縣",
    "臺中市",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義市",
    "嘉義縣",
    "臺南市",
    "高雄市",
    "屏東縣",
    "臺東縣",
    "花蓮縣",
    "宜蘭縣",
    "澎湖縣",
  ];
  let graduateSingleRateList = [];
  citiesName.map((cityName) => {
    let cityData = rawData.filter((data) => data["縣市別"] === cityName);
    cityData.forEach((element) => {
      if (element["教育程度"] === "碩士以上") {
        graduateSingleRateList.push({
          name: cityName,
          gender: element["性別"],
          graduateRatio: Number(element["教育程度比例"]) * 100,
          graduatePopulation: element["教育程度人口數"],
          singleRatio: Number(element["未婚率"]) * 100,
          singlePopulation: element["未婚人口數"],
        });
      }
    });
  });

  // Calculate data ranges
  const xMin = d3.min(graduateSingleRateList, (d) => d.graduateRatio);
  const xMax = d3.max(graduateSingleRateList, (d) => d.graduateRatio);
  const yMin = d3.min(graduateSingleRateList, (d) => d.singleRatio);
  const yMax = d3.max(graduateSingleRateList, (d) => d.singleRatio);

  const yStep = (yMax - yMin) / 4; // 4 intervals for 5 ticks
  const tickValues = d3.range(5).map((i) => yMin + yStep * i);

  // Add some padding to the ranges
  const xPadding = (xMax - xMin) * 0.1;
  const yPadding = (yMax - yMin) * 0.1;

  // Create scales with dynamic domains
  const xScatterScale = d3
    .scaleLinear()
    .domain([xMin - xPadding, xMax + xPadding])
    .range([0, scatterplotWidth]);

  const yScatterScale = d3
    .scaleLinear()
    .domain([yMin - yPadding, yMax + yPadding])
    .range([scatterplotHeight, 0]);

  // Add X axis
  scatterG
    .append("g")
    .attr("transform", `translate(0,${scatterplotHeight})`)
    .call(
      d3
        .axisBottom(xScatterScale)
        .ticks(5)
        .tickFormat((d) => d + "%")
    )
    .call((g) => g.select(".domain").attr("stroke", "#ddd"));

  // Add Y axis
  scatterG
    .append("g")
    .call(
      d3
        .axisLeft(yScatterScale)
        .tickValues(tickValues)
        .tickFormat((d) => d.toFixed(0) + "%")
    )
    .call((g) => g.select(".domain").attr("stroke", "#ddd"));

  // Add grid lines
  scatterG
    .selectAll("grid-lines")
    .data(tickValues)
    .enter()
    .append("line")
    .attr("x1", 0)
    .attr("x2", scatterplotWidth)
    .attr("y1", (d) => yScatterScale(d))
    .attr("y2", (d) => yScatterScale(d))
    .attr("stroke", "#ddd")
    .attr("stroke-dasharray", "2,2");

  // Add dots
  // Create separate groups for circles
  var dotG = scatterSvg.append("g").attr("class", "circle-group");

  // Add tooltip
  // TODO change tooltip color based on gender
  const scatterTooltip = d3
    .tip()
    .attr("class", "custom_tooltip")
    .html(
      (d) =>
        `${d.name}(${
          d.gender === "男" ? "Male" : "Female"
        })<br/>Graduate Ratio: ${d.graduateRatio?.toFixed(
          2
        )}%<br/>Single Ratio: ${d.singleRatio?.toFixed(2)}%`
    );

  // Call tip on the circleG group instead of scatterSvg
  dotG.call(scatterTooltip);

  // Add scatter plot points
  const dots = scatterG
    .selectAll("circle")
    .data(graduateSingleRateList)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScatterScale(Number(d.graduateRatio)))
    .attr("cy", (d) => yScatterScale(Number(d.singleRatio)))
    .attr("r", 4)
    .attr("fill", (d) =>
      d.gender === "男"
        ? scatterplotStyle.maleDotColor
        : scatterplotStyle.femaleDotColor
    )
    .attr("class", "dot-unselected")
    .style("opacity", scatterplotStyle.dotOpacity);
  // Set tooltip mouse action
  dots.on("mouseover", scatterTooltip.show).on("mouseout", scatterTooltip.hide);

  // Add X axis label
  scatterG
    .append("text")
    .attr("x", scatterplotWidth / 2)
    .attr("y", scatterplotHeight + 35)
    .attr("text-anchor", "middle")
    .text("Master's or above Degree Ratio");

  // Add Y axis label
  scatterG
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -scatterplotMargin.left + 20)
    .attr("x", -(scatterplotHeight / 2))
    .attr("text-anchor", "middle")
    .text("Single Rate");

  // Add legend
  const legend = scatterG
    .append("g")
    .attr("transform", `translate(${scatterplotWidth - 120}, ${-30})`);

  // Male legend
  legend
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 4)
    .style("fill", scatterplotStyle.maleDotColor);

  legend
    .append("text")
    .attr("x", 10)
    .attr("y", 0)
    .attr("alignment-baseline", "middle")
    .text("Male");

  // Female legend
  legend
    .append("circle")
    .attr("cx", 70)
    .attr("cy", 0)
    .attr("r", 4)
    .style("fill", scatterplotStyle.femaleDotColor);

  legend
    .append("text")
    .attr("x", 80)
    .attr("y", 0)
    .attr("alignment-baseline", "middle")
    .text("Female");
}

async function highlightSelectCity(selectedCity) {
  scatterG
    .selectAll(`circle`)
    .classed("dot-selected-male", (d) => {
      return d?.name === selectedCity && d?.gender === "男";
    })
    .classed("dot-selected-female", (d) => {
      return d?.name === selectedCity && d?.gender === "女";
    })
    .transition()
    .duration(500)
    .attr("r", (d) => (d && d.name === selectedCity ? 8 : 4));
}

singleEduCsvPromise.then((data) => drawScatterPlot(data));
