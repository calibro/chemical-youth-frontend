import React from 'react';
import { Link } from 'react-router-dom';

const Project = ({ project, countries }) => {
  return (
    <Link to={`/projects/${project.slug ? project.slug.current : ''}`}>
      <div className='project'>
        <div className='project-title'> {project.title} </div>
        <div className='project-researchers'>
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
        <div className='project-body'>
          {project.body &&
            project.body[0] &&
            project.body[0].children[0].text.slice(0, 200) + '...'}
        </div>
        <div className='project-country-label'>
          {countries &&
            countries.map((country, index) => {
              return (
                <span
                  key={index}
                  className={`py-1 ${index === 0 ? 'pr-1' : 'px-1'}`}
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
