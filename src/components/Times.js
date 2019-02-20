import React, { useState, useEffect } from 'react';
import sanityClient from '../lib/sanity';

const query = `*[_type == "project"]{
  endDate, startDate
}`;

function monthDiff(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth() + 1;
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

const Times = ({ type }) => {
  const [times, setTimes] = useState([]);

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
    console.log(res);
    setTimes(res);
  }

  return (
    <div className='w-100 h-100 d-flex flex-column'>
      <div className='w-100 d-flex p-3' />
      <div className='w-100 h-100 d-flex flex-column'>
        {times
          .map((time, index) => {
            time.months = time.endDate
              ? monthDiff(new Date(time.startDate), new Date(time.endDate))
              : 'still running';
            return time;
          })
          .sort((a, b) => b.months - a.months)
          .map((time, index) => {
            return (
              <div className='p-3' key={index}>
                {<span>{time.months}</span>}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Times;
