import React, { useState, useEffect, useContext } from 'react';
import sanityClient from '../lib/sanity';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { AppContext } from '../appContext';
import Autocomplete from 'react-autocomplete';

const query = `*[_type=="topic"]{
  _id, name,
  "relatedProjects": count(*[_type=='project' && references(^._id)])
}`;

const wordScale = scaleLinear()
  .domain([0, 5])
  .range([10, 36]);

const Topics = ({ type }) => {
  const [topics, setTopics] = useState([]);
  const [value, setValue] = useState('');
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
  }, [type]);

  function handleStatusChange(res) {
    const [min, max] = extent(res, d => d.relatedProjects);
    wordScale.domain([0, max]);

    setTopics(res);
  }

  const matchStateToTerm = (elem, value) => {
    if (value.length > 0) {
      return elem.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    }
  };

  return (
    <div className='w-100 h-100 d-flex flex-column'>
      <div className='w-100 p-3'>
        <Autocomplete
          getItemValue={item => item.name}
          items={topics}
          inputProps={{ className: 'states-autocomplete' }}
          wrapperStyle={{
            position: 'relative'
          }}
          menuStyle={{
            backgroundColor: 'white'
          }}
          renderItem={(item, isHighlighted) => (
            <div
              key={item._id}
              style={{ background: isHighlighted ? 'lightgray' : 'white' }}
            >
              {item.name}
            </div>
          )}
          value={value}
          shouldItemRender={matchStateToTerm}
          onChange={(event, value) => setValue(value)}
          onSelect={val => {
            context.setSelectedTopic(val);
            setValue('');
          }}
        />
      </div>
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
                onClick={() => context.setSelectedTopic(topic.name)}
              >
                <div
                  style={{
                    fontSize: wordScale(topic.relatedProjects),
                    bottom: '3px',
                    fontWeight:
                      context.selectedTopic === topic.name ? 'bold' : 'normal'
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
