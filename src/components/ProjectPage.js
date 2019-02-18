import React, { useState, useEffect } from 'react';
import Header from './Header';
import List from './List';
import sanityClient from '../lib/sanity';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../appContext';

const ProjectPage = ({ location }) => {
  const [project, setProject] = useState([]);
  const slug = location.pathname.split('/')[2];
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    const query = `*[_type == "project" && slug.current == "${slug}"]{
      _id, title, body, slug,
      "mainImage": mainImage.asset->url,
      "topics": topics[]->,
      "chemicals": chemical[]->,
      "methods": method[]->,
      "places": place[]->,
      "countries": place[]->country[]->,
      "researchers": researchers[]->
    }`;

    sanityClient
      .fetch(query)
      .then(res => {
        console.log(res);
        handleStatusChange(res);
        return () => {
          // Clean up
        };
      })
      .catch(err => {
        console.error(err);
      });
  }, [slug]);

  const handleStatusChange = res => {
    setProject(res[0]);
  };

  return (
    <div className='w-100 h-100 d-flex flex-column'>
      <Header />
      <div className='w-100 d-flex'>
        <div className='w-70 p-3'>
          <div className='w-100 py-3'>
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
              <img src={project.mainImage} width='100%' />
            </div>
            <div className='py-4'>
              <p>{project.body && project.body[0].children[0].text}</p>
            </div>
          </div>
        </div>
        <div className='w-30 p-5'>
          <div className='d-flex flex-column my-4'>
            <h4>LOCATIONS</h4>
            <List elements={project.places} objectKey={'city'} />
          </div>
          <div className='d-flex flex-column my-4'>
            <h4>CHEMICALS</h4>
            <List elements={project.chemicals} />
          </div>
          <div className='d-flex flex-column my-4'>
            <h4>METHODS</h4>
            <List elements={project.methods} />
          </div>
          <div className='d-flex flex-column my-4'>
            <h4>TOPICS</h4>
            <div className='d-flex flex-wrap'>
              <List elements={project.topics} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ProjectPage);
