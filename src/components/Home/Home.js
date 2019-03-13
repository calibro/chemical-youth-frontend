import React, { Component } from "react";
import queryString from "query-string";
import Header from "../Header";
import { withRouter } from "react-router-dom";
import Chemicals from "../Chemicals";
import Topics from "../Topics";
import Researchers from "../Researchers";
import Locations from "../Locations";
import Methodologies from "../Methodologies";
import Times from "../Times";
import Loader from "../Loader";
import { AppContext } from "../../appContext";
import { find, findIndex } from "lodash";
import styles from "./Home.module.css";

const Projects = React.lazy(() => import("../Projects"));

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      section: "chemical",
      setSection: this.setSection,
      selectedChemical: "",
      setSelectedChemical: this.setSelectedChemical,
      selectedLocation: "",
      setSelectedLocation: this.setSelectedLocation,
      selectedTopic: "",
      setSelectedTopic: this.setSelectedTopic,
      selected: [],
      setSelected: this.setSelected,
      toggleSelected: this.toggleSelected
    };
  }

  setSelectedLocation = location => {
    this.setState({
      selectedLocation: location === this.state.selectedLocation ? "" : location
    });
  };

  setSelectedTopic = topic => {
    this.setState({
      selectedTopic: topic === this.state.selectedTopic ? "" : topic
    });
  };

  setSelectedChemical = chemical => {
    this.setState({
      selectedChemical: chemical === this.state.selectedChemical ? "" : chemical
    });
  };

  setSection = section => {
    this.setState({
      section: section
    });
  };

  setSelected = selected => {
    console.log(selected);
    this.setState({
      selected: selected
    });
  };

  toggleSelected = selected => {
    const selectedArray = this.state.selected;
    if (selected.type && selected.value !== null) {
      if (find(selectedArray, selected)) {
        const index = findIndex(selectedArray, selected);
        selectedArray.splice(index, 1);
      } else {
        selectedArray.push(selected);
      }
      this.setState({
        selected: selectedArray
      });
    }
  };

  componentDidMount() {
    const pathname = this.props.location.pathname.split("/");
    this.setSection(pathname[1]);
    const parsed = queryString.parse(this.props.location.search);
    if (parsed.selected && Array.isArray(parsed.selected)) {
      parsed.selected.forEach(p => {
        const selected = {
          type: pathname[1],
          value: pathname[1] === "time" ? Number(p) : p
        };
        this.toggleSelected(selected);
      });
    } else if (parsed.selected && !Array.isArray(parsed.selected)) {
      const selected = {
        type: pathname[1],
        value:
          pathname[1] === "time" ? Number(parsed.selected) : parsed.selected
      };
      this.toggleSelected(selected);
    }
  }

  render() {
    const pathname = this.props.location.pathname.split("/")[1];
    return (
      <AppContext.Provider value={this.state}>
        <React.Suspense fallback={<Loader />}>
          <Header />
          <div className={`container-fluid ${styles["split"]}`}>
            <div className="row h-100">
              <div className={`col-12 col-md-6 ${styles["col-viz"]}`}>
                {pathname === "chemical" && <Chemicals />}
                {pathname === "topic" && <Topics />}
                {pathname === "location" && <Locations />}
                {pathname === "researcher" && <Researchers />}
                {pathname === "time" && <Times />}
                {pathname === "method" && <Methodologies />}
              </div>
              <div className={`col-12 col-md-6 ${styles["col-projects"]}`}>
                <Projects />
              </div>
            </div>
          </div>
        </React.Suspense>
      </AppContext.Provider>
    );
  }
}

Home.contextType = AppContext;

export default Home;
