import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { AppContext } from '../appContext';

const Project = ({ type, elements, objectKey, history }) => {
  const context = useContext(AppContext);

  const changeSection = (type, name) => {
    context.setSection(type);
    history.push(`/${type}/${name}`);
  };

  return (
    <div className='d-flex flex-wrap'>
      {elements &&
        elements.map((el, index) => {
          if (el) {
            const name = objectKey ? el[objectKey] : el.name;
            return (
              <div
                className='pr-3'
                key={index}
                style={{
                  fontSize: '12px'
                }}
              >
                <div onClick={() => changeSection(type, name.toLowerCase())}>
                  {name}
                </div>
              </div>
            );
          }
        })}
    </div>
  );
};

export default withRouter(Project);
