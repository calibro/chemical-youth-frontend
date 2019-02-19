import React, { useState, useEffect, useContext } from 'react';
import sanityClient from '../lib/sanity';
import Project from './Project';
import { AppContext } from '../appContext';

const query = `*[_type == "project"]{
  _id, title, body, slug,
  "chemicals": chemicals[]->,
  "topics": topics[]->,
  "place": place[]->,
  "countries": place[]->country[]->,
  "researchers": researchers[]->
}`;

const Projects = ({}) => {
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
  }, [context]);

  function handleStatusChange(res) {
    setProjects(res);
  }

  function filter(project) {
    const selectedFilter = context.selected.value;
    console.log('selectedFilter', selectedFilter);
    //console.log(context.section);
    if (context.section === 'location') {
      if (selectedFilter) {
        if (project.place && project.place.length > 0) {
          return project.place && project.place.length > 0
            ? project.place.find(p => {
                console.log(p.city);
                return p.city.toLowerCase() === selectedFilter;
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
    } else if (context.section === 'topic') {
      if (selectedFilter) {
        if (project.topics && project.topics.length > 0) {
          return project.topics && project.topics.length > 0
            ? project.topics.find(p => {
                return p.name === selectedFilter;
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
    } else if (context.section === 'chemical') {
      if (selectedFilter) {
        if (project.chemicals && project.chemicals.length > 0) {
          return project.chemicals && project.chemicals.length > 0
            ? project.chemicals.find(p => {
                return p.name === selectedFilter;
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
  }

  return (
    <div className='w-100 h-100 d-flex flex-column p-4'>
      <div className='w-100 d-flex py-3'>
        {projects.filter(project => filter(project)).length}/ 63 PROJECTS SHOWN
      </div>
      {/* <div className='w-100 d-flex py-3'>
        {projects
          .filter(project => filter(project))
          .map((project, index) => {
            return <Project project={project} key={index} />;
          })}
      </div> */}
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
