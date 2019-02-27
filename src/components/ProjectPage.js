import React, { useState, useEffect, useContext } from 'react';
import sanityClient, { builder } from '../lib/sanity';
import { AppContext } from '../appContext';
import BlockContent from '@sanity/block-content-to-react';
import { withRouter } from 'react-router-dom';
import Slider from 'react-slick';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Header from './Header';
import Loader from './Loader';
import ProjectPageSideBar from './ProjectPageSideBar';

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
  const [activeSlide, setActiveSlide] = useState(0);
  const context = useContext(AppContext);

  const slug = location.pathname.split('/')[2];
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    const query = `*[_type == "project" && slug.current == "${slug}"]{
      _id, title, body, slug,
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

  let slider = null;

  const settings = {
    dots: false,
    infinite: true,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    variableWidth: true,
    arrows: false,
    afterChange: current => setActiveSlide(current)
  };

  return (
    <div className='w-100 d-flex flex-column position-relative justify-content-center'>
      <Header expanded={false} />
      <div className='w-100 d-flex flex-wrap container'>
        {loading && <Loader fullheader={false} />}
        <div className='close-icon' onClick={back}>
          X
        </div>
        <div className='w-70' style={{ paddingLeft: '80px' }}>
          <div className='w-100 py-3'>
            <div className='project-page-title'> {project.title} </div>
            <div className='d-flex flex-wrap'>
              {project.researchers &&
                project.researchers.map((researcher, index) => {
                  return (
                    <div
                      key={index}
                      className={`project-page-researcher link`}
                      onClick={() =>
                        changeSection(
                          'researcher',
                          researcher.name.toLowerCase()
                        )
                      }
                    >
                      {researcher.name}
                    </div>
                  );
                })}
            </div>
            {project.mainImage && (
              <div className='mt-4'>
                <img src={`${project.mainImage}?w=1000&fit=max`} width='100%' />
              </div>
            )}
            <div className='py-4 project-page-body'>
              {project.body && project.body[0] && (
                <BlockContent blocks={project.body} serializers={serializers} />
              )}
            </div>
          </div>
          {((project.internalResources && project.internalResources.length) ||
            (project.externalResources &&
              project.externalResources.length)) && (
            <div className='w-100 mb-5'>
              <div className='project-page-section-title'> RESOURCES </div>
              <div className='w-100'>
                {project.internalResources &&
                  project.internalResources.map((el, index) => {
                    if (project.internalResourcesFiles[index]) {
                      return (
                        <div
                          key={index}
                          className='project-page-resource rainbow-line'
                        >
                          {el.private ? (
                            <div
                              onClick={() => toggleModal(true)}
                              className='cursor-pointer'
                            >
                              <BlockContent
                                blocks={el.name}
                                serializers={serializers}
                              />
                            </div>
                          ) : (
                            <a
                              href={project.internalResourcesFiles[index].url}
                              download
                            >
                              <BlockContent
                                blocks={el.name}
                                serializers={serializers}
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
                        <div
                          key={index}
                          className='project-page-resource rainbow-line'
                        >
                          <a href={el.linkUrl} target='_blank' download>
                            <BlockContent
                              blocks={el.name}
                              serializers={serializers}
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
            className='project-page-section-title'
            style={{ paddingLeft: '80px' }}
          >
            IMAGES
          </div>
        )}
        {project.images && (
          <div className='w-100 mb-5' style={{ paddingLeft: '80px' }}>
            <div className='slider'>
              <Slider ref={c => (slider = c)} {...settings}>
                {project.images.map((image, index) => {
                  return (
                    <div className='' key={index}>
                      <img
                        src={`${image}?h=600`}
                        key={index}
                        className='slider-image'
                      />
                    </div>
                  );
                })}
              </Slider>
            </div>
            <div className={'slider-arrows'}>
              <img
                alt='previous image'
                src='/images/arrow-left.svg'
                width={20}
                className='cursor-pointer'
                onClick={() => slider.slickPrev()}
              />
              <div>
                {activeSlide + 1} / {project.images.length}
              </div>
              <img
                alt='next image'
                src='/images/arrow-right.svg'
                width={20}
                className='cursor-pointer'
                onClick={() => slider.slickNext()}
              />
            </div>
          </div>
        )}
      </div>
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
    </div>
  );
};

export default withRouter(ProjectPage);
