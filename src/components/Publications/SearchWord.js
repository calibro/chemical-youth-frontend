import React from "react";
import styles from "./Publications.module.css";

function SearchWord({ toggleSelected }) {
  const handleKeyDown = event => {
    if (event.key === "Enter") {
      toggleSelected("publications", event.target.value);
    }
  };

  return (
    <input
      type="search"
      onKeyDown={handleKeyDown}
      className={styles["autocomplete-input"]}
    />
  );
}

export default SearchWord;
