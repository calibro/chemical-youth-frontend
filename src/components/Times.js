import React, { useState, useEffect, useContext } from 'react';
import sanityClient from '../lib/sanity';
import { scaleOrdinal } from 'd3-scale';
import { extent } from 'd3-array';
import { groupBy } from 'lodash';
import { AppContext } from '../appContext';
import { timeLabels, quantizeTime } from '../timeUtils';

const query = `*[_type == "project"]{
  endDate, startDate
}`;

const monthDiff = (d1, d2) => {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth() + 1;
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

const Times = ({ type }) => {
  const [times, setTimes] = useState([]);
  const [derivedTimes, setDerivedTimes] = useState([]);
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
    }
  }, [type]);

  const handleStatusChange = res => {
    const derivedTimes = res.map((time, index) => {
      const diff = monthDiff(new Date(time.startDate), new Date(time.endDate));
      time.months = quantizeTime(diff);
      console.log(quantizeTime(diff));
      return time;
    });
    setDerivedTimes(derivedTimes);

    const sortedTimes = derivedTimes.sort((a, b) => a.months - b.months);
    const groupedByTimes = Object.values(groupBy(sortedTimes, el => el.months));

    setTimes(groupedByTimes.reverse());
  };

  const selectTime = (type, value) => {
    console.log(type, value);
    context.toggleSelected({ type: type, value: value });
    //history.push(`/${type}/${value}`);
  };

  const selected = context.selected.map(s => s.value);

  const [min, max] = extent(derivedTimes, d => d.months);
  const heightScale = scaleOrdinal()
    .range([30, 60, 90, 120, 150, 180, 210])
    .domain([0, 3, 6, 12, 24, 36, 48]);

  return (
    <div className='w-100 h-100 d-flex flex-column'>
      <div className='w-100 d-flex p-3' />
      <div className='w-100'>
        {times.map((time, index) => {
          const duration = time[0].months;
          return (
            <div
              className='px-3 d-flex justify-content-between align-items-center'
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
              <div>{`${time.length} projects`}</div>
              <div>{`${timeLabels[duration]}`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Times;
