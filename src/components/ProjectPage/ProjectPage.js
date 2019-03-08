import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import BlockContent from '@sanity/block-content-to-react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import sanityClient, { builder } from '../../lib/sanity';
import { AppContext } from '../../appContext';
import Header from '../Header';
import Loader from '../Loader';
import ProjectPageSideBar from './ProjectPageSideBar';
import Video from '../Video';
import SpecialProject from '../SpecialProject/';
import Carousel from '../Carousel';
import ResourceItem from './ResourceItem';
import styles from './ProjectPage.module.css';

const urlFor = source => {
  console.log(builder.image(source));
  return builder.image(source);
};

const ProjectPage = ({ history, location }) => {
  const [project, setProject] = useState([]);
  const [modal, toggleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const context = useContext(AppContext);

  const slug = location.pathname.split('/')[2];
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

  console.log(history);

  return (
    <React.Fragment>
      <Header expanded={false} />
      <div className='container'>
        {loading && <Loader fullheader={false} />}
        {/*    <div className="close-icon link" onClick={back}>
          <span>
            <img src="/images/arrow-left.svg" width="20px" />
          </span>
          Back to home
        </div>*/}
        <div className='row'>
          <div className='col-12 col-md-9'>
            <div className={styles['project-page-title']}>{project.title}</div>
            <div>
              {project.researchers &&
                project.researchers.map((researcher, index) => {
                  return (
                    <React.Fragment key={index}>
                      <span
                        className={`${
                          styles['project-page-researcher']
                        } link py-1 ${index === 0 ? 'mr-2' : 'mx-2'}`}
                        onClick={() =>
                          changeSection('researcher', researcher.name)
                        }
                      >
                        {researcher.name}
                      </span>
                      <span>
                        {index < project.researchers.length - 1 ? '|' : ''}
                      </span>
                    </React.Fragment>
                  );
                })}
            </div>
            {project.mainImage && (
              <div className='mt-4'>
                <img
                  src={`${project.mainImage}?w=1000&fit=max`}
                  alt='cover'
                  width='100%'
                />
              </div>
            )}
            {project.body && project.body[0] && (
              <BlockContent
                className={`${styles['project-page-body']} py-4 `}
                blocks={project.body}
                renderContainerOnSingleChild={true}
              />
            )}
            <div className='mb-5'>
              {(project.internalResources || project.externalResources) &&
                (project.internalResources.length > 0 ||
                  project.externalResources.length > 0) && (
                  <div
                    className={styles['project-page-section-title-no-padding']}
                  >
                    {'RESOURCES'}
                  </div>
                )}
              {project.internalResources && (
                <div className='w-100'>
                  {project.internalResources.map((el, index) => {
                    if (project.internalResourcesFiles[index]) {
                      return (
                        <div
                          key={index}
                          className={styles['project-page-resource']}
                        >
                          <ResourceItem
                            resource={el}
                            category={
                              project.internalResourcesCategories[index].name
                            }
                            url={project.internalResourcesFiles[index].url}
                            toggleModal={() => toggleModal(true)}
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              )}
              {project.externalResources && (
                <div className='w-100'>
                  {project.externalResources.map((el, index) => {
                    if (el.linkUrl) {
                      return (
                        <div
                          key={index}
                          className={styles['project-page-resource']}
                        >
                          <ResourceItem
                            resource={el}
                            category={
                              project.externalResourcesCategories[index].name
                            }
                            url={el.linkUrl}
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>
          <div className='col-12 col-md-3'>
            <ProjectPageSideBar project={project} />
          </div>
        </div>
        {project.images && (
          <div className={styles['project-page-section-title']}>{'IMAGES'}</div>
        )}
        <div className='row'>
          <div className='col-12'>
            {project.images && <Carousel images={project.images} />}
            {project.videoUrl && <Video url={project.videoUrl} />}
          </div>
        </div>
      </div>

      {project.slug &&
        project.slug.current === 'mapping-chemicals-in-cagayan-de-oro' && (
          <SpecialProject />
        )}

      <Modal isOpen={modal} toggle={() => toggleModal(!modal)} className={''}>
        <ModalHeader toggle={() => toggleModal(!modal)}>
          This document is private
        </ModalHeader>
        <ModalBody>
          If you want to read this document, send us a message at{' '}
          <a href='mailto:info@info.com'>info@info.com</a>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={() => toggleModal(!modal)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(ProjectPage);
