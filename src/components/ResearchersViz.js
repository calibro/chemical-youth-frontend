import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceLink,
  forceY,
  forceX
} from "d3-force";
import { scaleSqrt } from "d3-scale";
import { extent } from "d3-array";
import { groupBy } from "lodash";
import ReactTooltip from "react-tooltip";

const radiusScale = scaleSqrt().range([5, 35]);

class ResearchersViz extends Component {
  state = {
    nodes: [],
    links: [],
    activeIndex: null
  };

  simulation = null;

  componentDidMount() {
    if (this.props.width && this.props.height) {
      this.setUpForceLayout(
        this.props.researchersNodes,
        this.props.researchersLinks,
        this.props.width,
        this.props.height
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.width &&
      nextProps.height &&
      (nextProps.width !== this.props.width ||
        nextProps.height !== this.props.height ||
        nextProps.researchersNodes.length !==
          this.props.researchersNodes.length)
    ) {
      this.setUpForceLayout(
        nextProps.researchersNodes,
        nextProps.researchersLinks,
        nextProps.width,
        nextProps.height
      );
    }
  }

  componentWillUnmount() {
    this.setState({ nodes: [], links: [] });

    if (this.simulation) {
      this.simulation.stop();
    }
  }

  setUpForceLayout = (researchersNodes, researchersLinks, width, height) => {
    const [min, max] = extent(researchersNodes, d => d.value);
    radiusScale.domain([min, max]);

    const simulationNodes = researchersNodes
      .filter(r => r.value > 0)
      .map(r => {
        r.radius = radiusScale(r.value);
        return r;
      });

    simulationNodes.forEach(v => {
      if (v.name === "Anita Hardon") {
        v.fx = width / 2;
        v.fy = height / 2;
      }
    });

    const researchersLinksGrouped = Object.values(groupBy(researchersLinks));
    const formattedLinks = [];

    researchersLinksGrouped.forEach((value, i) => {
      const source = researchersNodes.findIndex(v => v.name === value[0][0]);
      const target = researchersNodes.findIndex(v => v.name === value[0][1]);
      const weight = value.length;

      formattedLinks.push({ source: source, target: target, weight: weight });
    });

    this.setState({ links: formattedLinks });

    this.simulation = forceSimulation(simulationNodes)
      .force(
        "charge",
        forceManyBody()
          .strength(-100)
          .distanceMax(width / 2)
          .distanceMin(10)
      )
      .force("link", forceLink(formattedLinks).strength(d => d.weight * 0.1))
      .force("center", forceCenter(width / 2, height / 2))
      .force("x", forceX().strength(0.05))
      .force("y", forceY().strength(0.05))
      .force(
        "collision",
        forceCollide()
          .radius(n => n.radius + 10)
          .iterations(3)
      )
      .on("tick", a => {
        simulationNodes.forEach(function(d) {
          d.x =
            d.x < radiusScale(d.value)
              ? radiusScale(d.value) + 5
              : d.x > width - radiusScale(d.value)
              ? width - radiusScale(d.value) - 5
              : d.x;
          d.y =
            d.y < radiusScale(d.value)
              ? radiusScale(d.value) + 5
              : d.y > height - radiusScale(d.value)
              ? height - radiusScale(d.value) - 5
              : d.y;
        });
        this.setState({ nodes: simulationNodes });
      });

    this.simulation.restart();
  };

  render() {
    const { nodes, links, activeIndex } = this.state;
    const { width, height, selectResearcher, selected } = this.props;

    return (
      <svg width={width} height={height}>
        {links.map((link, index) => {
          return (
            <g key={index}>
              <line
                x1={link.source.x}
                y1={link.source.y}
                x2={link.target.x}
                y2={link.target.y}
                style={{ strokeWidth: link.weight }}
                stroke="black"
                opacity="0.1"
              />
            </g>
          );
        })}
        {nodes
          .filter(node => node.value > 0)
          .map((node, index) => {
            return (
              <g key={index}>
                <circle
                  data-tip={
                    radiusScale(node.value) <= 10 ? node.name.toUpperCase() : ""
                  }
                  ref={node.name}
                  cx={node.x}
                  cy={node.y}
                  className={`circle ${
                    selected.indexOf(node.name) > -1 || activeIndex === index
                      ? "active"
                      : ""
                  }`}
                  stroke="black"
                  strokeWidth={1}
                  r={radiusScale(node.value)}
                  onClick={() => selectResearcher("researcher", node.name)}
                  onMouseEnter={() => {
                    this.setState({ activeIndex: index });
                    ReactTooltip.show(findDOMNode(this.refs[node.name]));
                  }}
                  onMouseLeave={() => {
                    this.setState({ activeIndex: null });
                    ReactTooltip.hide(findDOMNode(this.refs[node.name]));
                  }}
                />

                {radiusScale(node.value) > 10 && (
                  <g>
                    <rect
                      x={node.x - (node.name.length * 5.2) / 2}
                      y={node.y - 4}
                      width={node.name.length * 5.2}
                      height={10}
                      className={`rect ${
                        selected.indexOf(node.name) > -1 ||
                        activeIndex === index
                          ? "active"
                          : ""
                      }`}
                    />
                    <text
                      dx={node.x}
                      dy={node.y}
                      className={`text ${
                        selected.indexOf(node.name) > -1 ||
                        activeIndex === index
                          ? "active"
                          : ""
                      }`}
                      textAnchor="middle"
                    >
                      {node.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
      </svg>
    );
  }
}

export default ResearchersViz;
