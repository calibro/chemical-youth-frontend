import React, { useState, useEffect, useContext } from "react";
import sanityClient, { builder } from "../lib/sanity";
import { AppContext } from "../appContext";
import BlockContent from "@sanity/block-content-to-react";
import { withRouter } from "react-router-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Header from "./Header";
import Loader from "./Loader";
import ProjectPageSideBar from "./ProjectPageSideBar";
import Video from "./Video";
import SpecialProject from "./SpecialProject";
import Carousel from "./Carousel";

const serializers = {
  types: {
    code: props => (
      <pre data-language={props.node.language}>
        <code>{props.node.code}</code>
      </pre>
    )
  }
};

const urlFor = source => {
  console.log(builder.image(source));
  return builder.image(source);
};

const ProjectPage = ({ history, location }) => {
  const [project, setProject] = useState([]);
  const [modal, toggleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const context = useContext(AppContext);

  const slug = location.pathname.split("/")[2];
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    const query = `*[_type == "project" && slug.current == "${slug}"]{
      _id, title, body, slug, videoUrl,
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
    setLoading(false);
  };

  const back = () => {
    history.goBack();
  };

  const changeSection = (type, name) => {
    context.setSelected({ type: type, value: name });
    history.push(`/${type}?selected=${name}`);
  };

  return (
    <div className="w-100 d-flex flex-column position-relative justify-content-center">
      <Header expanded={false} />
      <div className="w-100 d-flex flex-wrap container">
        {loading && <Loader fullheader={false} />}
        <div className="close-icon link" onClick={back}>
          Back to home
          <span>
            <img src="images/arrow-right.svg" width="20px" />
          </span>
        </div>
        <div className="w-70" style={{ paddingLeft: "80px" }}>
          <div className="w-100 py-3">
            <div className="project-page-title"> {project.title} </div>
            <div className="d-flex flex-wrap">
              {project.researchers &&
                project.researchers.map((researcher, index) => {
                  return (
                    <React.Fragment key={index}>
                      <div
                        className={`project-page-researcher link py-1 ${
                          index === 0 ? "mr-2" : "mx-2"
                        }`}
                        onClick={() =>
                          changeSection("researcher", researcher.name)
                        }
                      >
                        {researcher.name}
                      </div>
                      <span>
                        {index < project.researchers.length - 1 ? "|" : ""}
                      </span>
                    </React.Fragment>
                  );
                })}
            </div>
            {project.mainImage && (
              <div className="mt-4">
                <img src={`${project.mainImage}?w=1000&fit=max`} width="100%" />
              </div>
            )}
            <div className="py-4 project-page-body">
              {project.body && project.body[0] && (
                <BlockContent blocks={project.body} serializers={serializers} />
              )}
            </div>
          </div>
          {((project.internalResources && project.internalResources.length) ||
            (project.externalResources &&
              project.externalResources.length)) && (
            <div className="w-100 mb-5">
              <div className="project-page-section-title"> RESOURCES </div>
              <div className="w-100">
                {project.internalResources &&
                  project.internalResources.map((el, index) => {
                    if (project.internalResourcesFiles[index]) {
                      return (
                        <div key={index} className="project-page-resource">
                          {el.private ? (
                            <div
                              onClick={() => toggleModal(true)}
                              className="cursor-pointer"
                            >
                              <span className="resource-category">
                                {"["}
                                {
                                  project.internalResourcesCategories[index]
                                    .name
                                }
                                {"]"}
                              </span>
                              <BlockContent
                                blocks={el.name}
                                serializers={serializers}
                                className="resource-container"
                                renderContainerOnSingleChild={true}
                              />
                            </div>
                          ) : (
                            <a
                              href={project.internalResourcesFiles[index].url}
                              download
                            >
                              <span className="resource-category">
                                {"["}
                                {
                                  project.internalResourcesCategories[index]
                                    .name
                                }
                                {"]"}
                              </span>
                              <BlockContent
                                blocks={el.name}
                                serializers={serializers}
                                className="resource-container"
                                renderContainerOnSingleChild={true}
                              />
                            </a>
                          )}
                        </div>
                      );
                    }
                  })}
                {project.externalResources &&
                  project.externalResources.map((el, index) => {
                    if (el.linkUrl) {
                      return (
                        <div key={index} className="project-page-resource">
                          <span className="resource-category">
                            {"["}
                            {project.externalResourcesCategories[index].name}
                            {"]"}
                          </span>
                          <a href={el.linkUrl} target="_blank" download>
                            <BlockContent
                              blocks={el.name}
                              serializers={serializers}
                              className="resource-container"
                              renderContainerOnSingleChild={true}
                            />
                          </a>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          )}
        </div>
        <ProjectPageSideBar project={project} />
        {project.images && (
          <div
            className="project-page-section-title"
            style={{ paddingLeft: "80px" }}
          >
            IMAGES
          </div>
        )}
        {project.images && <Carousel images={project.images} />}
        {project.videoUrl && <Video url={project.videoUrl} />}
      </div>
      <Modal isOpen={modal} toggle={() => toggleModal(!modal)} className={""}>
        <ModalHeader toggle={() => toggleModal(!modal)}>
          This document is private
        </ModalHeader>
        <ModalBody>
          If you want to read this document, send us a message at{" "}
          <a href="mailto:info@info.com">info@info.com</a>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => toggleModal(!modal)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      {project.slug &&
        project.slug.current === "mapping-chemicals-in-cagayan-de-oro" && (
          <SpecialProject />
        )}
    </div>
  );
};

export default withRouter(ProjectPage);
