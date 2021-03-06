import React from "react";
// import sanityClient from "../../lib/sanity";
// import { AppContext } from "../../appContext";
// import Loader from "../Loader";
// import bbox from "@turf/bbox";
// import { lineString } from "@turf/helpers";
// import ReactStreetview from "./ReactStreetView";
// import SpecialProjectMap from "./SpecialProjectMap";
import { ParentSize } from "@vx/responsive";
import { scaleLinear, scaleSqrt } from "d3-scale";
import { extent } from "d3-array";
import BubbleViz from "./BubbleViz";
import { list } from "./data/list.json";
import { bubble } from "./data/bubble_chart.json";
import styles from "./SpecialProjectBody.module.css";

class SpecialProjectBody extends React.PureComponent {
  state = {
    selected: "brain"
  };

  selectPart = part => {
    this.setState({ selected: part });
  };

  render() {
    const { selected } = this.state;
    const max = extent(list.filter(d => selected === d.part), d => d.weight)[1];
    const wordScale = scaleSqrt()
      .range([12, 36])
      .domain([1, max]);

    return (
      <div className="row no-gutters border-top">
        <div className="col-12 col-md-6">
          <div className={styles.bubbleContainer}>
            <ParentSize>
              {parent => {
                return (
                  <BubbleViz
                    width={parent.height}
                    height={parent.height}
                    data={bubble}
                    selectPart={part => {
                      this.selectPart(part);
                    }}
                    selected={selected}
                  />
                );
              }}
            </ParentSize>
          </div>
        </div>
        <div className="col-12 col-md-6 border-left">
          <h4 className={`${styles.title} p-3`}>
            <b>{selected}</b> related words:
          </h4>
          <div className="flex-wrap align-items-baseline p-3 overflow-auto flex-grow-1 flex-shrink-1 d-none d-md-flex">
            {list
              .filter(d => selected === d.part)
              .sort((a, b) => {
                return b.weight - a.weight;
              })
              .slice(0, 50)
              .map((link, index) => {
                return (
                  <div
                    className={`position-relative mr-3`}
                    key={index}
                    style={{
                      height: "45px"
                    }}
                  >
                    <div
                      style={{
                        fontSize: wordScale ? wordScale(link.weight) : "10px",
                        bottom: "3px"
                      }}
                    >
                      {link.word} <sup>{link.weight}</sup>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

export default SpecialProjectBody;
