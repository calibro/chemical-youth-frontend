import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../appContext';

const Project = ({ type, elements, objectKey, history }) => {
  const context = useContext(AppContext);

  const changeSection = (type, name) => {
    context.setSelected({ type: type, value: name });
    history.push(`/${type}?selected=${name}`);
  };

  return (
    <div className='d-flex flex-wrap'>
      {elements ? (
        elements.map((el, index) => {
          if (el) {
            const name = objectKey ? el[objectKey] : el.name;
            return (
              <div
                className='mr-3 link'
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
        })
      ) : (
        <div>Not found</div>
      )}
    </div>
  );
};

export default withRouter(Project);
