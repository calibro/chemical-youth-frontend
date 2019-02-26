import React, { useState, useEffect, useContext } from 'react';
import sanityClient, { builder } from '../lib/sanity';
import { AppContext } from '../appContext';
import BlockContent from '@sanity/block-content-to-react';
import { withRouter } from 'react-router-dom';
import Slider from 'react-slick';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Header from './Header';
import List from './List';
import Loader from './Loader';

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
                      className={`project-page-researcher link py-1 ${
                        index === 0 ? 'pr-2' : 'px-2'
                      }`}
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
          {(project.internalResources || project.externalResources) && (
            <div className='w-100 mb-5'>
              <div className='project-page-section-title'> RESOURCES </div>
              <div className='w-100'>
                {project.internalResources &&
                  project.internalResources.map((el, index) => {
                    if (project.internalResourcesFiles[index]) {
                      return (
                        <div key={index} className='project-page-resource'>
                          {el.private ? (
                            <div onClick={() => toggleModal(true)} className=''>
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
                        <div key={index} className='project-page-resource'>
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
        <div
          className='w-30 mt-5 d-flex flex-column'
          style={{ paddingLeft: '80px' }}
        >
          <div className='d-flex flex-column my-4'>
            <div className='list-title'>LOCATIONS</div>
            <List
              type={'location'}
              elements={project.places}
              objectKey={'city'}
            />
          </div>
          <div className='d-flex flex-column my-4'>
            <div className='list-title'>CHEMICALS</div>
            <List type={'chemical'} elements={project.chemicals} />
          </div>
          <div className='d-flex flex-column my-4'>
            <div className='list-title'>METHODS</div>
            <List type={'method'} elements={project.methods} />
          </div>
          <div className='d-flex flex-column my-4'>
            <div className='list-title'>TOPICS</div>
            <div className='d-flex flex-wrap'>
              <List type={'topic'} elements={project.topics} />
            </div>
          </div>
        </div>
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
            <div className='' style={{ height: '600px', marginBottom: '50px' }}>
              <Slider ref={c => (slider = c)} {...settings}>
                {project.images.map((image, index) => {
                  return (
                    <div className='' key={index}>
                      <img
                        src={`${image}?h=600&fit=max`}
                        key={index}
                        style={{ maxHeight: '600px' }}
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
                onClick={() => slider.slickPrevious()}
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
