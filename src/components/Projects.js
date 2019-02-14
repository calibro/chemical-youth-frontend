import React, { Component, useState, useEffect } from 'react';
import sanityClient from '../lib/sanity';
import Project from './Project';

const query = `*[_type == "project"]{
  _id, title, body, 
  "countries": place[]->country[]->,
  "researchers": researchers[]->
}`;

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
    <div className='w-100 h-100 d-flex flex-column p-4'>
      <div className='w-100 d-flex py-3'>
        {projects.length} / 63 PROJECTS SHOWN
      </div>
      <div className='w-100 h-100 d-flex flex-column'>
        {projects.map((project, index) => {
          return <Project project={project} key={index} />;
        })}
      </div>
    </div>
  );
};

export default Projects;
