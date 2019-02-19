import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import sanityClient from '../lib/sanity';
import Location from './Location';
import { AppContext } from '../appContext';
import Search from './Search';

const query = `*[_type == "location"]{
  _id, city, coordinates,
  country->,
  "relatedProjects": count(*[_type=='project' && references(^._id)])
}`;

const Locations = ({ type, history }) => {
  const [locations, setLocations] = useState([]);
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

  const handleStatusChange = res => {
    setLocations(res);
  };

  const selectLocation = (type, value) => {
    context.toggleSelected({ type: type, value: value });
    //history.push(`/${type}/${value}`);
  };

  return (
    <div className='w-100 h-100 d-flex flex-column'>
      <Search
        items={locations}
        selectionCallBack={selectLocation}
        type={'topic'}
        objectKey={'city'}
      />
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
                callbackClick={selectLocation}
                selected={
                  context.selected ? context.selected.map(s => s.value) : []
                }
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default withRouter(Locations);
