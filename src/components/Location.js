import React from "react";

const Location = ({
  coordinates,
  zoom,
  country,
  city,
  callbackClick,
  selected,
  setActiveIndex,
  activeIndex,
  index
}) => {
  return (
    <div
      className={`location-block overflow-hidden ${
        selected.indexOf(city) > -1 || activeIndex === index ? "active" : ""
      }`}
      onClick={() => callbackClick("location", city)}
      onMouseEnter={() => setActiveIndex(index)}
      onMouseLeave={() => setActiveIndex(null)}
    >
      <div
        className="location-map"
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          backgroundImage: `url(https://api.mapbox.com/styles/v1/gabrielecolombo/cjsnc1pt701yf1fmoasvam9wv/static/${
            coordinates.lng
          },${
            coordinates.lat
          },${zoom},0,0/600x600?access_token=pk.eyJ1IjoiZ2FicmllbGVjb2xvbWJvIiwiYSI6ImNpdGZqNWY1MjAwZWUyeW1qbDhkZHV2OXMifQ.Nem-UVIW-71T6yQQvjrtog)`
        }}
      />
      <div className="location-text">
        <div className="location-country">{country}</div>
        <div className={`location-city`}>{city}</div>
      </div>
    </div>
  );
};

export default Location;
