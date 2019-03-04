import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { findDOMNode } from 'react-dom';
import sanityClient from '../lib/sanity';
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceLink,
  forceRadial
} from 'd3-force';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { flatten, groupBy } from 'lodash';
import ReactTooltip from 'react-tooltip';
import { AppContext } from '../appContext';
import Search from './Search';
import { parseQueryParams } from '../utils';
import Responsive from 'react-responsive';

const query = `*[_type == "project"]{
  "researchers": researchers[]->
}`;

const svgWidth = window.innerWidth / 2 - 60;
const svgHeight = window.innerHeight - 140;

const radiusScale = scaleLinear().range([0, 60]);

class Researchers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      researchers: [],
      nodes: [],
      links: [],
      activeIndex: null
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

          let links = [];

          projects.map((researchers, index) => {
            const length = researchers.length;
            for (let i = 0; i < length; i++) {
              const researcher1 = researchers[0];
              const remainingResearchers = researchers;
              remainingResearchers.splice(0, 1);

              if (remainingResearchers.length > 0) {
                for (let j = 0; j < remainingResearchers.length; j++) {
                  const researcher2 = remainingResearchers[j];
                  const sortedResearchers = [researcher1, researcher2].sort();

                  links.push(sortedResearchers);
                  //console.log(researcher1, researcher2);
                  // if (!links[researcher1]) {
                  //   links[researcher1] = {};
                  //   links[researcher1][researcher2] = { count: 1 };
                  // } else if (!links[researcher1][researcher2]) {
                  //   links[researcher1][researcher2] = { count: 1 };
                  // } else {
                  //   links[researcher1][researcher2].count += 1;
                  // }
                }
              }
            }
          });

          console.log(links);

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

    const researchersLinksGrouped = Object.values(groupBy(researchersLinks));
    const formattedLinks = [];

    researchersLinksGrouped.map((value, i) => {
      const source = researchersNodes.findIndex(v => v.name === value[0][0]);
      const target = researchersNodes.findIndex(v => v.name === value[0][1]);
      const weight = value.length;

      formattedLinks.push({ source: source, target: target, weight: weight });
    });

    this.setState({ links: formattedLinks });

    const simulation = forceSimulation(simulationNodes)
      .force('charge', forceManyBody().strength(-10))
      .force(
        'link',
        forceLink(formattedLinks)
          .strength(d => {
            return d.weight;
          })
          .distance(d => {
            return d.weight * 3;
          })
      )
      .force('r', forceRadial(120))
      .force('center', forceCenter(svgWidth / 2, svgHeight / 2))
      .force(
        'collision',
        forceCollide()
          .radius(n => n.radius + 15)
          .strength(1)
          .iterations(5)
      )
      .on('tick', a => {
        simulationNodes.forEach(function(d) {
          d.x =
            d.x < radiusScale(d.value)
              ? radiusScale(d.value) + 5
              : d.x > svgWidth - radiusScale(d.value)
              ? svgWidth - radiusScale(d.value) - 5
              : d.x;
          d.y =
            d.y < radiusScale(d.value)
              ? radiusScale(d.value) + 5
              : d.y > svgHeight - radiusScale(d.value)
              ? svgHeight - radiusScale(d.value) - 5
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
    const { nodes, links, researchers, activeIndex } = this.state;
    const selected = this.context.selected
      ? this.context.selected.map(s => s.value)
      : [];
    return (
      <div className='viz-container'>
        <ReactTooltip
          place='top'
          theme='dark'
          effect='solid'
          className='tooltip-extra-class'
        />
        <Search
          items={researchers}
          selectionCallBack={this.selectResearcher}
          type={'researcher'}
        />
        <Responsive minWidth={600}>
          <div
            className='w-100 d-flex flex-column mt-4'
            style={{ height: 'calc(100% - 33px)' }}
          >
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
                        data-tip={
                          radiusScale(node.value) <= 10
                            ? node.name.toUpperCase()
                            : ''
                        }
                        ref={node.name}
                        cx={node.x}
                        cy={node.y}
                        className={`circle ${
                          selected.indexOf(node.name) > -1 ||
                          activeIndex === index
                            ? 'active'
                            : ''
                        }`}
                        stroke='black'
                        strokeWidth={1}
                        r={radiusScale(node.value)}
                        onClick={() =>
                          this.selectResearcher('researcher', node.name)
                        }
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
                                ? 'active'
                                : ''
                            }`}
                          />
                          <text
                            dx={node.x}
                            dy={node.y}
                            className={`text ${
                              selected.indexOf(node.name) > -1 ||
                              activeIndex === index
                                ? 'active'
                                : ''
                            }`}
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
        </Responsive>
      </div>
    );
  }
}

const wrappedClass = withRouter(Researchers);
wrappedClass.WrappedComponent.contextType = AppContext;
export default wrappedClass;
