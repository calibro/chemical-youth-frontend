import React, { Component, useState, useEffect } from 'react';
import sanityClient from '../lib/sanity';

const query = `*[_type == "project"]`;

const Projects = ({ type }) => {
  const [projects, setProjects] = useState([]);

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
    setProjects(res);
  }

  return (
    <div className='w-100 h-100 d-flex flex-column'>
      <div className='w-100 d-flex p-3'>
        {projects.length} / 63 PROJECTS SHOWN
      </div>
      <div className='w-100 h-100 d-flex flex-column'>
        {projects.map((project, index) => {
          return (
            <div className='p-3' key={index}>
              {project.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
