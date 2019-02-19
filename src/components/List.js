import React from 'react';

const Project = ({ elements, objectKey }) => {
  return (
    <div className='d-flex flex-wrap justify-content-between'>
      {elements &&
        elements.map((el, index) => {
          console.log(objectKey);
          return (
            <div
              key={index}
              style={{
                fontSize: '10px'
              }}
            >
              {el ? (objectKey ? el[objectKey] : el.name) : ''}
            </div>
          );
        })}
    </div>
  );
};

export default Project;
