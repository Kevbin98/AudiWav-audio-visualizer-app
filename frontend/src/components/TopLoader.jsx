import React from "react";
import { useLoader } from "../context/LoaderContext";
import "../TopLoader.css";

const TopLoader = () => {
  const { isLoading } = useLoader();

  return <div className={`top-loader ${isLoading ? "loading" : ""}`} />;
};

export default TopLoader;
