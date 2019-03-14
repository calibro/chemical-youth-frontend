import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { AppContext } from "../../appContext";
import styles from "./ProjectPageSideBar.module.css";

const Project = ({ type, elements, objectKey, history }) => {
  const context = useContext(AppContext);

  const changeSection = (type, name) => {
    context.setSelected({ type: type, value: name });
    history.push(`/${type}?selected=${name}`);
  };

  return (
    <div className="d-flex flex-wrap">
      {elements ? (
        elements.map((el, index) => {
          const name = objectKey ? el[objectKey] : el.name;
          return (
            <React.Fragment key={index}>
              <div className={`${styles["list-el"]} mr-1 link`}>
                <div onClick={() => changeSection(type, name)}>{name}</div>
              </div>
              <span className={`${styles["list-el"]} mr-1`}>
                {index < elements.length - 1 ? "|" : ""}
              </span>
            </React.Fragment>
          );
        })
      ) : (
        <div className={`${styles["list-el"]} mr-1`}>Not found</div>
      )}
    </div>
  );
};

export default withRouter(Project);
