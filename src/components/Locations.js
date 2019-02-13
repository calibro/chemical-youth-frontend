import React, { useState, useEffect } from 'react';
import sanityClient from '../lib/sanity';

const query = `*[_type == "location"]{
  _id, city,
  country->
}`;

const Locations = ({ type }) => {
  const [locations, setLocations] = useState([]);

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
    setLocations(res);
  }

  return (
    <div className='w-100 h-100 d-flex flex-column'>
      <div className='w-100 d-flex p-3' />
      <div className='w-100 h-100 d-flex flex-column'>
        {locations.map((location, index) => {
          return (
            <div className='p-3' key={index}>
              {`${location.country ? location.country.name : 'no Country'} ${
                location.city
              }`}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Locations;
