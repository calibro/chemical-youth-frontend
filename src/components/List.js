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
    <div className='d-flex flex-wrap justify-content-between'>
      {elements &&
        elements.map((el, index) => {
          if (el) {
            const name = objectKey ? el[objectKey] : el.name;
            return (
              <div
                key={index}
                style={{
                  fontSize: '10px'
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
