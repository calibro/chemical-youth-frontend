import React, { useState, useEffect } from 'react';
import sanityClient from '../lib/sanity';

const query = `*[_type == "researcher"]`;

const Researchers = ({ type }) => {
  const [researchers, setResearchers] = useState([]);

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
    setResearchers(res);
  }

  return (
    <div className='w-100 h-100 d-flex flex-column'>
      <div className='w-100 d-flex p-3' />
      <div className='w-100 h-100 d-flex flex-column'>
        {researchers.map((researcher, index) => {
          return (
            <div className='p-3' key={index}>
              {researcher.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Researchers;
