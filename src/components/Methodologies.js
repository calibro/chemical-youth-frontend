import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import sanityClient from '../lib/sanity';
import { scaleLog } from 'd3-scale';
import { extent } from 'd3-array';
import { AppContext } from '../appContext';

const query = `*[_type == "methodology"]{
  _id, name,
  "relatedProjects": count(*[_type=='project' && references(^._id)])
}`;

const heightScale = scaleLog().range([30, 150]);

const Methodologies = ({ type, history }) => {
  const [methodologies, setMethodologies] = useState([]);
  const context = useContext(AppContext);

  useEffect(() => {
    if (methodologies.length === 0) {
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

  const handleStatusChange = res => {
    setMethodologies(res);
    const [min, max] = extent(res, d => d.relatedProjects);
    heightScale.domain([0, max]);
  };

  const selectMethod = (type, value) => {
    context.toggleSelected({ type: type, value: value });
    //history.push(`/${type}/${value}`);
  };

  return (
    <div className='w-100 h-100 d-flex flex-column'>
      <div className='w-100 d-flex p-3' />
      <div className='w-100 h-100'>
        {methodologies
          .sort((a, b) => b.relatedProjects - a.relatedProjects)
          .map((methodology, index) => {
            const selected = context.selected.map(s => s.value);
            return (
              <div
                className='w-100 px-3 d-flex align-items-center cursor-pointer'
                key={index}
                style={{
                  height: `${heightScale(methodology.relatedProjects)}px`,
                  borderTop: '1px solid #b7b7b7',
                  backgroundColor:
                    selected.indexOf(methodology.name) > -1 ? 'black' : 'white',
                  color:
                    selected.indexOf(methodology.name) > -1 ? 'white' : 'black'
                }}
                onClick={() => selectMethod('method', methodology.name)}
              >
                {methodology.relatedProjects} {methodology.name}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default withRouter(Methodologies);
