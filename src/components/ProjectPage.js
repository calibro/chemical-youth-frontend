import React, { useState, useEffect } from 'react';
import sanityClient, { builder } from '../lib/sanity';
import BlockContent from '@sanity/block-content-to-react';
import { withRouter } from 'react-router-dom';
import Slider from 'react-slick';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Header from './Header';
import List from './List';

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
  };

  const SampleNextArrow = props => {
    const { className, style, onClick } = props;
    return <div className={className} style={{ ...style }} onClick={onClick} />;
  };

  const SamplePrevArrow = props => {
    const { className, style, onClick } = props;
    return <div className={className} style={{ ...style }} onClick={onClick} />;
  };

  const back = () => {
    history.goBack();
  };

  const settings = {
    dots: false,
    infinite: true,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    variableWidth: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  return (
    <div className='w-100 d-flex flex-column'>
      <Header expanded={false} />
      <div className='w-100 d-flex flex-wrap'>
        <div className='close-icon' onClick={back}>
          X
        </div>
        <div className='w-70 p-3'>
          <div className='w-100 py-3'>
            <div className='h1'> {project.title} </div>
            <div className='py-2' style={{ fontSize: '10px' }}>
              {project.researchers &&
                project.researchers.map((researcher, index) => {
                  return (
                    <span
                      key={index}
                      className={`py-1 ${index === 0 ? 'pr-1' : 'px-1'}`}
                    >
                      {researcher.name}
                    </span>
                  );
                })}
            </div>
            {project.mainImage && (
              <div>
                <img src={project.mainImage} width='100%' />
              </div>
            )}
            <div className='py-4'>
              {project.body && project.body[0] && (
                <BlockContent blocks={project.body} serializers={serializers} />
              )}
            </div>
          </div>
          {(project.internalResources || project.externalResources) && (
            <div className='w-100 mb-5'>
              <div className='h6'> RESOURCES </div>
              <div className='w-100'>
                {project.internalResources &&
                  project.internalResources.map((el, index) => {
                    if (project.internalResourcesFiles[index]) {
                      return (
                        <div key={index}>
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
                        <div key={index}>
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
        <div className='w-30 p-3 mt-5'>
          <div className='d-flex flex-column my-4'>
            <h4>LOCATIONS</h4>
            <List
              type={'location'}
              elements={project.places}
              objectKey={'city'}
            />
          </div>
          <div className='d-flex flex-column my-4'>
            <h4>CHEMICALS</h4>
            <List type={'chemical'} elements={project.chemicals} />
          </div>
          <div className='d-flex flex-column my-4'>
            <h4>METHODS</h4>
            <List type={'method'} elements={project.methods} />
          </div>
          <div className='d-flex flex-column my-4'>
            <h4>TOPICS</h4>
            <div className='d-flex flex-wrap'>
              <List type={'topic'} elements={project.topics} />
            </div>
          </div>
        </div>
      </div>
      {project.images && (
        <div className='w-100 mb-5'>
          <div className='h6 p-3'> IMAGES </div>
          <div className='' style={{ height: '600px', marginBottom: '100px' }}>
            <Slider {...settings}>
              {project.images.map((image, index) => {
                return (
                  <div className='' key={index}>
                    <img
                      src={image}
                      key={index}
                      style={{ maxHeight: '600px' }}
                    />
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
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
    </div>
  );
};

export default withRouter(ProjectPage);
