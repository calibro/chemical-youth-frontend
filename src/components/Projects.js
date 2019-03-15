import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import sanityClient from "../lib/sanity";
import Project from "./Project";
import { AppContext } from "../appContext";
import { uniqBy } from "lodash";
import { timeLabels, quantizeTime } from "../timeUtils";
import Loader from "./Loader";
import { parseQueryParams } from "../utils";

const query = `*[_type == "project"]{
  _id, title, body, slug, startDate, endDate,
  "chemicals": chemicals[]->,
  "topics": topics[]->,
  "place": place[]->,
  "countries": place[]->country[]->,
  "researchers": researchers[]->,
  "methodologies": methodologies[]->,
}`;

const monthDiff = (d1, d2) => {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth() + 1;
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

const arrayContainsArray = (superset, subset) => {
  if (0 === subset.length) {
    return false;
  }
  return subset.some(value => {
    return superset.indexOf(value) >= 0;
  });
};

const Projects = ({ history }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
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
  };

  const filter = project => {
    const selectedFilters = context.selected.map(v => v.value);
    //console.log('selectedFilters', selectedFilters);
    if (selectedFilters.length > 0) {
      if (context.section === "location") {
        if (project.place && project.place.length > 0) {
          const places = project.place.map(m => m.city);
          return arrayContainsArray(places, selectedFilters);
        } else {
          return false;
        }
      } else if (context.section === "topic") {
        if (project.topics && project.topics.length > 0) {
          const topics = project.topics.map(t => t.name);
          return arrayContainsArray(topics, selectedFilters);
        } else {
          return false;
        }
      } else if (context.section === "chemical") {
        if (project.chemicals && project.chemicals.length > 0) {
          const chemicals = project.chemicals.map(c => c.name);
          return arrayContainsArray(chemicals, selectedFilters);
        } else {
          return false;
        }
      } else if (context.section === "method") {
        if (project.methodologies && project.methodologies.length > 0) {
          const methodologies = project.methodologies.map(m => m.name);
          return arrayContainsArray(methodologies, selectedFilters);
        } else {
          return false;
        }
      } else if (context.section === "researcher") {
        if (project.researchers && project.researchers.length > 0) {
          const researchers = project.researchers.map(m => m.name);
          return arrayContainsArray(researchers, selectedFilters);
        } else {
          return false;
        }
      } else if (context.section === "time") {
        const diff = monthDiff(
          new Date(project.startDate),
          new Date(project.endDate)
        );
        const duration = quantizeTime(diff);
        return selectedFilters.indexOf(duration) > -1;
      }
    } else {
      return true;
    }
  };

  const toggleSelected = (type, value) => {
    context.toggleSelected({ type: type, value: value });
    const queryParams = parseQueryParams(context.selected);
    history.push(`/${context.section}${queryParams}`);
  };

  return (
    <div className="w-100">
      {loading && <Loader />}
      <div className="project-header">
        <div className="project-counter">
          {projects.filter(project => filter(project)).length}/{" "}
          {projects.length} PROJECTS SHOWN
        </div>

        <div className="w-100 d-flex flex-wrap">
          {context.selected.map((el, index) => {
            return (
              <div className="tag" key={index}>
                <div className="p-2">
                  {context.section === "time" ? timeLabels[el.value] : el.value}
                </div>
                <div
                  className="cursor-pointer d-flex"
                  onClick={() => toggleSelected(el.type, el.value)}
                >
                  <i className="material-icons">close</i>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="project-list">
        {projects
          .filter(project => filter(project))
          .sort((a, b) => {
            const textA = a.title.toUpperCase();
            const textB = b.title.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
          })
          .map((project, index) => {
            return (
              <Project
                project={project}
                key={index}
                index={index}
                countries={
                  project.countries[0] ? uniqBy(project.countries, "name") : []
                }
              />
            );
          })}
        {!projects && <div>No projects found</div>}
      </div>
    </div>
  );
};

export default withRouter(Projects);
