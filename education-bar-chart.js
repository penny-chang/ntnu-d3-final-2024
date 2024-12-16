const computedStyle = getComputedStyle(document.documentElement);
const chartClassWidth = parseInt(
  computedStyle.getPropertyValue("--chart-width")
);
const chartClassHeight = parseInt(
  computedStyle.getPropertyValue("--chart-height")
);

// Set up margins
const barChartMargin = { top: 50, right: 30, bottom: 40, left: 60 }; // Increased top margin

const barChartInnerWidth =
  chartClassWidth - barChartMargin.left - barChartMargin.right;
const barChartInnerHeight =
  chartClassHeight - barChartMargin.top - barChartMargin.bottom;
const educationDistributionCsvPromise = d3.csv(
  "./data/education-distribution.csv"
);
// Create SVG container
var barChartSvg = d3
  .select("#education-bar-chart")
  .attr("width", chartClassWidth)
  .attr("height", chartClassHeight);

// Create chart group element
const barChartG = barChartSvg
  .append("g")
  .attr("transform", `translate(${barChartMargin.left},${barChartMargin.top})`);

// Set up scales
const xScale = d3
  .scaleBand()
  .domain(["High School or Below", "Colleges", "Master's or Above"])
  .range([0, barChartInnerWidth])
  .padding(0.4);

const yScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([barChartInnerHeight, 0]);

// Create and add the grid lines
barChartG
  .selectAll("grid-lines")
  .data(yScale.ticks(5))
  .enter()
  .append("line")
  .attr("x1", 0)
  .attr("x2", barChartInnerWidth)
  .attr("y1", (d) => yScale(d))
  .attr("y2", (d) => yScale(d))
  .attr("stroke", "#E5E5E5")
  .attr("stroke-width", 1);

// Add Y axis
barChartG
  .append("g")
  .call(
    d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => d + "%")
  )
  .attr("font-size", "12px");

// Add X axis
barChartG
  .append("g")
  .attr("transform", `translate(0,${barChartInnerHeight})`)
  .call(d3.axisBottom(xScale))
  .attr("font-size", "12px");
// Calculate bar width
const barWidth = xScale.bandwidth() / 2;
function drawBars(data) {
  let femaleGraduateCount = 0;
  let maleGraduateCount = 0;
  let femaleCollegeCount = 0;
  let maleCollegeCount = 0;
  let femaleHighSchoolCount = 0;
  let maleHighSchoolCount = 0;

  data.forEach((item) => {
    if (item["性別"] === "女") {
      switch (item["教育程度"]) {
        case "碩士以上":
          femaleGraduateCount += Number(item["人口數"]);
          break;
        case "大學及專科":
          femaleCollegeCount += Number(item["人口數"]);
          break;
        case "高中及以下":
          femaleHighSchoolCount += Number(item["人口數"]);
          break;
      }
    } else {
      switch (item["教育程度"]) {
        case "碩士以上":
          maleGraduateCount += Number(item["人口數"]);
          break;
        case "大學及專科":
          maleCollegeCount += Number(item["人口數"]);
          break;
        case "高中及以下":
          maleHighSchoolCount += Number(item["人口數"]);
          break;
      }
    }
  });
  const totalFemale =
    femaleGraduateCount + femaleCollegeCount + femaleHighSchoolCount;
  const totalMale = maleGraduateCount + maleCollegeCount + maleHighSchoolCount;
  let countryData = Array.of(
    {
      gender: "女",
      eduLevel: "Master's or Above",
      ratio: (femaleGraduateCount / totalFemale) * 100,
    },
    {
      gender: "女",
      eduLevel: "Colleges",
      ratio: (femaleCollegeCount / totalFemale) * 100,
    },
    {
      gender: "女",
      eduLevel: "High School or Below",
      ratio: (femaleHighSchoolCount / totalFemale) * 100,
    },
    {
      gender: "男",
      eduLevel: "Master's or Above",
      ratio: (maleGraduateCount / totalMale) * 100,
    },
    {
      gender: "男",
      eduLevel: "Colleges",
      ratio: (maleCollegeCount / totalMale) * 100,
    },
    {
      gender: "男",
      eduLevel: "High School or Below",
      ratio: (maleHighSchoolCount / totalMale) * 100,
    }
  );
  // Draw bars [Male]
  const femaleData = countryData.slice(0, 3);
  const maleData = countryData.slice(3, 6);
  const maleColor = "#7293CB";
  const femaleColor = "#E6776F";

  barChartG
    .selectAll(`.bar-blue`)
    .data(maleData)
    .enter()
    .append("rect")
    .attr("class", `bar-blue`)
    .attr("x", (d) => xScale(d.eduLevel))
    .attr("y", yScale(0)) // Start animation position
    .attr("width", barWidth - 2)
    .attr("height", 0) // Start animation position
    .attr("fill", maleColor)
    .attr("fill-opacity", 0.8)
    .transition()
    .duration(1000)
    .attr("y", (d) => yScale(d.ratio)) // End animation position
    .attr("height", (d) => barChartInnerHeight - yScale(d.ratio)); // End animation position

  // Draw bars [Female]
  const offset = xScale.bandwidth() / 2;
  barChartG
    .selectAll(`.bar-red`)
    .data(femaleData)
    .enter()
    .append("rect")
    .attr("class", `bar-red`)
    .attr("x", (d) => xScale(d.eduLevel) + offset)
    .attr("y", yScale(0))
    .attr("width", barWidth - 2)
    .attr("height", 0)
    .attr("fill", femaleColor)
    .attr("fill-opacity", 0.8)
    .transition()
    .duration(1000)
    .attr("y", (d) => yScale(d.ratio))
    .attr("height", (d) => barChartInnerHeight - yScale(d.ratio));
}

