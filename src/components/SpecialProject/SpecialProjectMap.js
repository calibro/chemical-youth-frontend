import React from "react";
import ReactMapboxGl, { Cluster, Marker, ZoomControl } from "react-mapbox-gl";

const styles = {
  clusterMarker: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "black",
    border: "2px solid black",
    cursor: "pointer"
  },
  marker: {
    width: 25,
    height: 25,
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    border: "2px solid #000000",
    cursor: "pointer"
  },
  markerSelected: {
    width: 25,
    height: 25,
    borderRadius: "50%",
    backgroundColor: "#000000",
    alignItems: "center",
    border: "2px solid #ffffff",
    cursor: "pointer"
  }
};

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiY2hlbWljYWx5b3V0aCIsImEiOiJjanQ0ZmxxM2kxNDJoM3pwcXkwb2s0ZDA2In0.dKH9M8M6LzNWqS7jr0RGWg",
  scrollZoom: false
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
      <Marker
        key={coordinates.toString()}
        coordinates={coordinates}
        style={styles.clusterMarker}
      >
        {pointCount}
      </Marker>
    );
  };

  render() {
    const { projects, selectedIndex } = this.props;
    return (
      <Map
        ref={m => (this.map = m)}
        style="mapbox://styles/chemicalyouth/cjt9wxcnt0l9l1foa8ernfby3"
        containerStyle={{
          height: "600px",
          width: "100%"
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
        <ZoomControl />
        <Cluster ClusterMarkerFactory={this.clusterMarker} zoomOnClick={true}>
          {projects.map((project, index) => {
            return (
              <Marker
                coordinates={[project.coordinates.lng, project.coordinates.lat]}
                anchor="bottom"
                key={project._id}
                data-feature={project}
                style={
                  selectedIndex === index
                    ? styles.markerSelected
                    : styles.marker
                }
                onClick={() => this.clusterClick(index)}
              />
            );
          })}
        </Cluster>
      </Map>
    );
  }
}
