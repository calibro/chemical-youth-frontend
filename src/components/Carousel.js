import React, { useState } from 'react';
import Slider from 'react-slick';
import Loader from './Loader';

const Carousel = ({ images }) => {
  const [activeSlide, setActiveSlide] = useState(0);

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

  let slider = null;

  return (
    <div className='w-100 mb-5' style={{ paddingLeft: '80px' }}>
      <div className='slider'>
        <Slider ref={c => (slider = c)} {...settings}>
          {images.map((image, index) => {
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
          src='images/arrow-left.svg'
          width={20}
          className='cursor-pointer'
          onClick={() => slider.slickPrev()}
        />
        <div>
          {activeSlide + 1} / {images.length}
        </div>
        <img
          alt='next image'
          src='images/arrow-right.svg'
          width={20}
          className='cursor-pointer'
          onClick={() => slider.slickNext()}
        />
      </div>
    </div>
  );
};

export default Carousel;
