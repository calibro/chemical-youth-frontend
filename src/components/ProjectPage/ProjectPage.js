import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import BlockContent from "@sanity/block-content-to-react";
import { Collapse, Modal, ModalHeader, ModalBody } from "reactstrap";
import Disqus from "disqus-react";
import sanityClient from "../../lib/sanity";
import { AppContext } from "../../appContext";
import Header from "../Header";
import Loader from "../Loader";
import ProjectPageSideBar from "../ProjectPageSideBar/";
import Video from "../Video";
import SpecialProject from "../SpecialProject/";
import Carousel from "../Carousel";
import ResourceItem from "./ResourceItem";
import styles from "./ProjectPage.module.css";

// const urlFor = source => {
//   console.log(builder.image(source));
//   return builder.image(source);
// };

const ProjectPage = ({ history, location }) => {
  const [project, setProject] = useState([]);
  const [modal, toggleModal] = useState(false);
  const [collapse, toggleCollapse] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRes, setSelectedRes] = useState();
  const context = useContext(AppContext);

  const slug = location.pathname.split("/")[2];
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    const query = `*[_type == "project" && slug.current == "${slug}"]{
      _id, title, body, slug, videoUrl,credits,
      "mainImage": mainImage.asset->url,
      "topics": topics[]->,
      "chemicals": chemicals[]->,
      "methods": methodologies[]->,
      "places": place[]->,
      "countries": place[]->country[]->,
      "researchers": researchers[]->,
      "internalResources": internalResources,
      "internalResourcesCategories": internalResources[].category->,
      "internalResourcesFiles": internalResources[].document.asset->,
      "externalResources": externalResources,
      "externalResourcesCategories": externalResources[].category->,
      "images": images[].asset->url,
    }`;

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
  }, [slug]);

  const handleStatusChange = res => {
    setProject(res[0]);
    setLoading(false);
  };

  const back = () => {
    if (history.length > 2) {
      history.goBack();
    } else {
      history.push(`/chemical`);
    }
  };

  const changeSection = (type, name) => {
    context.setSelected({ type: type, value: name });
    history.push(`/${type}?selected=${name}`);
  };

  const disqusConfig = {
    url: window.location.href,
    identifier: project._id,
    title: project.title
  };

  const disqusShortname = "chemicalyouth";

  return (
    <React.Fragment>
      <Header expanded={false} />
      <div className="container">
        {loading && <Loader fullheader={false} />}
        <div className="row">
          <div className={`${styles["close-icon-container"]} col-12 col-md-1`}>
            <div className={`${styles["close-icon"]}`} onClick={back}>
              <i className="material-icons">arrow_back</i>
            </div>
          </div>
          <div className="col-12 col-md-11">
            <div className="row">
              <div className="col-12 col-md-9">
                <div className={styles["project-page-title"]}>
                  {project.title}
                </div>
                <div>
                  {project.researchers &&
                    project.researchers.map((researcher, index) => {
                      return (
                        <React.Fragment key={index}>
                          <span
                            className={`${
                              styles["project-page-researcher"]
                            } link py-1 ${index === 0 ? "mr-2" : "mx-2"}`}
                            onClick={() =>
                              changeSection("researcher", researcher.name)
                            }
                          >
                            {researcher.name}
                          </span>
                          <span>
                            {index < project.researchers.length - 1 ? "|" : ""}
                          </span>
                        </React.Fragment>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-9">
                {project.mainImage && (
                  <div className="mt-4">
                    <img
                      src={`${project.mainImage}?w=1000&fit=max`}
                      alt="cover"
                      width="100%"
                    />
                  </div>
                )}
                {project.credits && (
                  <div className={styles.photoCredits}>
                    <span className="text-uppercase">photo credits:</span>{" "}
                    {project.credits}
                  </div>
                )}
                {project.body && project.body[0] && (
                  <BlockContent
                    className={`${styles["project-page-body"]} py-4 `}
                    blocks={project.body}
                    renderContainerOnSingleChild={true}
                  />
                )}
                {(project.internalResources || project.externalResources) &&
                  (project.internalResources.length > 0 ||
                    project.externalResources.length > 0) && (
                    <div className="mb-5">
                      <div
                        className={
                          styles["project-page-section-title-no-padding"]
                        }
                      >
                        {"RESOURCES"}
                      </div>
                      {project.internalResources && (
                        <div className="w-100">
                          {project.internalResources
                            .filter(
                              (el, index) =>
                                project.internalResourcesFiles[index]
                            )
                            .map((el, index) => {
                              return (
                                <div
                                  key={index}
                                  className={styles["project-page-resource"]}
                                  onClick={() => setSelectedRes(el.name)}
                                >
                                  <ResourceItem
                                    resource={el}
                                    category={
                                      project.internalResourcesCategories[index]
                                        .name
                                    }
                                    url={
                                      project.internalResourcesFiles[index].url
                                    }
                                    toggleModal={() => toggleModal(true)}
                                  />
                                </div>
                              );
                            })}
                        </div>
                      )}
                      {project.externalResources && (
                        <div className="w-100">
                          {project.externalResources
                            .filter(el => el.linkUrl)
                            .map((el, index) => {
                              return (
                                <div
                                  key={index}
                                  className={styles["project-page-resource"]}
                                >
                                  <ResourceItem
                                    resource={el}
                                    category={
                                      project.externalResourcesCategories[index]
                                        .name
                                    }
                                    url={el.linkUrl}
                                  />
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  )}
              </div>
              <div className="col-12 col-md-3">
                <ProjectPageSideBar project={project} />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {project.images && (
              <div className={styles["project-page-section-title"]}>
                {"IMAGES"}
              </div>
            )}
            {project.images && <Carousel images={project.images} />}
            {project.videoUrl && (
              <div className="row">
                <div className="col-12 offset-md-1 col-md-8">
                  <Video url={project.videoUrl} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-12 offset-md-1 col-md-8">
            <div
              className={`${
                styles["feedback"]
              } border-top border-bottom d-flex align-items-center justify-content-between`}
              onClick={() => toggleCollapse(!collapse)}
            >
              <span>Give us some feedback</span>
              <span className="d-flex">
                <i className="material-icons">
                  {collapse ? "keyboard_arrow_down" : "keyboard_arrow_right"}
                </i>
              </span>
            </div>
            <Collapse isOpen={collapse} className="mb-3">
              {collapse && (
                <Disqus.DiscussionEmbed
                  shortname={disqusShortname}
                  config={disqusConfig}
                />
              )}
            </Collapse>
          </div>
        </div>
      </div>

      {project.slug &&
        project.slug.current === "mapping-chemicals-in-cagayan-de-oro" && (
          <SpecialProject />
        )}

      <Modal isOpen={modal} toggle={() => toggleModal(!modal)} className={""}>
        <ModalHeader toggle={() => toggleModal(!modal)}>
          This resource is private
        </ModalHeader>
        <ModalBody>
          <p className="font-weight-bold">If you want to access:</p>
          {selectedRes && (
            <BlockContent
              blocks={selectedRes}
              renderContainerOnSingleChild={true}
            />
          )}
          <p className="font-weight-bold">
            send us a message at{" "}
            <a href="mailto:a.p.hardon@uva.nl">
              <u>a.p.hardon@uva.nl</u>
            </a>{" "}
            or{" "}
            <a href="mailto:h.k.murray@uva.nl">
              <u>h.k.murray@uva.nl</u>
            </a>
          </p>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(ProjectPage);
