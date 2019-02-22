import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import sanityClient from '../lib/sanity';
import Location from './Location';
import { AppContext } from '../appContext';
import Search from './Search';
import Loader from './Loader';
import { parseQueryParams } from '../utils';

const query = `*[_type == "location"]{
  _id, city, coordinates, zoom,
  country->,
  "relatedProjects": count(*[_type=='project' && references(^._id)])
}`;

const Locations = ({ type, history }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const context = useContext(AppContext);

  useEffect(() => {
    if (locations.length === 0) {
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
    setLocations(res);
    setLoading(false);
  };

  const selectLocation = (type, value) => {
    context.toggleSelected({ type: type, value: value });
    const queryParams = parseQueryParams(context.selected);
    history.push(`/${context.section}${queryParams}`);
  };

  return (
    <div className='container'>
      {loading && <Loader />}
      <Search
        items={locations}
        selectionCallBack={selectLocation}
        type={'location'}
        objectKey={'city'}
      />
      <div className='w-100 d-flex flex-wrap'>
        {locations.map((location, index) => {
          if (location.coordinates.lat) {
            return (
              <Location
                key={index}
                coordinates={location.coordinates}
                zoom={location.zoom}
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
