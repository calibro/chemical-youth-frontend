import React, { useEffect, useContext } from "react";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import Loader from "../Loader";
import Header from "../Header";
import { AppContext } from "../../appContext";
import styles from "./Credits.module.css";

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiY2hlbWljYWx5b3V0aCIsImEiOiJjanQ0ZmxxM2kxNDJoM3pwcXkwb2s0ZDA2In0.dKH9M8M6LzNWqS7jr0RGWg",
  scrollZoom: false,
  interactive: false
});

const Credits = () => {
  const context = useContext(AppContext);

  useEffect(() => {
    context.setSection("credits");
  });

  return (
    <React.Suspense fallback={<Loader />}>
      <Header />
      <div className={styles.creditsContainer}>
        <div className="container flex-grow-1 flex-shrink-1">
          <div className="row h-100 align-items-center">
            <div className="col-12 col-lg-4">
              <h6>PRINCIPAL INVESTIGATOR</h6>
              <p>Anita Hardon</p>
              <p>
                <a href="mailto:a.p.hardon@uva.nl">a.p.hardon@uva.nl</a>
              </p>
            </div>
            <div className="col-12 col-lg-4">
              <h6>PROJECT MANAGER</h6>
              <p>Hayley Murray</p>
              <p>
                <a href="mailto:chemicalyouth@gmail.com">
                  chemicalyouth@gmail.com
                </a>
              </p>
            </div>
            <div className="col-12 col-lg-4">
              <h6>ADDRESS</h6>
              <p>University of Amsterdam</p>
              <p>Nieuwe Achtergracht 166</p>
            </div>
          </div>
        </div>
        <div className={styles.mapContainer}>
          <Map
            style="mapbox://styles/chemicalyouth/cjt9wxcnt0l9l1foa8ernfby3"
            containerStyle={{
              height: "100%",
              width: "100%"
            }}
            zoom={[15]}
            center={[4.9106606, 52.3630454]}
          >
            <Layer type="circle" id="marker" paint={{ "circle-radius": 10 }}>
              <Feature coordinates={[4.9106606, 52.3630454]} />
            </Layer>
          </Map>
        </div>
      </div>
    </React.Suspense>
  );
};

export default Credits;
