import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import sanityClient from '../lib/sanity';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { AppContext } from '../appContext';
import Autocomplete from 'react-autocomplete';
import Search from './Search';

const query = `*[_type=="topic"]{
  _id, name,
  "relatedProjects": count(*[_type=='project' && references(^._id)])
}`;

const wordScale = scaleLinear()
  .domain([0, 5])
  .range([10, 36]);

const Topics = ({ history }) => {
  const [topics, setTopics] = useState([]);
  const context = useContext(AppContext);

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
  });

  function handleStatusChange(res) {
    const [min, max] = extent(res, d => d.relatedProjects);
    wordScale.domain([0, max]);

    setTopics(res);
  }

  const selectTopic = (type, value) => {
    context.setSelected({ type: type, value: value });
    history.push(`/${type}/${value}`);
  };

  return (
    <div className='w-100 h-100 d-flex flex-column'>
      <Search items={topics} selectionCallBack={selectTopic} type={'topic'} />
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
                onClick={() => selectTopic('topic', topic.name)}
              >
                <div
                  style={{
                    fontSize: wordScale(topic.relatedProjects),
                    bottom: '3px',
                    fontWeight:
                      context.selected.value === topic.name ? 'bold' : 'normal'
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

export default withRouter(Topics);
