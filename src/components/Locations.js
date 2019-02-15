import React, { useState, useEffect } from 'react';
import sanityClient from '../lib/sanity';
import Location from './Location';

const query = `*[_type == "location"]{
  _id, city, coordinates,
  country->,
  "relatedProjects": count(*[_type=='project' && references(^._id)])
}`;

const Locations = ({ type }) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

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
      <div className='w-100 h-100 d-flex flex-wrap'>
        {locations.map((location, index) => {
          if (location.coordinates.lat) {
            return (
              <Location
                key={index}
                coordinates={location.coordinates}
                zoom={10}
                country={location.country.name}
                city={location.city}
                callbackClick={setSelectedLocation}
                selected={selectedLocation}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default Locations;
