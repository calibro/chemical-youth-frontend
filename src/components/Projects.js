import React, { useState, useEffect, useContext } from 'react';
import sanityClient from '../lib/sanity';
import Project from './Project';
import { AppContext } from '../appContext';
import { difference } from 'lodash';

const query = `*[_type == "project"]{
  _id, title, body, slug,
  "chemicals": chemicals[]->,
  "topics": topics[]->,
  "place": place[]->,
  "countries": place[]->country[]->,
  "researchers": researchers[]->,
  "methodologies": methodologies[]->,
}`;

function arrayContainsArray(superset, subset) {
  if (0 === subset.length) {
    return false;
  }
  return subset.every(function(value) {
    return superset.indexOf(value) >= 0;
  });
}

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
    const selectedFilters = context.selected.map(v => v.value);
    console.log('selectedFilters', selectedFilters);
    if (selectedFilters.length > 0) {
      if (context.section === 'location') {
        console.log(project);
        if (project.place && project.place.length > 0) {
          const places = project.place.map(m => m.city.toLowerCase());
          console.log(places);
          return arrayContainsArray(places, selectedFilters);
        } else {
          return false;
        }
      } else if (context.section === 'topic') {
        if (project.topics && project.topics.length > 0) {
          return project.topics && project.topics.length > 0
            ? project.topics.find(p => {
                return p.name === selectedFilters;
              })
              ? true
              : false
            : false;
        } else {
          return false;
        }
      } else if (context.section === 'chemical') {
        if (project.chemicals && project.chemicals.length > 0) {
          return project.chemicals && project.chemicals.length > 0
            ? project.chemicals.find(p => {
                return p.name === selectedFilters;
              })
              ? true
              : false
            : false;
        } else {
          return false;
        }
      } else if (context.section === 'method') {
        if (project.methodologies && project.methodologies.length > 0) {
          const methodologies = project.methodologies.map(m => m.name);
          return arrayContainsArray(methodologies, selectedFilters);
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  }

  const toggleSelected = (type, value) => {
    context.toggleSelected({ type: type, value: value });
    //history.push(`/${type}/${value}`);
  };

  return (
    <div className='w-100 h-100 d-flex flex-column p-4'>
      <div className='w-100 d-flex py-3'>
        {projects.filter(project => filter(project)).length}/ 63 PROJECTS SHOWN
      </div>
      {
        <div className='w-100 d-flex py-3 flex-wrap'>
          {context.selected.map((el, index) => {
            return (
              <div className='tag'>
                <div className='p-2'>{el.value}</div>
                <div
                  className='p-2 cursor-pointer'
                  onClick={() => toggleSelected(el.type, el.value)}
                >
                  X
                </div>
              </div>
            );
          })}
        </div>
      }
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
