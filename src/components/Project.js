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
                <React.Fragment key={index}>
                  <span className={`py-1 ${index === 0 ? 'pr-1' : 'px-1'}`}>
                    {researcher.name}
                  </span>
                  {index < project.researchers.length - 1 ? <span>|</span> : ''}
                </React.Fragment>
              );
            })}
        </div>
        <div className='project-body'>
          {project.body &&
            project.body[0] &&
            project.body[0].children[0].text.slice(0, 250) + '...'}
        </div>
        <div className='project-country-labels'>
          <img
            src='images/earth.svg'
            width={11}
            style={{ opacity: 0.5, marginRight: '5px' }}
          />
          {countries &&
            countries.map((country, index) => {
              return (
                <div
                  key={index}
                  className={`project-country-label py-1 ${
                    index === 0 ? 'pr-1' : 'px-1'
                  }`}
                >
                  {country ? country.name : ''}
                </div>
              );
            })}
          {!countries.length && (
            <div className={`project-country-label py-1 pr-1`}>
              {project.place ? project.place[0].city : ''}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Project;
