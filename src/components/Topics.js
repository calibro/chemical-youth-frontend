import React, { useState, useEffect } from 'react';
import sanityClient from '../lib/sanity';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';

const query = `*[_type=="topic"]{
  name,
  "relatedProjects": count(*[_type=='project' && references(^._id)])
}`;

const wordScale = scaleLinear()
  .domain([0, 5])
  .range([10, 36]);

const Topics = ({ type }) => {
  const [topics, setTopics] = useState([]);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
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
  }, [type]);

  function handleStatusChange(res) {
    const [min, max] = extent(res, d => d.relatedProjects);
    wordScale.domain([0, max]);

    setTopics(res);
  }

  return (
    <div className='w-100 h-100 d-flex flex-column'>
      <div className='w-100 d-flex p-3' />
      <div className='w-100 h-100 d-flex flex-wrap p-3 align-items-baseline'>
        {topics
          .sort((a, b) => {
            return b.relatedProjects - a.relatedProjects;
          })
          .map((topic, index) => {
            return (
              <div
                className='position-relative px-3'
                key={index}
                style={{
                  height: '45px'
                }}
              >
                <div
                  style={{
                    fontSize: wordScale(topic.relatedProjects),
                    bottom: '3px'
                  }}
                >
                  {topic.name} <sup>{topic.relatedProjects}</sup>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Topics;
