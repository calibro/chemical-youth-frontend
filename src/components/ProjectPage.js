import React, { useState, useEffect } from 'react';
import sanityClient from '../lib/sanity';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../appContext';
import Slider from 'react-slick';
import Header from './Header';
import List from './List';

const ProjectPage = ({ history, location }) => {
  const [project, setProject] = useState([]);
  const slug = location.pathname.split('/')[2];
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    const query = `*[_type == "project" && slug.current == "${slug}"]{
      _id, title, body, slug,
      "mainImage": mainImage.asset->url,
      "topics": topics[]->,
      "chemicals": chemical[]->,
      "methods": method[]->,
      "places": place[]->,
      "countries": place[]->country[]->,
      "researchers": researchers[]->,
      "internalResources": internalResources,
      "internalResourcesCategories": internalResources[].category->,
      "internalResourcesFiles": internalResources[].document.asset->,
      "externalResources": externalResources[]->,
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
        <div className='close-icon'> X </div>
        <div className='w-70 p-3'>
          <div className='w-100 py-3'>
            <div className='h4'> {project.title} </div>
            <div className='py-4' style={{ fontSize: '10px' }}>
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
            <div>
              <img src={project.mainImage} width='100%' />
            </div>
            <div className='py-4'>
              <p>
                {project.body &&
                  project.body[0] &&
                  project.body[0].children[0].text}
              </p>
            </div>
          </div>
          <div className='w-100 mb-5'>
            <div className='h6'> RESOURCES </div>
            <div className='w-100'>
              {project.internalResources &&
                project.internalResources.map((el, index) => {
                  console.log(el);
                  return (
                    <div>
                      <a
                        href={project.internalResourcesFiles[index].url}
                        download
                      >
                        {`${
                          project.internalResourcesCategories[index].name
                        } - `}{' '}
                        {el.name[0].children
                          .filter(child => child._type === 'span')
                          .map(span => span.text)
                          .join('')}
                      </a>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className='w-30 p-5'>
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
      <div className='w-100 mb-5'>
        <div className='h6 p-3'> IMAGES </div>
        <div className='' style={{ height: '600px', marginBottom: '100px' }}>
          <Slider {...settings}>
            {project.images &&
              project.images.map((image, index) => {
                return (
                  <div className=''>
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
    </div>
  );
};

export default withRouter(ProjectPage);
