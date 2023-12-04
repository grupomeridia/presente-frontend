// LoadingBar.js
import React from "react";
import styles from "./style.module.css";

const LoadingBar = ({ progress }) => {
  return (
    <div className={styles.loadingBar}>
      <div
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
        data-testid="progress-bar"
      ></div>
    </div>
  );
};

export default LoadingBar;
