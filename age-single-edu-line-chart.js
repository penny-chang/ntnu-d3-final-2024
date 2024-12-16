const lineChartClassWidth = parseInt(
  computedStyle.getPropertyValue("--line-chart-width")
);
const lineChartClassHeight = parseInt(
  computedStyle.getPropertyValue("--line-chart-height")
);

let lineChartMargin = { top: 30, right: 30, bottom: 30, left: 60 },
  lineChartWidth =
    lineChartClassWidth - lineChartMargin.left - lineChartMargin.right,
  lineChartHeight =
    lineChartClassWidth - lineChartMargin.top - lineChartMargin.bottom;

let genderLineChartMargin = { top: 30, right: 30, bottom: 30, left: 60 },
  genderLineChartWidth =
    lineChartClassWidth -
    genderLineChartMargin.left -
    genderLineChartMargin.right,
  genderLineChartHeight =
    lineChartClassWidth -
    genderLineChartMargin.top -
    genderLineChartMargin.bottom;

var lineChartSvg = d3.select("#women-edu-single-line-chart");

var genderLineChartSvg = d3.select("#gender-age-single-chart");

var lineChartG = lineChartSvg // g
  .append("g")
  .attr(
    "transform",
    `translate(${lineChartMargin.left}, ${lineChartMargin.top})`
  );
var genderLineChartG = genderLineChartSvg // g2
  .append("g")
  .attr(
    "transform",
    `translate(${genderLineChartMargin.left}, ${genderLineChartMargin.top})`
  );

