import React from "react";
import List from "./List";
import styles from "./ProjectPageSideBar.module.css";

const ProjectPageSideBar = ({ project }) => {
  return (
    <div className={`${styles["right-column"]} my-4`}>
      <div className="mb-4">
        <div className={styles["list-title"]}>LOCATIONS</div>
        <List type={"location"} elements={project.places} objectKey={"city"} />
      </div>
      <div className="mb-4">
        <div className={styles["list-title"]}>CHEMICALS</div>
        <List type={"chemical"} elements={project.chemicals} />
      </div>
      <div className="mb-4">
        <div className={styles["list-title"]}>METHODS</div>
        <List type={"method"} elements={project.methods} />
      </div>
      <div>
        <div className={styles["list-title"]}>TOPICS</div>
        <div className="d-flex flex-wrap">
          <List type={"topic"} elements={project.topics} />
        </div>
      </div>
    </div>
  );
};

export default ProjectPageSideBar;
