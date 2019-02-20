import React from 'react';
import { Link } from 'react-router-dom';

const Project = ({ project, countries }) => {
  return (
    <Link to={`/projects/${project.slug ? project.slug.current : ''}`}>
      <div
        className='w-100 py-3'
        style={{
          borderTop: '1px solid #b7b7b7'
        }}
      >
        <div className='h4'> {project.title} </div>
        <div className='h6'>
          {project.researchers &&
            project.researchers.map((researcher, index) => {
              return (
                <span
                  key={index}
                  className={`py-1 ${index === 0 ? 'pr-1' : 'px-1'}`}
                >
                  {researcher.name}
                </span>
              );
            })}
        </div>
        <div>
          <p>
            {project.body &&
              project.body[0] &&
              project.body[0].children[0].text.slice(0, 200) + '...'}
          </p>
        </div>
        <div>
          {countries &&
            countries.map((country, index) => {
              return (
                <span
                  key={index}
                  className={`py-1 ${index === 0 ? 'pr-1' : 'px-1'}`}
                  style={{
                    fontSize: '10px'
                  }}
                >
                  {country ? country.name : ''}
                </span>
              );
            })}
        </div>
      </div>
    </Link>
  );
};

export default Project;
