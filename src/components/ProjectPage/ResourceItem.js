import React from "react";
import BlockContent from "@sanity/block-content-to-react";
import styles from "./ProjectPage.module.css";

const ResourceItem = ({ resource, category, url, toggleModal }) => {
  return !resource.private ? (
    <span className={styles["resource-item"]} onClick={toggleModal}>
      <span className={styles["resource-category"]}>{`[${category}]`}</span>
      <BlockContent
        blocks={resource.name}
        className={styles["resource-container"]}
        renderContainerOnSingleChild={true}
      />
    </span>
  ) : (
    <a
      href={url}
      download
      target="_blank"
      rel="noopener noreferrer"
      className={styles["resource-item"]}
    >
      <span className={styles["resource-category"]}>{`[${category}]`}</span>
      <BlockContent
        blocks={resource.name}
        className={styles["resource-container"]}
        renderContainerOnSingleChild={true}
      />
    </a>
  );
};

export default ResourceItem;
