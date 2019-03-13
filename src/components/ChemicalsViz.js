import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide
} from "d3-force";
import { scaleSqrt } from "d3-scale";
import { max as d3Max } from "d3-array";
import ReactTooltip from "react-tooltip";

const radiusScale = scaleSqrt().range([5, 35]);

class ChemicalsViz extends Component {
  state = {
    nodes: [],
    activeState: null
  };

  simulation = null;

  componentDidMount() {
    if (this.props.width && this.props.height) {
      this.setUpForceLayout(
        this.props.chemicals,
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
        nextProps.chemicals.length !== this.props.chemicals.length)
    ) {
      this.setUpForceLayout(
        nextProps.chemicals,
        nextProps.width,
        nextProps.height
      );
    }
  }

  componentWillUnmount() {
    this.setState({ nodes: [] });
    this.simulation.stop();
  }

  setUpForceLayout = (res, width, height) => {
    //const [min, max] = extent(res, d => d.relatedProjects);
    const max = d3Max(res, d => d.relatedProjects);
    radiusScale.domain([1, max]);

    const simulationNodes = res
      .filter(r => r.relatedProjects > 0)
      .sort((a, b) => {
        return b.relatedProjects - a.relatedProjects;
      })
      .map(r => {
        r.radius = radiusScale(r.relatedProjects);
        return r;
      });

    this.simulation = forceSimulation(simulationNodes)
      .force("charge", forceManyBody().strength(5))
      .force("center", forceCenter(width / 2, height / 2))
      .force(
        "collision",
        forceCollide()
          .radius(n => n.radius + 10)
          .strength(1)
          .iterations(2)
      )
      .on("tick", a => {
        simulationNodes.forEach(function(d) {
          d.x =
            d.x < radiusScale(d.relatedProjects)
              ? radiusScale(d.relatedProjects)
              : d.x > width - radiusScale(d.relatedProjects)
              ? width - radiusScale(d.relatedProjects)
              : d.x;

          d.y =
            d.y < radiusScale(d.relatedProjects)
              ? radiusScale(d.relatedProjects)
              : d.y > height - radiusScale(d.relatedProjects)
              ? height - radiusScale(d.relatedProjects)
              : d.y;
        });
        this.setState({ nodes: simulationNodes });
      })
      .on("end", a => {
        //this.setState({ nodes: simulationNodes });
      });

    this.simulation.restart();
  };

  render() {
    const { nodes, activeIndex } = this.state;
    const { width, height, selectChemical, selected } = this.props;
    return (
      <svg width={width} height={height}>
        {nodes
          .filter(d => d.relatedProjects > 0)
          .map((node, index) => {
            return (
              <g key={index}>
                <circle
                  data-tip={
                    radiusScale(node.relatedProjects) <= 10
                      ? node.name.toUpperCase()
                      : ""
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
                  r={radiusScale(node.relatedProjects)}
                  onClick={() => selectChemical("chemical", node.name)}
                  onMouseEnter={() => {
                    this.setState({ activeIndex: index });
                    ReactTooltip.show(findDOMNode(this.refs[node.name]));
                  }}
                  onMouseLeave={() => {
                    this.setState({ activeIndex: null });
                    ReactTooltip.hide(findDOMNode(this.refs[node.name]));
                  }}
                  style={{ cursor: "pointer" }}
                />

                {radiusScale(node.relatedProjects) > 10 && (
                  <g>
                    <rect
                      x={node.x - (node.name.length * 5.2) / 2}
                      y={node.y - 5}
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

export default ChemicalsViz;
