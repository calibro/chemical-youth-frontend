import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import sanityClient from "../lib/sanity";
import { flatten } from "lodash";
import ReactTooltip from "react-tooltip";
import { AppContext } from "../appContext";
import Search from "./Search";
import { parseQueryParams } from "../utils";
import { ParentSize } from "@vx/responsive";
import ResearchersViz from "./ResearchersViz";

const query = `*[_type == "project"]{
  "researchers": researchers[]->
}`;

class Researchers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      researchers: [],
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

          projects.forEach((researchers, index) => {
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
                }
              }
            }
          });

          this.setState({ researchers: nodes, links: links });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  selectResearcher = (type, value) => {
    this.context.toggleSelected({ type: type, value: value });
    const queryParams = parseQueryParams(this.context.selected);
    this.props.history.push(`/${this.context.section}${queryParams}`);
  };

  render() {
    const { links, researchers } = this.state;
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
          items={researchers}
          selectionCallBack={this.selectResearcher}
          type={"researcher"}
        />
        <div className="flex-grow-1 flex-shrink-1 overflow-auto d-none d-md-block">
          {researchers && (
            <ParentSize>
              {parent => {
                return (
                  parent.width &&
                  parent.height && (
                    <ResearchersViz
                      width={parent.width}
                      height={parent.height}
                      researchersNodes={researchers}
                      researchersLinks={links}
                      selected={selected}
                      selectResearcher={(type, value) =>
                        this.selectResearcher(type, value)
                      }
                    />
                  )
                );
              }}
            </ParentSize>
          )}
        </div>
      </div>
    );
  }
}

const wrappedClass = withRouter(Researchers);
wrappedClass.WrappedComponent.contextType = AppContext;
export default wrappedClass;