async function drawCityLines(selectedCity) {
  if (!selectedCity) {
    barChartG
      .selectAll(`.circle-blue`)
      .transition()
      .duration(1000)
      .attr("cy", yScale(0))
      .remove();
    barChartG
      .selectAll(`.line-blue`)
      .transition()
      .duration(1000)
      .attr("y2", yScale(0))
      .remove();
    barChartG
      .selectAll(`.circle-red`)
      .transition()
      .duration(1000)
      .attr("cy", yScale(0))
      .remove();
    barChartG
      .selectAll(`.line-red`)
      .transition()
      .duration(1000)
      .attr("y2", yScale(0))
      .remove();
    return;
  }

  // Clear previous first
  barChartG.selectAll(`.circle-blue`).remove();
  barChartG.selectAll(`.line-blue`).remove();
  barChartG.selectAll(`.circle-red`).remove();
  barChartG.selectAll(`.line-red`).remove();

  const citiesData = await educationDistributionCsvPromise;

  const maleColor = "#0066CC";
  const femaleColor = "#CC0000";

  const cityFilterData = citiesData?.filter(
    (item) => item["縣市別"] === selectedCity
  );
  let femaleGraduateCount = 0;
  let maleGraduateCount = 0;
  let femaleCollegeCount = 0;
  let maleCollegeCount = 0;
  let femaleHighSchoolCount = 0;
  let maleHighSchoolCount = 0;

  cityFilterData.forEach((item) => {
    if (item["性別"] === "女") {
      switch (item["教育程度"]) {
        case "碩士以上":
          femaleGraduateCount += Number(item["人口數"]);
          break;
        case "大學及專科":
          femaleCollegeCount += Number(item["人口數"]);
          break;
        case "高中及以下":
          femaleHighSchoolCount += Number(item["人口數"]);
          break;
      }
    } else {
      switch (item["教育程度"]) {
        case "碩士以上":
          maleGraduateCount += Number(item["人口數"]);
          break;
        case "大學及專科":
          maleCollegeCount += Number(item["人口數"]);
          break;
        case "高中及以下":
          maleHighSchoolCount += Number(item["人口數"]);
          break;
      }
    }
  });
  const totalFemale =
    femaleGraduateCount + femaleCollegeCount + femaleHighSchoolCount;
  const totalMale = maleGraduateCount + maleCollegeCount + maleHighSchoolCount;
  let femaleData = Array.of(
    {
      gender: "女",
      eduLevel: "Master's or Above",
      ratio: (femaleGraduateCount / totalFemale) * 100,
    },
    {
      gender: "女",
      eduLevel: "Colleges",
      ratio: (femaleCollegeCount / totalFemale) * 100,
    },
    {
      gender: "女",
      eduLevel: "High School or Below",
      ratio: (femaleHighSchoolCount / totalFemale) * 100,
    }
  );

  let maleData = Array.of(
    {
      gender: "男",
      eduLevel: "Master's or Above",
      ratio: (maleGraduateCount / totalMale) * 100,
    },
    {
      gender: "男",
      eduLevel: "Colleges",
      ratio: (maleCollegeCount / totalMale) * 100,
    },
    {
      gender: "男",
      eduLevel: "High School or Below",
      ratio: (maleHighSchoolCount / totalMale) * 100,
    }
  );

  // Draw lollipop lines [Male]
  const xOffset = xScale.bandwidth() / 4;
  barChartG
    .selectAll(`.line-blue`)
    .data(maleData)
    .enter()
    .append("line")
    .attr("class", `line-blue`)
    .attr("x1", (d) => xScale(d.eduLevel) + xOffset)
    .attr("x2", (d) => xScale(d.eduLevel) + xOffset)
    .attr("y1", yScale(0))
    .attr("y2", yScale(0))
    .attr("stroke", maleColor)
    .attr("stroke-width", 2)
    .transition()
    .duration(1000)
    .attr("y2", (d) => yScale(d.ratio));

  // Draw circles
  barChartG
    .selectAll(`.circle-blue`)
    .data(maleData)
    .enter()
    .append("circle")
    .attr("class", `circle-blue`)
    .attr("cx", (d) => xScale(d.eduLevel) + xOffset)
    .attr("cy", yScale(0))
    .attr("r", 6)
    .attr("fill", maleColor)
    .transition()
    .duration(1000)
    .attr("cy", (d) => yScale(d.ratio));

  // Draw lollipop lines [Female]
  const femaleOffset = xOffset + xScale.bandwidth() / 2;
  barChartG
    .selectAll(`.line-red`)
    .data(femaleData)
    .enter()
    .append("line")
    .attr("class", `line-red`)
    .attr("x1", (d) => xScale(d.eduLevel) + femaleOffset)
    .attr("x2", (d) => xScale(d.eduLevel) + femaleOffset)
    .attr("y1", yScale(0))
    .attr("y2", yScale(0))
    .attr("stroke", femaleColor)
    .attr("stroke-width", 2)
    .transition()
    .duration(1000)
    .attr("y2", (d) => yScale(d.ratio));

  // Draw circles
  barChartG
    .selectAll(`.circle-red`)
    .data(femaleData)
    .enter()
    .append("circle")
    .attr("class", `circle-red`)
    .attr("cx", (d) => xScale(d.eduLevel) + femaleOffset)
    .attr("cy", yScale(0))
    .attr("r", 6)
    .attr("fill", femaleColor)
    .transition()
    .duration(1000)
    .attr("cy", (d) => yScale(d.ratio));
}

