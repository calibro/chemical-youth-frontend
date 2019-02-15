import React, { useState, useEffect, useContext } from 'react';
import sanityClient from '../lib/sanity';
import Project from './Project';
import { AppContext } from '../appContext';

const query = `*[_type == "project"]{
  _id, title, body,
  "place": place[]->,
  "countries": place[]->country[]->,
  "researchers": researchers[]->
}`;

const Projects = ({ type }) => {
  const [projects, setProjects] = useState([]);
  const context = useContext(AppContext);
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

  function filter(project) {
    if (context.selectedLocation) {
      if (project.place && project.place.length > 0) {
        return project.place && project.place.length > 0
          ? project.place.find(p => {
              return p.city === context.selectedLocation;
            })
            ? true
            : false
          : false;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  return (
    <div className='w-100 h-100 d-flex flex-column p-4'>
      <div className='w-100 d-flex py-3'>
        {projects.filter(project => filter(project)).length}/ 63 PROJECTS SHOWN
      </div>
      <div className='w-100 h-100 d-flex flex-column'>
        {projects
          .filter(project => filter(project))
          .map((project, index) => {
            return <Project project={project} key={index} />;
          })}
      </div>
    </div>
  );
};

export default Projects;
