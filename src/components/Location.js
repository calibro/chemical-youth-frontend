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
      className='d-flex justify-content-center align-items-center flex-column'
      style={{
        backgroundImage: `url(https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${
          coordinates.lng
        },${
          coordinates.lat
        },${zoom},0,0/600x600?access_token=pk.eyJ1Ijoid2F2ZWZhY3RvcnkiLCJhIjoicVpwemdfYyJ9._y58vUr3LapeG3s1U_sPqQ)`,
        width: '16.2vw',
        height: '16.2vw',
        border:
          selected.indexOf(city.toLowerCase()) > -1 ? '2px solid black' : 'none'
      }}
      onClick={() => callbackClick('location', city.toLowerCase())}
    >
      <div className='p-2'>{country}</div>
      <div className='p-2'>{city}</div>
    </div>
  );
};

export default Location;
