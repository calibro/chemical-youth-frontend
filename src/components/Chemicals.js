import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import sanityClient from "../lib/sanity";
import { ParentSize } from "@vx/responsive";
import ReactTooltip from "react-tooltip";
import { AppContext } from "../appContext";
import Search from "./Search";
import { parseQueryParams } from "../utils";

import ChemicalsViz from "./ChemicalsViz";

const query = `*[_type=="chemical"]{
  name,
  "relatedProjects": count(*[_type=='project' && references(^._id)])
}`;

class Chemicals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chemicals: [],
      activeState: null
    };
  }

  componentDidMount() {
    if (this.state.chemicals.length === 0) {
      sanityClient
        .fetch(query)
        .then(res => {
          this.setState({ chemicals: res });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  componentWillUnmount() {
    // this.setState({ nodes: [] });
    // this.simulation.stop();
  }

  selectChemical = (type, value) => {
    this.context.toggleSelected({ type: type, value: value });
    const queryParams = parseQueryParams(this.context.selected);
    this.props.history.push(`/${this.context.section}${queryParams}`);
  };

  render() {
    const { chemicals } = this.state;
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

        <div className="flex-grow-1 flex-shrink-1 overflow-auto d-none d-md-block">
          {chemicals && (
            <ParentSize>
              {parent => {
                return (
                  <ChemicalsViz
                    width={parent.width}
                    height={parent.height}
                    chemicals={chemicals}
                    selected={selected}
                    selectChemical={(type, value) =>
                      this.selectChemical(type, value)
                    }
                  />
                );
              }}
            </ParentSize>
          )}
        </div>
      </div>
    );
  }
}

const wrappedClass = withRouter(Chemicals);
wrappedClass.WrappedComponent.contextType = AppContext;
export default wrappedClass;
