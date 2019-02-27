import React from 'react';
import List from './List';

const ProjectPageSideBar = ({ project }) => {
  return (
    <div
      className='w-30 mt-5 d-flex flex-column'
      style={{ paddingLeft: '80px' }}
    >
      <div className='d-flex flex-column my-4'>
        <div className='list-title'>LOCATIONS</div>
        <List type={'location'} elements={project.places} objectKey={'city'} />
      </div>
      <div className='d-flex flex-column my-4'>
        <div className='list-title'>CHEMICALS</div>
        <List type={'chemical'} elements={project.chemicals} />
      </div>
      <div className='d-flex flex-column my-4'>
        <div className='list-title'>METHODS</div>
        <List type={'method'} elements={project.methods} />
      </div>
      <div className='d-flex flex-column my-4'>
        <div className='list-title'>TOPICS</div>
        <div className='d-flex flex-wrap'>
          <List type={'topic'} elements={project.topics} />
        </div>
      </div>
    </div>
  );
};

export default ProjectPageSideBar;
