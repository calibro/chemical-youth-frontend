import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { withRouter } from 'react-router-dom';
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
import ReactTooltip from 'react-tooltip';
import { AppContext } from '../appContext';
import Search from './Search';
import { parseQueryParams } from '../utils';

const query = `*[_type=="chemical"]{
  name,
  "relatedProjects": count(*[_type=='project' && references(^._id)])
}`;

const svgWidth = window.innerWidth / 2 - 60;
const svgHeight = window.innerHeight - 140;

const radiusScale = scaleLinear().range([0, 50]);

// const Chemicals = ({ type }) => {
//   const [chemicals, setChemicals] = useState([]);
//   const [nodes, setNodes] = useState([]);
//   const [simulation, setSimulation] = useState(null);

//   // Similar to componentDidMount and componentDidUpdate:
//   useEffect(() => {
//     sanityClient
//       .fetch(query)
//       .then(res => {
//         //setUpForceLayout(res);
//         setChemicals(res);
//         return () => {
//           // Clean up
//         };
//       })
//       .catch(err => {
//         console.error(err);
//       });
//   }, [type]);

// useEffect(() => {
//   const simulationNodes = nodes
//     .filter(r => r.relatedProjects > 0)
//     .sort((a, b) => {
//       return b.relatedProjects - a.relatedProjects;
//     })
//     .map(r => {
//       r.radius = radiusScale(r.relatedProjects);
//       return r;
//     });

//   console.log(simulationNodes);

//   const links = simulationNodes
//     .map((n, i) => {
//       if (i < simulationNodes.length - 1) {
//         return {
//           source: i,
//           target: i + 1
//         };
//       }
//     })
//     .slice(0, simulationNodes.length - 1);
//   console.log(links);
//   const simulation = forceSimulation(simulationNodes)
//     .force('charge', forceManyBody().strength(50))
//     //.force('link', forceLink(links))
//     .force('center', forceCenter(svgWidth / 2, svgHeight / 2))
//     .force(
//       'collision',
//       forceCollide()
//         .radius(30)
//         .strength(2)
//         .iterations(2)
//     )
//     .on('tick', a => {
//       console.log('here');
//       setNodes(simulationNodes);
//       //setNodes(nodes);
//     });
//   setSimulation(simulation);
// });

//   return (
//     <div className='w-100 h-100 d-flex flex-column'>
//       <div className='w-100 d-flex p-3' />
//       <div className='w-100 h-100 d-flex flex-column'>
//         <svg width={svgWidth} height={svgHeight}>
//           <defs>
//             <filter x='0' y='0' width='1' height='1' id='solid'>
//               <feFlood floodColor='white' />
//               <feComposite in='SourceGraphic' />
//             </filter>
//           </defs>
//           {nodes.map((node, index) => {
//             if (node.relatedProjects > 0) {
//               return (
//                 <g key={index}>
//                   <circle
//                     cx={node.x}
//                     cy={node.y}
//                     fill='white'
//                     stroke='black'
//                     strokeWidth={2}
//                     r={30}
//                   />
//                   {/* <text
//                     dx={node.x}
//                     dy={node.y}
//                     style={{
//                       fontSize: '10px',
//                       textTransform: 'uppercase',
//                       dominantBaseline: 'central'
//                     }}
//                     fill={'black'}
//                     textAnchor='middle'
//                     filter='url(#solid)'
//                   >
//                     {node.name}
//                   </text> */}
//                 </g>
//               );
//             }
//           })}
//         </svg>
//       </div>
//     </div>
//   );
// };
//export default Chemicals;

class Chemicals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chemicals: [],
      nodes: []
    };
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

  setUpForceLayout = res => {
    const [min, max] = extent(res, d => d.relatedProjects);
    radiusScale.domain([0, max]);

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

    const simulation = forceSimulation(simulationNodes)
      .force('charge', forceManyBody().strength(50))
      //.force('link', forceLink(links))
      .force('center', forceCenter(svgWidth / 2, svgHeight / 2))
      .force(
        'collision',
        forceCollide()
          .radius(n => n.radius + 10)
          .strength(2)
          .iterations(1)
      )
      .on('tick', a => {
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
      });
  };

  selectChemical = (type, value) => {
    this.context.toggleSelected({ type: type, value: value });
    const queryParams = parseQueryParams(this.context.selected);
    this.props.history.push(`/${this.context.section}${queryParams}`);
  };

  render() {
    const { nodes, chemicals } = this.state;
    const selected = this.context.selected
      ? this.context.selected.map(s => s.value)
      : [];
    return (
      <div className='viz-container'>
        <ReactTooltip place='top' theme='dark' effect='solid' />
        <Search
          items={chemicals}
          selectionCallBack={this.selectChemical}
          type={'chemical'}
        />
        <div className='w-100 h-100 d-flex flex-column'>
          <svg width={svgWidth} height={svgHeight}>
            {nodes.map((node, index) => {
              const radius = radiusScale(node.relatedProjects);
              if (node.relatedProjects > 0) {
                return (
                  <g key={index}>
                    <circle
                      data-tip={node.name}
                      ref={node.name}
                      cx={node.x}
                      cy={node.y}
                      fill={
                        selected.indexOf(node.name) > -1 ? 'black' : 'white'
                      }
                      stroke='black'
                      strokeWidth={2}
                      r={radiusScale(node.relatedProjects)}
                      onClick={() => this.selectChemical('chemical', node.name)}
                      onMouseEnter={() =>
                        ReactTooltip.show(findDOMNode(this.refs[node.name]))
                      }
                      onMouseLeave={() =>
                        ReactTooltip.hide(findDOMNode(this.refs[node.name]))
                      }
                      style={{ cursor: 'pointer' }}
                    />

                    {radiusScale(node.relatedProjects) > 10 && (
                      <g>
                        <rect
                          x={node.x - radiusScale(node.relatedProjects) - 5}
                          y={node.y - 5}
                          width={radiusScale(node.relatedProjects) * 2 + 10}
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

const wrappedClass = withRouter(Chemicals);
wrappedClass.WrappedComponent.contextType = AppContext;
export default wrappedClass;