d3.csv("./data/marital-edu-age-population.csv")
  .then((rawData) => {
    rawData.forEach(function (d) {
      d.人口數 = Number(d.人口數);
    });
    var highSchoolSingleGirl = new Array(6).fill(0);
    var highSchoolSingleBoy = new Array(6).fill(0);
    var highSchoolSumGirl = new Array(6).fill(0);
    var highSchoolSumBoy = new Array(6).fill(0);
    var bachelorSingleGirl = new Array(6).fill(0);
    var bachelorSingleBoy = new Array(6).fill(0);
    var bachelorSumGirl = new Array(6).fill(0);
    var bachelorSumBoy = new Array(6).fill(0);
    var masterSingleGirl = new Array(6).fill(0);
    var masterSingleBoy = new Array(6).fill(0);
    var masterSumGirl = new Array(6).fill(0);
    var masterSumBoy = new Array(6).fill(0);
    var age = ["15~19", "20~29", "30~39", "40~49", "50~59", "60~69"];
    rawData.forEach(function (d) {
      for (var i = 0; i < 6; i++) {
        if (d.年齡 == age[i]) {
          if (d.教育程度 == "高中及以下") {
            if (d.性別 == "女") {
              if (d.婚姻狀況 == "未婚") {
                highSchoolSingleGirl[i] = highSchoolSingleGirl[i] + d.人口數;
              }
              highSchoolSumGirl[i] = highSchoolSumGirl[i] + d.人口數;
            }
            if (d.性別 == "男") {
              if (d.婚姻狀況 == "未婚") {
                highSchoolSingleBoy[i] = highSchoolSingleBoy[i] + d.人口數;
              }
              highSchoolSumBoy[i] = highSchoolSumBoy[i] + d.人口數;
            }
          } else if (d.教育程度 == "大學及專科") {
            if (d.性別 == "女") {
              if (d.婚姻狀況 == "未婚") {
                bachelorSingleGirl[i] = bachelorSingleGirl[i] + d.人口數;
              }
              bachelorSumGirl[i] = bachelorSumGirl[i] + d.人口數;
            }
            if (d.性別 == "男") {
              if (d.婚姻狀況 == "未婚") {
                bachelorSingleBoy[i] = bachelorSingleBoy[i] + d.人口數;
              }
              bachelorSumBoy[i] = bachelorSumBoy[i] + d.人口數;
            }
          } else if (d.教育程度 == "碩士以上") {
            if (d.性別 == "女") {
              if (d.婚姻狀況 == "未婚") {
                masterSingleGirl[i] = masterSingleGirl[i] + d.人口數;
              }
              masterSumGirl[i] = masterSumGirl[i] + d.人口數;
            }
            if (d.性別 == "男") {
              if (d.婚姻狀況 == "未婚") {
                masterSingleBoy[i] = masterSingleBoy[i] + d.人口數;
              }
              masterSumBoy[i] = masterSumBoy[i] + d.人口數;
            }
          } else {
            console.log("error");
          }
        }
      }
    });
    age = ["17", "25", "35", "45", "55", "65"];
    var highSchoolSingleRate = [];
    var bachelorSingleRate = [];
    var masterSingleRate = [];
    lineChart = [];
    for (var i = 0; i < 6; i++) {
      highSchoolSingleRate.push({
        age: age[i],
        singleRate:
          (highSchoolSingleGirl[i] + highSchoolSingleBoy[i]) /
          (highSchoolSumGirl[i] + highSchoolSumBoy[i]),
        girlSingleRate: highSchoolSingleGirl[i] / highSchoolSumGirl[i],
        boySingleRate: highSchoolSingleBoy[i] / highSchoolSumBoy[i],
      });
    }
    for (var i = 1; i < 6; i++) {
      bachelorSingleRate.push({
        age: age[i],
        singleRate:
          (bachelorSingleGirl[i] + bachelorSingleBoy[i]) /
          (bachelorSumGirl[i] + bachelorSumBoy[i]),
        girlSingleRate: bachelorSingleGirl[i] / bachelorSumGirl[i],
        boySingleRate: bachelorSingleBoy[i] / bachelorSumBoy[i],
      });
      masterSingleRate.push({
        age: age[i],
        singleRate:
          (masterSingleGirl[i] + masterSingleBoy[i]) /
          (masterSumGirl[i] + masterSumBoy[i]),
        girlSingleRate: masterSingleGirl[i] / masterSumGirl[i],
        boySingleRate: masterSingleBoy[i] / masterSumBoy[i],
      });
    }

    lineChartG
      .append("text")
      .attr("x", lineChartWidth / 2)
      .attr("y", lineChartHeight + 35)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Age");

    lineChartG
      .append("text")
      .attr("x", -(lineChartHeight / 2))
      .attr("y", -40)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Single Rate");

    lineChartXScale = d3
      .scaleLinear()
      .domain([0, 70])
      .range([0, lineChartWidth]); // xScale
    lineChartYScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([lineChartHeight, 0]); // yScale

    lineChartG
      .append("g")
      .attr("transform", "translate(0," + lineChartHeight + ")")
      .call(d3.axisBottom(lineChartXScale).ticks(6));

    lineChartG
      .append("g")
      .call(d3.axisLeft(lineChartYScale).tickFormat((d) => d * 100 + "%"));
    lineChartG
      .append("rect")
      .attr("x", (lineChartWidth / 3) * 2)
      .attr("y", lineChartHeight / 150)
      .attr("width", 30)
      .attr("height", 5)
      .attr("fill", "brown");
    lineChartG
      .append("text")
      .attr("x", (lineChartWidth / 3) * 2 + 35)
      .attr("y", lineChartHeight / 150 + 6)
      .attr("font-size", "12px")
      .text("Master's or Above");

    lineChartG
      .append("rect")
      .attr("x", (lineChartWidth / 3) * 2)
      .attr("y", lineChartHeight / 150 + 15)
      .attr("width", 30)
      .attr("height", 5)
      .attr("fill", "green");
    lineChartG
      .append("text")
      .attr("x", (lineChartWidth / 3) * 2 + 35)
      .attr("y", lineChartHeight / 150 + 6 + 15)
      .attr("font-size", "12px")
      .text("Colleges");

    lineChartG
      .append("rect")
      .attr("x", (lineChartWidth / 3) * 2)
      .attr("y", lineChartHeight / 150 + 30)
      .attr("width", 30)
      .attr("height", 5)
      .attr("fill", "steelblue");
    lineChartG
      .append("text")
      .attr("x", (lineChartWidth / 3) * 2 + 35)
      .attr("y", lineChartHeight / 150 + 6 + 30)
      .attr("font-size", "12px")
      .text("High School or Below");
    var lineGenerator = d3
      .line()
      .x((d) => lineChartXScale(d.age))
      .y((d) => lineChartYScale(d.singleRate));

    var highSchool = lineChartG
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator(highSchoolSingleRate));

    var bachelor = lineChartG
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator(bachelorSingleRate));

    var master = lineChartG
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "brown")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator(masterSingleRate));
    var lineGeneratorGirl = d3
      .line()
      .x((d) => lineChartXScale(d.age))
      .y((d) => lineChartYScale(d.girlSingleRate));
    var lineGeneratorBoy = d3
      .line()
      .x((d) => lineChartXScale(d.age))
      .y((d) => lineChartYScale(d.boySingleRate));

    highSchool.on("click", () => {
      genderLineChartG.selectAll("path").remove();
      setting();
      genderLineChartG
        .append("path")
        .transition()
        .duration(1500)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", lineGeneratorGirl(highSchoolSingleRate))
        .transition()
        .duration(1500);

      genderLineChartG
        .append("path")
        .transition()
        .duration(1500)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", lineGeneratorBoy(highSchoolSingleRate));
    });
    bachelor.on("click", () => {
      genderLineChartG.selectAll("path").remove();
      setting();
      genderLineChartG
        .append("path")
        .transition()
        .duration(1500)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", lineGeneratorGirl(bachelorSingleRate));
      genderLineChartG
        .append("path")
        .transition()
        .duration(1500)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", lineGeneratorBoy(bachelorSingleRate));
    });
    master.on("click", () => {
      genderLineChartG.selectAll("path").remove();
      setting();
      genderLineChartG
        .append("path")
        .transition()
        .duration(1500)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", lineGeneratorGirl(masterSingleRate));
      genderLineChartG
        .append("path")
        .transition()
        .duration(1500)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", lineGeneratorBoy(masterSingleRate));
    });
    genderLineChartG
      .append("text")
      .attr("x", genderLineChartWidth / 2)
      .attr("y", genderLineChartHeight + 35)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Age");
    genderLineChartG
      .append("text")
      .attr("x", -(genderLineChartHeight / 2))
      .attr("y", -40)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Single Rate");
    genderLineChartG
      .append("g")
      .attr("transform", "translate(0," + lineChartHeight + ")")
      .call(d3.axisBottom(lineChartXScale).ticks(6));
    genderLineChartG
      .append("g")
      .call(d3.axisLeft(lineChartYScale).tickFormat((d) => d * 100 + "%"));
    function setting() {
      genderLineChartG
        .append("g")
        .attr("transform", "translate(0," + genderLineChartHeight + ")")
        .call(d3.axisBottom(lineChartXScale).ticks(6));
      genderLineChartG
        .append("g")
        .call(d3.axisLeft(lineChartYScale).tickFormat((d) => d * 100 + "%"));

      genderLineChartG
        .append("rect")
        .attr("x", (genderLineChartWidth / 3) * 2)
        .attr("y", genderLineChartHeight / 150)
        .attr("width", 30)
        .attr("height", 5)
        .attr("fill", "red");
      genderLineChartG
        .append("text")
        .attr("x", (genderLineChartWidth / 3) * 2 + 35)
        .attr("y", genderLineChartHeight / 150 + 6)
        .attr("font-size", "12px")
        .text("Female");

      genderLineChartG
        .append("rect")
        .attr("x", (genderLineChartWidth / 3) * 2)
        .attr("y", genderLineChartHeight / 150 + 15)
        .attr("width", 30)
        .attr("height", 5)
        .attr("fill", "blue");
      genderLineChartG
        .append("text")
        .attr("x", (genderLineChartWidth / 3) * 2 + 35)
        .attr("y", genderLineChartHeight / 150 + 6 + 15)
        .attr("font-size", "12px")
        .text("Male");
    }
  })
  .catch(function (error) {
    console.log(error);
  });
