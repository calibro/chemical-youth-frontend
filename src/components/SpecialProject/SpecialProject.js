import React, { useState, useEffect, useContext } from 'react';
import sanityClient from '../../lib/sanity';
import { AppContext } from '../../appContext';
import Loader from '../Loader';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import bbox from '@turf/bbox';
import { lineString } from '@turf/helpers';
import ReactStreetview from './ReactStreetView';
import SpecialProjectMap from './SpecialProjectMap';
import styles from './SpecialProject.module.css';

const query = `*[_type == "specialProject1"]{
  _id, name, coordinates, stringCoordinates, streetviewUrl, streetviewCoordinates, streetviewHead, streetviewPitch, streetviewZoom,
  "images": images[].asset->url,
}`;

const radiusScale = scaleLinear().range([0, 30]);

const SpecialProject = ({}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bounds, setBounds] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
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
    const [min, max] = extent(res, d => d.images.length);
    radiusScale.domain([0, max]);
    setLoading(false);

    const coordinates = res.map(p => {
      return [p.coordinates.lng, p.coordinates.lat];
    });
    const line = lineString(coordinates);
    const bounds = bbox(line);
    setBounds(bounds);
  };

  const googleMapsApiKey = 'AIzaSyDQsgQX8xc6_AiLmbwhZrdpELQJC8rlrII';

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
    <div className='w-100 d-flex mt-5' style={{ height: '600px' }}>
      <div
        className='w-40 bg-white overflow-auto d-flex flex-column align-items-center position-relative'
        style={{ height: '600px' }}
      >
        <React.Suspense fallback={<Loader top={'0px'} />}>
          {activeProject && activeProject.streetviewHead && (
            <div className='mb-3 w-100'>
              <div
                style={{
                  width: '100%',
                  height: '300px',
                  backgroundColor: '#eeeeee'
                }}
              >
                <ReactStreetview
                  apiKey={googleMapsApiKey}
                  streetViewPanoramaOptions={streetviewOptions}
                  onPositionChanged={() => console.log('onPositionChanged')}
                />
              </div>
            </div>
          )}
          <div className={styles.projectPageMapTitle}>
            {projects && projects[selectedIndex]
              ? projects[selectedIndex].name
              : ''}
          </div>
          <div className='m-3 text-left w-80'>
            {projects && projects[selectedIndex]
              ? projects[selectedIndex].stringCoordinates
              : ''}
          </div>
          <div className={styles.projectPageSectionTitle}>PICTURES TAKEN</div>
          {projects &&
            projects[selectedIndex] &&
            projects[selectedIndex].images.map((image, index) => {
              return <img key={index} className='my-1 w-80' src={`${image}`} />;
            })}
        </React.Suspense>
      </div>

      <div className='w-60'>
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
