import React from "react";
import { hierarchy, pack } from "d3-hierarchy";
import { nest } from "d3-collection";
import ReactTooltip from "react-tooltip";
import { findDOMNode } from "react-dom";
import { Annotation, ConnectorLine, Note } from "react-annotation";
import styles from "./BubbleViz.module.css";

class BubbleViz extends React.PureComponent {
  tree = nodes => {
    const tree = {
      name: "body",
      children: []
    };

    const nested = nest()
      .key(d => d.group)
      .entries(nodes);

    nested.forEach(d => {
      tree.children.push({
        name: d.key,
        children: d.values.map(d => {
          return { name: d.part, count: d.count };
        })
      });
    });

    return tree;
  };

  packed = (data, width) => {
    if (!width) {
      return;
    }
    const layout = pack()
      .size([width, width])
      .padding(3);

    const root = hierarchy(data)
      .sum(d => {
        return d.count;
      })
      .sort((a, b) => {
        return b.count - a.count;
      });
    return layout(root);
  };

  render() {
    const { data, width, height, selectPart, selected } = this.props;
    const nodes = this.packed(this.tree(data), width);
    return (
      <React.Fragment>
        <ReactTooltip
          place="top"
          theme="dark"
          effect="solid"
          className="tooltip-extra-class"
        />

        <svg width={width} height={width}>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                style={{ stopColor: "rgb(218,175,202)", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "rgb(230,203,185)", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>

          {nodes &&
            nodes.descendants().map(node => {
              return (
                <g key={node.data.name}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    stroke={
                      node.children ? (node.depth ? "#dee2e6" : "none") : "none"
                    }
                    fill={node.children ? "none" : "url(#grad1)"}
                    className={`${styles.circles} ${
                      selected === node.data.name ? styles.active : ""
                    }`}
                    data-tip={node.r <= 10 ? node.data.name.toUpperCase() : ""}
                    ref={node.data.name}
                    onMouseEnter={() => {
                      ReactTooltip.show(findDOMNode(this.refs[node.data.name]));
                    }}
                    onMouseLeave={() => {
                      ReactTooltip.hide(findDOMNode(this.refs[node.data.name]));
                    }}
                    onClick={
                      node.children
                        ? () => {}
                        : () => {
                            selectPart(node.data.name);
                          }
                    }
                  />
                  {!node.children && node.r > 10 && (
                    <text dy={5} x={node.x} y={node.y} textAnchor="middle">
                      {node.data.name}
                    </text>
                  )}
                  {node.children && node.depth && (
                    <Annotation
                      x={node.x > width / 2 ? node.x + node.r : node.x - node.r}
                      y={node.y}
                      dy={-30}
                      dx={node.x > width / 2 ? 60 : -60}
                      color={"#dee2e6"}
                      title={node.data.name}
                    >
                      <ConnectorLine />
                      <Note
                        align={"middle"}
                        orientation={"topBottom"}
                        padding={5}
                        titleColor={"black"}
                        lineType={null}
                      />
                    </Annotation>
                  )}
                </g>
              );
            })}
        </svg>
      </React.Fragment>
    );
  }
}

export default BubbleViz;
