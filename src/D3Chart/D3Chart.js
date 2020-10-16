import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import axios from "axios";


const D3Chart = () => {
  const [data, setData] = useState({
    title: [],
    budget: [],
  });
  const donutRef = useRef(null);

  const width = 640;
  const height = 530;
  const margin = 40;
  const black = "#333333";
  const radius = Math.min(width, height) / 2 - margin;

  const getData = () => {
    axios.get("http://localhost:3000/budget").then((res) => {
      createChart(res.data.myBudget);
      setData({
        title: res.data.myBudget.map((res) => {
          return res.title;
        }),
        budget: res.data.myBudget.map((res) => {
          return res.budget;
        }),
      });
    });
  };

  const { title } = data;
  const getMidAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;

  const createChart = (data) => {
    let colors = d3
      .scaleOrdinal()
      .domain(title)
      .range([
        "#cc33ff",
        "#0066ff",
        "#ff1a8c",
        "#ff6600",
        "#00e600",
        "#e6ccff",
        "#993399",
      ]);
    let pie = d3.pie().value((d) => d.budget)(data);

    var arc = d3
      .arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    var outerArc = d3
      .arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.9);

    var svg = d3
      .select(donutRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    svg
      .selectAll("slices")
      .data(pie)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => colors(d.data.title))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    svg
      .selectAll("polylines")
      .data(pie)
      .enter()
      .append("polyline")
      .attr("stroke", black)
      .attr("stroke-width", 1)
      .style("fill", "none")
      .attr("points", (d) => {
        var posArc = arc.centroid(d);
        var posOarc = outerArc.centroid(d);
        var posComplete = outerArc.centroid(d);
        var midAngle = getMidAngle(d);
        posComplete[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        return [posArc, posOarc, posComplete];
      });
    svg
      .selectAll("labels")
      .data(pie)
      .enter()
      .append("text")
      .text((d) => d.data.title)
      .attr("transform", (d) => {
        var posarc = outerArc.centroid(d);
        var midAngle = getMidAngle(d);
        posarc[0] = radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${posarc})`;
      })
      .style("text-anchor", (d) => {
        var midAngle = getMidAngle(d);
        return midAngle < Math.PI ? "start" : "end";
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return <figure ref={donutRef}></figure>;
};

export default D3Chart;