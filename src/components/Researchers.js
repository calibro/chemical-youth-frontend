import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { findDOMNode } from 'react-dom';
import sanityClient from '../lib/sanity';
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceLink
} from 'd3-force';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { flatten } from 'lodash';
import ReactTooltip from 'react-tooltip';
import { AppContext } from '../appContext';
import Search from './Search';
import { parseQueryParams } from '../utils';

const query = `*[_type == "project"]{
  "researchers": researchers[]->
}`;

const svgWidth = window.innerWidth / 2 - 40;
const svgHeight = window.innerHeight - 140;

const radiusScale = scaleLinear().range([0, 50]);

class Researchers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      researchers: [],
      nodes: [],
      links: []
    };
  }

  componentDidMount() {
    if (this.state.researchers.length === 0) {
      sanityClient
        .fetch(query)
        .then(res => {
          //setUpForceLayout(res);
          const researchersOccurency = flatten(
            res.map(r => r.researchers.map(v => v.name))
          );
          const researchersCount = researchersOccurency.reduce((prev, cur) => {
            prev[cur] = (prev[cur] || 0) + 1;
            return prev;
          }, {});
          const nodes = Object.entries(researchersCount).map(v => {
            return { name: v[0], value: v[1] };
          });

          const projects = res.map(r => r.researchers.map(v => v.name));

          let links = {};

          projects.map(researchers => {
            if (researchers.length > 1) {
              for (let i = 0; i < researchers.length - 1; i++) {
                const researcher1 = researchers[i];
                const researcher2 = researchers[i + 1];
                if (!links[researcher1]) {
                  links[researcher1] = {};
                  links[researcher1][researcher2] = { count: 1 };
                } else if (!links[researcher1][researcher2]) {
                  links[researcher1][researcher2] = { count: 1 };
                } else {
                  links[researcher1][researcher2].count += 1;
                }
              }
            }
          });

          this.setState({ researchers: nodes });
          this.setUpForceLayout(nodes, links);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  setUpForceLayout = (researchersNodes, researchersLinks) => {
    const [min, max] = extent(researchersNodes, d => d.value);
    radiusScale.domain([0, max]);

    const simulationNodes = researchersNodes
      .filter(r => r.value > 0)
      .map(r => {
        r.radius = radiusScale(r.value);
        return r;
      });

    const researchersLinksArray = Object.entries(researchersLinks);
    const formattedLinks = [];
    researchersLinksArray.forEach((value, i) => {
      const source = researchersNodes.findIndex(v => v.name === value[0]);
      const targets = Object.entries(value[1]);
      targets.forEach(t => {
        const target = researchersNodes.findIndex(v => v.name === t[0]);
        const weight = t[1].count;
        formattedLinks.push({ source: source, target: target, weight: weight });
      });
    });

    this.setState({ links: formattedLinks });

    const simulation = forceSimulation(simulationNodes)
      .force('charge', forceManyBody().strength(-3))
      .force('link', forceLink(formattedLinks))
      .force('center', forceCenter(svgWidth / 2, svgHeight / 2))
      .force(
        'collision',
        forceCollide()
          .radius(n => n.radius + 12)
          .strength(3)
          .iterations(1)
      )
      .on('tick', a => {
        simulationNodes.forEach(function(d) {
          d.x =
            d.x < radiusScale(d.value)
              ? radiusScale(d.value)
              : d.x > svgWidth - radiusScale(d.value)
              ? svgWidth - radiusScale(d.value)
              : d.x;

          d.y =
            d.y < radiusScale(d.value)
              ? radiusScale(d.value)
              : d.y > svgHeight - radiusScale(d.value)
              ? svgHeight - radiusScale(d.value)
              : d.y;
        });
        this.setState({ nodes: simulationNodes });
      });
  };

  selectResearcher = (type, value) => {
    this.context.toggleSelected({ type: type, value: value });
    const queryParams = parseQueryParams(this.context.selected);
    this.props.history.push(`/${this.context.section}${queryParams}`);
  };

  render() {
    const { nodes, links, researchers } = this.state;
    const selected = this.context.selected
      ? this.context.selected.map(s => s.value)
      : [];
    return (
      <div className='container'>
        <ReactTooltip place='top' theme='dark' effect='solid' />
        <Search
          items={researchers}
          selectionCallBack={this.selectResearcher}
          type={'researcher'}
        />
        <div className='w-100 h-100 d-flex flex-column'>
          <svg width={svgWidth} height={svgHeight}>
            {links.map((link, index) => {
              return (
                <g key={index}>
                  <line
                    x1={link.source.x}
                    y1={link.source.y}
                    x2={link.target.x}
                    y2={link.target.y}
                    style={{ strokeWidth: link.weight }}
                    stroke='black'
                  />
                </g>
              );
            })}
            {nodes.map((node, index) => {
              const radius = radiusScale(node.value);
              if (node.value > 0) {
                return (
                  <g key={index}>
                    <circle
                      data-tip={node.name}
                      ref={node.name}
                      cx={node.x}
                      cy={node.y}
                      fill={
                        selected.indexOf(node.name.toLowerCase()) > -1
                          ? 'black'
                          : 'white'
                      }
                      stroke='black'
                      strokeWidth={1}
                      r={radiusScale(node.value)}
                      onClick={() =>
                        this.selectResearcher(
                          'researcher',
                          node.name.toLowerCase()
                        )
                      }
                      onMouseEnter={() =>
                        ReactTooltip.show(findDOMNode(this.refs[node.name]))
                      }
                      onMouseLeave={() =>
                        ReactTooltip.hide(findDOMNode(this.refs[node.name]))
                      }
                    />

                    {radiusScale(node.value) > 10 && (
                      <g>
                        <rect
                          x={node.x - radiusScale(node.value) - 5}
                          y={node.y - 5}
                          width={radiusScale(node.value) * 2 + 10}
                          height={10}
                          fill={
                            selected.indexOf(node.name) > -1 ? 'none' : 'white'
                          }
                          style={{
                            pointerEvents: 'none'
                          }}
                        />
                        <text
                          dx={node.x}
                          dy={node.y}
                          style={{
                            fontSize: '9px',
                            textTransform: 'uppercase',
                            dominantBaseline: 'central',
                            pointerEvents: 'none'
                          }}
                          fill={
                            selected.indexOf(node.name) > -1 ? 'white' : 'black'
                          }
                          textAnchor='middle'
                          //filter='url(#solid)'
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
      </div>
    );
  }
}

const wrappedClass = withRouter(Researchers);
wrappedClass.WrappedComponent.contextType = AppContext;
export default wrappedClass;
