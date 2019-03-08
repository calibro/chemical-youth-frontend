import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../../appContext';

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
              <React.Fragment key={index}>
                <div className='mr-1 link list-el'>
                  <div onClick={() => changeSection(type, name)}>{name}</div>
                </div>
                <span className='mr-1 list-el'>
                  {index < elements.length - 1 ? '|' : ''}
                </span>
              </React.Fragment>
            );
          }
        })
      ) : (
        <div className='mr-1 list-el'>Not found</div>
      )}
    </div>
  );
};

export default withRouter(Project);
