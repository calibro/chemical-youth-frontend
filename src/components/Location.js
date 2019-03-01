import React from 'react';

const Location = ({
  coordinates,
  zoom,
  country,
  city,
  callbackClick,
  selected
}) => {
  return (
    <div
      className={`location-block ${
        selected.indexOf(city) > -1 ? 'active' : ''
      }`}
      style={{
        backgroundImage: `url(https://api.mapbox.com/styles/v1/gabrielecolombo/cjsnc1pt701yf1fmoasvam9wv/static/${
          coordinates.lng
        },${
          coordinates.lat
        },${zoom},0,0/600x600?access_token=pk.eyJ1IjoiZ2FicmllbGVjb2xvbWJvIiwiYSI6ImNpdGZqNWY1MjAwZWUyeW1qbDhkZHV2OXMifQ.Nem-UVIW-71T6yQQvjrtog)`
      }}
      onClick={() => callbackClick('location', city)}
    >
      <div className='location-country'>{country}</div>
      <div className='location-city'>{city}</div>
    </div>
  );
};

export default Location;
