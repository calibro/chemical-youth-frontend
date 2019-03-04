import React, { useState, useEffect, useContext } from 'react';
import sanityClient from '../lib/sanity';
import { AppContext } from '../appContext';
import Loader from './Loader';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import ReactStreetview from 'react-streetview';
import bbox from '@turf/bbox';
import { lineString } from '@turf/helpers';

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

  const Map = ReactMapboxGl({
    accessToken:
      'pk.eyJ1IjoiZ2FicmllbGVjb2xvbWJvIiwiYSI6ImNpdGZqNWY1MjAwZWUyeW1qbDhkZHV2OXMifQ.Nem-UVIW-71T6yQQvjrtog'
  });

  const handleStatusChange = res => {
    setProjects(res);
    console.log(res);
    const [min, max] = extent(res, d => d.images.length);
    radiusScale.domain([0, max]);
    setLoading(false);

    const coordinates = res.map(p => {
      return [p.coordinates.lng, p.coordinates.lat];
    });
    const line = lineString(coordinates);
    const bounds = bbox(line);
    console.log(bounds);
    setBounds(bounds);
  };

  const getCirclePaint = (project, index) => {
    return {
      'circle-radius': radiusScale(project.images.length),
      'circle-color': index === selectedIndex ? '#000000' : '#FFFFFF',
      'circle-stroke-color': '#000000',
      'circle-stroke-width': 2,
      'circle-opacity': 1
    };
  };

  const googleMapsApiKey = 'AIzaSyDQsgQX8xc6_AiLmbwhZrdpELQJC8rlrII';

  if (projects && projects[selectedIndex]) {
    console.log(
      projects[selectedIndex].coordinates.lat,
      projects[selectedIndex].coordinates.lng
    );
  }

  let map = null;
  let mapZoom = 12;

  return (
    <div className='w-100 h-100 d-flex mt-5' style={{ height: '600px' }}>
      <div
        className='w-40 bg-white overflow-auto d-flex flex-column align-items-center'
        style={{ height: '600px' }}
      >
        <div className='mb-3 w-100'>
          <div
            style={{
              width: '100%',
              height: '300px',
              backgroundColor: '#eeeeee'
            }}
          >
            {projects && projects[selectedIndex] && (
              <ReactStreetview
                apiKey={googleMapsApiKey}
                streetViewPanoramaOptions={{
                  // position: {
                  //   lat: projects[selectedIndex].coordinates.lat,
                  //   lng: projects[selectedIndex].coordinates.lng
                  // },
                  position: { lat: 46.9171876, lng: 17.8951832 },
                  pov: { heading: 0, pitch: 100 },
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
                }}
              />
            )}
          </div>
        </div>
        <div className='m-3 text-left w-80 project-page-special-title'>
          {projects && projects[selectedIndex]
            ? projects[selectedIndex].name
            : ''}
        </div>
        <div className='m-3 text-left w-80'>
          {projects && projects[selectedIndex]
            ? projects[selectedIndex].stringCoordinates
            : ''}
        </div>
        <div className='project-page-section-title text-left w-80'>
          PICTURES TAKEN
        </div>
        {projects &&
          projects[selectedIndex] &&
          projects[selectedIndex].images.map((image, index) => {
            return <img key={index} className='my-1 w-80' src={`${image}`} />;
          })}
      </div>

      <div className='w-60'>
        <Map
          ref={m => (map = m)}
          style='mapbox://styles/gabrielecolombo/cjsnc1pt701yf1fmoasvam9wv'
          containerStyle={{
            height: '600px',
            width: '100%'
          }}
          onZoomEnd={z => {
            const zoom = map.state.map.getZoom();
            mapZoom = zoom;
          }}
          zoom={[mapZoom]}
          center={[
            projects && projects[selectedIndex]
              ? projects[selectedIndex].coordinates.lng
              : -0.2416815,
            projects && projects[selectedIndex]
              ? projects[selectedIndex].coordinates.lat
              : 51.5285582
          ]}
        >
          {projects.map((project, index) => {
            return (
              <Layer type='circle' paint={getCirclePaint(project, index)}>
                <Feature
                  coordinates={[
                    project.coordinates.lng,
                    project.coordinates.lat
                  ]}
                  onClick={() => setSelectedIndex(index)}
                />
              </Layer>
            );
          })}
        </Map>
      </div>
    </div>
  );
};

export default SpecialProject;
