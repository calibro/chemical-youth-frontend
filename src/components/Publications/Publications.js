import React, { useState, useEffect, useContext, useMemo } from "react";
import { withRouter } from "react-router-dom";
import { ascending, descending } from "d3-array";
import sanityClient from "../../lib/sanity";
import BlockContent from "@sanity/block-content-to-react";
import { AppContext } from "../../appContext";
import SearchWord from "./SearchWord";
import Loader from "../Loader";
import { parseQueryParams } from "../../utils";
import styles from "./Publications.module.css";

const query = `*[_type == "publication"]{
  _id, name, year, private,category->,
  "document": document.asset->url,
}`;

const Publications = ({ history }) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const headers = ["name", "year", "category"];
  const [order, setOrder] = useState({
    name: true,
    year: true,
    category: true
  });
  const [sortBy, setSortBy] = useState("name");
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
    setPublications(res);
    setLoading(false);
  };

  const dataTable = useMemo(() => {
    const selectedFilters = context.selected.map(v => v.value);
    return publications
      .filter(d => {
        if (selectedFilters && selectedFilters.length > 0) {
          const name = d.name[0].children
            .filter(child => child._type === "span")
            .map(span => span.text)
            .join("");

          const regex = new RegExp(
            "\\b(?:" + selectedFilters.join("|") + ")\\b",
            "gi"
          );
          return name.match(regex) ? true : false;
        }
        return true;
      })
      .sort((a, b) => {
        let ordering;

        if (sortBy === "year") {
          ordering = order.year
            ? ascending(a.year, b.year)
            : descending(a.year, b.year);
        }

        if (sortBy === "name") {
          const nameA = a.name[0].children
            .filter(child => child._type === "span")
            .map(span => span.text)
            .join("");

          const nameB = b.name[0].children
            .filter(child => child._type === "span")
            .map(span => span.text)
            .join("");

          ordering = order.name
            ? ascending(nameA, nameB)
            : descending(nameA, nameB);
        }

        if (sortBy === "category") {
          ordering = order.category
            ? ascending(a.category.name, b.category.name)
            : descending(a.category.name, b.category.name);
        }

        return ordering;
      });
  }, [publications, sortBy, order, context.selected]);

  const toggleSelected = (type, value) => {
    context.toggleSelected({ type: type, value: value });
    const queryParams = parseQueryParams(context.selected);
    history.push(`/${context.section}${queryParams}`);
  };

  const toggleOrder = column => {
    const test = { ...order };
    test[column] = !test[column];
    setOrder(test);
    setSortBy(column);
  };

  return (
    <React.Fragment>
      <div className="col-12 col-lg-9 h-100">
        {loading && <Loader />}
        <div className={styles.gridContainer}>
          <div className={`${styles.grid} ${styles.sticky} pt-3`}>
            {headers.map(header => {
              return (
                <div className={`${styles.header} ${styles.cell}`} key={header}>
                  <div>{header}</div>
                  <div
                    className={styles.order}
                    onClick={() => toggleOrder(header)}
                  >
                    <i className="material-icons">
                      {order[header] ? "arrow_drop_down" : "arrow_drop_up"}
                    </i>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.grid}>
            {dataTable.map(publication => {
              return (
                <React.Fragment key={publication._id}>
                  {headers.map(header => {
                    return (
                      <div
                        className={styles.cell}
                        key={publication._id + header}
                      >
                        {header === "name" ? (
                          <div className="w-100 d-flex flex-column">
                            <BlockContent
                              blocks={publication[header]}
                              renderContainerOnSingleChild={true}
                            />
                            {!publication.private && (
                              <a
                                href={publication.document}
                                className={`${
                                  styles.download
                                } d-flex align-items-center`}
                              >
                                <span>download</span>
                                <span className="ml-1 material-icons">
                                  arrow_circle_down
                                </span>
                              </a>
                            )}
                          </div>
                        ) : header === "category" ? (
                          <span>{publication[header].name}</span>
                        ) : (
                          <span>{publication[header]}</span>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-2 offset-lg-1">
        <div className={styles["autocomplete-container"]}>
          <img
            alt="magnify"
            src="images/magnify.svg"
            width={20}
            className={styles["autocomplete-icon"]}
          />
          <SearchWord toggleSelected={toggleSelected} />
        </div>
        <div className="project-header border-0">
          <div className="project-counter">
            {dataTable.length}/ {publications.length} PUBLICATIONS SHOWN
          </div>

          <div className="w-100 d-flex flex-wrap">
            {context.selected.map((el, index) => {
              return (
                <div className="tag" key={index}>
                  <div className="p-2">{el.value}</div>
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
      </div>
    </React.Fragment>
  );
};

export default withRouter(Publications);
