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
        selected.indexOf(city.toLowerCase()) > -1 ? 'active' : ''
      }`}
      style={{
        backgroundImage: `url(https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${
          coordinates.lng
        },${
          coordinates.lat
        },${zoom},0,0/600x600?access_token=pk.eyJ1Ijoid2F2ZWZhY3RvcnkiLCJhIjoicVpwemdfYyJ9._y58vUr3LapeG3s1U_sPqQ)`
      }}
      onClick={() => callbackClick('location', city.toLowerCase())}
    >
      <div className='location-country'>{country}</div>
      <div className='location-city'>{city}</div>
    </div>
  );
};

export default Location;
