import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import sanityClient from "../lib/sanity";
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";
import { AppContext } from "../appContext";
import Search from "./Search";
import { parseQueryParams } from "../utils";
import Loader from "./Loader";
import Responsive from "react-responsive";

const query = `*[_type=="topic"]{
  _id, name,
  "relatedProjects": count(*[_type=='project' && references(^._id)])
}`;

const Topics = ({ type, history }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const context = useContext(AppContext);

  useEffect(() => {
    if (topics.length === 0) {
      sanityClient
        .fetch(query)
        .then(res => {
          handleStatusChange(res);
          return () => {
            // Clean up
          };
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [type]);

  function handleStatusChange(res) {
    setTopics(res);
    setLoading(false);
  }

  const selectTopic = (type, value) => {
    context.toggleSelected({ type: type, value: value });
    const queryParams = parseQueryParams(context.selected);
    history.push(`/${context.section}${queryParams}`);
  };

  const selected = context.selected ? context.selected.map(s => s.value) : [];

  const [min, max] = extent(topics, d => d.relatedProjects);
  const wordScale = scaleLinear()
    .range([10, 36])
    .domain([0, max]);

  return (
    <div className="viz-container">
      {loading && <Loader />}
      <Search items={topics} selectionCallBack={selectTopic} type={"topic"} />
      <Responsive minWidth={768}>
        <div
          className="w-100 d-flex flex-wrap align-items-baseline pt-3 overflow-auto"
          style={{ height: "calc(100% - 33px)" }}
        >
          {topics
            .sort((a, b) => {
              return b.relatedProjects - a.relatedProjects;
            })
            .map((topic, index) => {
              return (
                <div
                  className={`position-relative mr-3`}
                  key={index}
                  style={{
                    height: "45px"
                  }}
                  onClick={() => selectTopic("topic", topic.name)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div
                    className="cursor-pointer"
                    style={{
                      fontSize: wordScale
                        ? wordScale(topic.relatedProjects)
                        : "10px",
                      bottom: "3px"
                    }}
                  >
                    {topic.name} <sup>{topic.relatedProjects}</sup>
                  </div>
                  <div
                    className={`topic-block-line ${
                      selected.indexOf(topic.name) > -1 || activeIndex === index
                        ? "active"
                        : ""
                    }`}
                  />
                </div>
              );
            })}
        </div>
      </Responsive>
    </div>
  );
};

export default withRouter(Topics);
