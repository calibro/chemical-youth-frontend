import React, { useState, useEffect, useContext } from "react";
import sanityClient from "../../lib/sanity";
import { AppContext } from "../../appContext";
import Loader from "../Loader";
import bbox from "@turf/bbox";
import { lineString } from "@turf/helpers";
import ReactStreetview from "./ReactStreetView";
import SpecialProjectMap from "./SpecialProjectMap";
import styles from "./SpecialProject.module.css";

const query = `*[_type == "specialProject1"]{
  _id, name, coordinates, stringCoordinates, streetviewUrl, streetviewCoordinates, streetviewHead, streetviewPitch, streetviewZoom,
  "images": images[].asset->url,
}`;

const SpecialProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bounds, setBounds] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(9);
  const context = useContext(AppContext);
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
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
  }, [context]);

  const handleStatusChange = res => {
    setProjects(res);
    setLoading(false);

    const coordinates = res.map(p => {
      return [p.coordinates.lng, p.coordinates.lat];
    });
    const line = lineString(coordinates);
    const bounds = bbox(line);
    setBounds(bounds);
  };

  const googleMapsApiKey = "AIzaSyDQsgQX8xc6_AiLmbwhZrdpELQJC8rlrII";

  const activeProject =
    projects && projects[selectedIndex] ? projects[selectedIndex] : null;

  const streetviewOptions = {
    position: {
      lat:
        activeProject && activeProject.streetviewCoordinates
          ? activeProject.streetviewCoordinates.lat
          : 0,
      lng:
        activeProject && activeProject.streetviewCoordinates
          ? activeProject.streetviewCoordinates.lng
          : 0
    },
    pov: {
      heading:
        activeProject && activeProject.streetviewHead
          ? activeProject.streetviewHead
          : 0,
      pitch:
        activeProject && activeProject.streetviewPitch
          ? activeProject.streetviewPitch
          : 1
    },
    zoom: 1,
    motionTracking: false,
    motionTrackingControl: false,
    linksControl: false,
    panControl: false,
    zoomControl: false,
    addressControl: false,
    fullscreenControl: false,
    enableCloseButton: false,
    disableDefaultUI: true,
    showRoadLabels: false,
    clickToGo: false,
    scrollwheel: false
  };

  return (
    <div className="row no-gutters border-top">
      <div className="col-12 col-md-5">
        <div className="bg-white overflow-auto" style={{ height: "600px" }}>
          <React.Suspense fallback={<Loader top={"0px"} />}>
            {activeProject && activeProject.streetviewHead && (
              <div className="mb-3 w-100">
                <div
                  style={{
                    width: "100%",
                    height: "250px",
                    backgroundColor: "#eeeeee"
                  }}
                >
                  <ReactStreetview
                    apiKey={googleMapsApiKey}
                    streetViewPanoramaOptions={streetviewOptions}
                  />
                </div>
              </div>
            )}
            <div className="px-4">
              <div className={styles.infobox}>
                <div className={styles.projectPageMapTitle}>
                  {projects && projects[selectedIndex]
                    ? projects[selectedIndex].name
                    : ""}
                </div>
                <div>
                  {projects && projects[selectedIndex]
                    ? projects[selectedIndex].stringCoordinates
                    : ""}
                </div>
                <div className={styles.projectPageSectionTitle}>
                  PICTURES TAKEN
                </div>
              </div>
              {projects &&
                projects[selectedIndex] &&
                projects[selectedIndex].images.map((image, index) => {
                  return (
                    <img
                      key={index}
                      className="my-2 img-fluid"
                      src={`${image}`}
                      alt="gallery"
                    />
                  );
                })}
            </div>
          </React.Suspense>
        </div>
      </div>

      <div className="col-12 col-md-7">
        <SpecialProjectMap
          projects={projects}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          bounds={bounds}
        />
      </div>
    </div>
  );
};

export default SpecialProject;