educationDistributionCsvPromise.then((data) => {
  drawBars(data);
});

// Add legend
const legend = barChartG
  .append("g")
  .attr("transform", `translate(${barChartInnerWidth - 200}, ${-40})`); // Adjusted position

// Add legend items in two rows with clear spacing
const legendData = [
  // First row - bars
  { label: "Male", color: "#7293CB", type: "bar", x: 0, y: 0 },
  { label: "Female", color: "#E6776F", type: "bar", x: 120, y: 0 },
  // Second row - lollipops
  { label: "City Male", color: "#0066CC", type: "lollipop", x: 0, y: 25 },
  { label: "City Female", color: "#CC0000", type: "lollipop", x: 120, y: 25 },
];

// Rest of the legend code remains the same
legendData.forEach((item) => {
  const g = legend
    .append("g")
    .attr("transform", `translate(${item.x}, ${item.y})`);

  if (item.type === "bar") {
    g.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", item.color)
      .attr("fill-opacity", 0.8);
  } else {
    g.append("line")
      .attr("x1", 7.5)
      .attr("x2", 7.5)
      .attr("y1", 15)
      .attr("y2", 0)
      .attr("stroke", item.color)
      .attr("stroke-width", 2);

    g.append("circle")
      .attr("cx", 7.5)
      .attr("cy", 0)
      .attr("r", 4)
      .attr("fill", item.color);
  }

  g.append("text")
    .attr("x", 25)
    .attr("y", 12)
    .style("font-size", "12px")
    .text(item.label);
});
