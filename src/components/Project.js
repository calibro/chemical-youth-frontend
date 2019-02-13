import React from 'react';

const Project = ({ project }) => {
  return (
    <div className='w-100 p-3' style={{ borderTop: '1px solid #b7b7b7' }}>
      <div>{project.title}</div>
      <div>
        {project.researchers &&
          project.researchers.map((researcher, index) => {
            return (
              <span key={index} className='p-1'>
                {researcher.name}
              </span>
            );
          })}
      </div>
      <div>
        <p>
          {project.body &&
            project.body[0].children[0].text.slice(0, 200) + '...'}
        </p>
      </div>
      <div>
        {project.countries &&
          project.countries.map((country, index) => {
            return (
              <span key={index} className='p-1' style={{ fontSize: '10px' }}>
                {country ? country.name : ''}
              </span>
            );
          })}
      </div>
    </div>
  );
};

export default Project;
