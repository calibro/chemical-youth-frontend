import React, { useState } from "react";
import Slider from "react-slick";
import { withGetScreen } from "react-getscreen";
import Loader from "../Loader";
import "./Carousel.css";
import styles from "./Carousel.module.css";

const Carousel = ({ images, isTablet, isMobile }) => {
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
  console.log(isMobile());
  const height = isMobile() ? 300 : 600;

  return (
    <div className={styles["carousel"]}>
      <div
        className={`${isMobile() ? styles["slider-half"] : styles["slider"]}`}
      >
        <Slider ref={c => (slider = c)} {...settings}>
          {images.map((image, index) => {
            return (
              <div className="" key={index}>
                <img
                  alt="gallery"
                  src={`${image}?h=${height}`}
                  key={index}
                  className={styles["slider-image"]}
                />
              </div>
            );
          })}
        </Slider>
      </div>
      <div className={styles["slider-arrows"]}>
        <img
          alt="previous"
          src="images/arrow-left.svg"
          width={20}
          className="cursor-pointer"
          onClick={() => slider.slickPrev()}
        />
        <div>
          {activeSlide + 1} / {images.length}
        </div>
        <img
          alt="next"
          src="images/arrow-right.svg"
          width={20}
          className="cursor-pointer"
          onClick={() => slider.slickNext()}
        />
      </div>
    </div>
  );
};

export default withGetScreen(Carousel);
