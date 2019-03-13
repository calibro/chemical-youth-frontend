import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { withRouter } from "react-router-dom";
import sanityClient from "../lib/sanity";
import circlePack from "../lib/circlePack";
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide
} from "d3-force";
import { scaleLinear, scaleSqrt } from "d3-scale";
import { extent } from "d3-array";
import ReactTooltip from "react-tooltip";
import { AppContext } from "../appContext";
import Search from "./Search";
import { parseQueryParams } from "../utils";
import Responsive from "react-responsive";

const query = `*[_type=="chemical"]{
  name,
  "relatedProjects": count(*[_type=='project' && references(^._id)])
}`;

const svgWidth = window.innerWidth / 2 - 60;
const svgHeight = window.innerHeight - 140;

const radiusScale = scaleSqrt().range([5, 35]);

class Chemicals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chemicals: [],
      nodes: [],
      activeState: null
    };
    this.simulation = null;
  }

  componentDidMount() {
    if (this.state.chemicals.length === 0) {
      sanityClient
        .fetch(query)
        .then(res => {
          //setUpForceLayout(res);
          this.setState({ chemicals: res });
          this.setUpForceLayout(res);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  componentWillUnmount() {
    this.setState({ nodes: [] });
    this.simulation.stop();
  }

  setUpForceLayout = res => {
    const [min, max] = extent(res, d => d.relatedProjects);
    radiusScale.domain([1, max]);
    console.log(radiusScale.domain(), radiusScale.range());

    const simulationNodes = res
      .filter(r => r.relatedProjects > 0)
      .sort((a, b) => {
        return b.relatedProjects - a.relatedProjects;
      })
      .map(r => {
        r.radius = radiusScale(r.relatedProjects);
        return r;
      });

    const links = simulationNodes
      .map((n, i) => {
        if (i < simulationNodes.length - 1) {
          return {
            source: i,
            target: i + 1
          };
        }
      })
      .slice(0, simulationNodes.length - 1);

    this.simulation = forceSimulation(simulationNodes)
      .force("charge", forceManyBody().strength(5))
      //.force('link', forceLink(links))
      .force("center", forceCenter(svgWidth / 2, svgHeight / 2))
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
              : d.x > svgWidth - radiusScale(d.relatedProjects)
              ? svgWidth - radiusScale(d.relatedProjects)
              : d.x;

          d.y =
            d.y < radiusScale(d.relatedProjects)
              ? radiusScale(d.relatedProjects)
              : d.y > svgHeight - radiusScale(d.relatedProjects)
              ? svgHeight - radiusScale(d.relatedProjects)
              : d.y;
        });
        this.setState({ nodes: simulationNodes });
      })
      .on("end", a => {
        //this.setState({ nodes: simulationNodes });
      });
  };

  selectChemical = (type, value) => {
    this.context.toggleSelected({ type: type, value: value });
    const queryParams = parseQueryParams(this.context.selected);
    this.props.history.push(`/${this.context.section}${queryParams}`);
  };

  render() {
    const { nodes, chemicals, activeIndex } = this.state;
    const { isMobile } = this.props;
    const selected = this.context.selected
      ? this.context.selected.map(s => s.value)
      : [];
    return (
      <div className="viz-container">
        <ReactTooltip
          place="top"
          theme="dark"
          effect="solid"
          className="tooltip-extra-class"
        />
        <Search
          items={chemicals}
          selectionCallBack={this.selectChemical}
          type={"chemical"}
        />
        <Responsive minWidth={768}>
          <div className="flex-grow-1 flex-shrink-1">
            <svg width={svgWidth} height={svgHeight}>
              {nodes.map((node, index) => {
                const radius = radiusScale(node.relatedProjects);
                if (node.relatedProjects > 0) {
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
                          selected.indexOf(node.name) > -1 ||
                          activeIndex === index
                            ? "active"
                            : ""
                        }`}
                        stroke="black"
                        strokeWidth={1}
                        r={radiusScale(node.relatedProjects)}
                        onClick={() =>
                          this.selectChemical("chemical", node.name)
                        }
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
                }
              })}
            </svg>
          </div>
        </Responsive>
      </div>
    );
  }
}

const wrappedClass = withRouter(Chemicals);
wrappedClass.WrappedComponent.contextType = AppContext;
export default wrappedClass;
