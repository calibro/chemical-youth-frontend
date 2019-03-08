import React from 'react';
import ReactMapboxGl, { Cluster, Marker } from 'react-mapbox-gl';

const styles = {
  clusterMarker: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: '#000000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    border: '2px solid #ffffff',
    cursor: 'pointer'
  },
  marker: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid #000000',
    cursor: 'pointer'
  },
  markerSelected: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: '#000000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid #ffffff',
    cursor: 'pointer'
  }
};

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiZ2FicmllbGVjb2xvbWJvIiwiYSI6ImNpdGZqNWY1MjAwZWUyeW1qbDhkZHV2OXMifQ.Nem-UVIW-71T6yQQvjrtog'
});

export default class SpecialProjectMap extends React.Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.mapZoom = 10;
  }
  clusterClick = index => {
    this.props.setSelectedIndex(index);
  };

  clusterMarker = (coordinates, pointCount) => {
    return (
      <Marker coordinates={coordinates} style={styles.clusterMarker}>
        {pointCount}
      </Marker>
    );
  };

  render() {
    const { projects, selectedIndex } = this.props;
    return (
      <Map
        ref={m => (this.map = m)}
        style='mapbox://styles/gabrielecolombo/cjsnc1pt701yf1fmoasvam9wv'
        containerStyle={{
          height: '600px',
          width: '100%'
        }}
        onZoomEnd={z => {
          const zoom = this.map.state.map.getZoom();
          this.mapZoom = zoom;
        }}
        fitBounds={this.props.bounds}
        fitBoundsOptions={{
          padding: { top: 80, bottom: 80, left: 15, right: 15 }
        }}
        zoom={[this.mapZoom]}
        center={[
          projects && projects[selectedIndex]
            ? projects[selectedIndex].coordinates.lng
            : -0.2416815,
          projects && projects[selectedIndex]
            ? projects[selectedIndex].coordinates.lat
            : 51.5285582
        ]}
      >
        <Cluster ClusterMarkerFactory={this.clusterMarker} zoomOnClick={true}>
          {projects.map((project, index) => {
            return (
              <Marker
                coordinates={[project.coordinates.lng, project.coordinates.lat]}
                anchor='bottom'
                key={index}
                data-feature={project}
                style={
                  selectedIndex === index
                    ? styles.markerSelected
                    : styles.marker
                }
                onClick={() => this.clusterClick(index)}
              >
                <div />
              </Marker>
            );
          })}
        </Cluster>
      </Map>
    );
  }
}
