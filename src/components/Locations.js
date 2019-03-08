import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import sanityClient from '../lib/sanity';
import { ScrollToHOC, ScrollArea } from 'react-scroll-to';
import Location from './Location';
import { AppContext } from '../appContext';
import Search from './Search';
import Loader from './Loader';
import { parseQueryParams } from '../utils';
import Responsive from 'react-responsive';

const query = `*[_type == "location"]{
  _id, city, coordinates, zoom,
  country->,
  "relatedProjects": count(*[_type=='project' && references(^._id)])
}`;

let offsets = {};

const Locations = ({ type, history, scrollTo }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
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
    res
      .filter(v => v.coordinates.lat)
      .forEach((v, i) => {
        offsets[v.city] = getYOffset(i);
      });
    setLoading(false);
  };

  const selectLocation = (type, value) => {
    context.toggleSelected({ type: type, value: value });
    const queryParams = parseQueryParams(context.selected);
    history.push(`/${context.section}${queryParams}`);
    scrollTo({ id: 'locations', y: offsets[value], smooth: true });
  };

  const getYOffset = index => {
    const rowHeight = (window.innerWidth / 100) * 16;
    return Math.floor(index / 3) * rowHeight;
  };

  return (
    <div className='viz-container'>
      {loading && <Loader />}
      <Search
        items={locations}
        selectionCallBack={selectLocation}
        type={'location'}
        objectKey={'city'}
      />
      <Responsive minWidth={600}>
        <ScrollArea
          id='locations'
          className='overflow-auto'
          style={{ height: 'calc(100% - 33px)' }}
        >
          <div className='w-100 d-flex flex-wrap mt-4'>
            {locations.map((location, index) => {
              if (location.coordinates.lat) {
                return (
                  <Location
                    key={index}
                    index={index}
                    activeIndex={activeIndex}
                    coordinates={location.coordinates}
                    y={() => getYOffset(index)}
                    zoom={location.zoom}
                    country={location.country.name}
                    city={location.city}
                    callbackClick={selectLocation}
                    selected={
                      context.selected ? context.selected.map(s => s.value) : []
                    }
                    setActiveIndex={setActiveIndex}
                  />
                );
              }
            })}
          </div>
        </ScrollArea>
      </Responsive>
    </div>
  );
};

export default ScrollToHOC(withRouter(Locations));
