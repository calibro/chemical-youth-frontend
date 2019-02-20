import React, { useState, useEffect, useContext } from 'react';
import sanityClient from '../lib/sanity';
import { scaleLog } from 'd3-scale';
import { extent } from 'd3-array';
import { groupBy } from 'lodash';
import { AppContext } from '../appContext';

const query = `*[_type == "project"]{
  endDate, startDate
}`;

const heightScale = scaleLog().range([30, 120]);

function monthDiff(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth() + 1;
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

const Times = ({ type }) => {
  const [times, setTimes] = useState([]);
  const context = useContext(AppContext);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    if (times.length === 0) {
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
    } else {
      const [min, max] = extent(times, d => d.relatedProjects);
      heightScale.domain([0, max]);
    }
  }, [type]);

  function handleStatusChange(res) {
    const derivedTimes = res.map((time, index) => {
      time.months = time.endDate
        ? monthDiff(new Date(time.startDate), new Date(time.endDate))
        : 'still running';
      return time;
    });

    const sortedTimes = derivedTimes.sort((a, b) => a.months - b.months);
    const groupedByTimes = Object.values(groupBy(sortedTimes, el => el.months));

    setTimes(groupedByTimes.reverse());
  }

  const selectTime = (type, value) => {
    context.toggleSelected({ type: type, value: value });
    //history.push(`/${type}/${value}`);
  };

  const selected = context.selected.map(s => s.value);

  return (
    <div className='w-100 h-100 d-flex flex-column'>
      <div className='w-100 d-flex p-3' />
      <div className='w-100'>
        {times.map((time, index) => {
          const duration = time[0].months;
          return (
            <div
              className='p-3 d-flex justify-content-between align-items-center'
              key={index}
              style={{
                height: `${heightScale(duration)}px`,
                borderTop: '1px solid #b7b7b7',
                backgroundColor:
                  selected.indexOf(duration) > -1 ? 'black' : 'white',
                color: selected.indexOf(duration) > -1 ? 'white' : 'black'
              }}
              onClick={() => selectTime('time', duration)}
            >
              <span>{`${time.length} projects`}</span>
              <span>{`${
                duration === 'still running'
                  ? 'still running'
                  : duration + ' months'
              }`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Times;
