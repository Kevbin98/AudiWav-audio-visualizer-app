import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLoader } from "../context/LoaderContext";

const RouteChangeHandler = () => {
  const location = useLocation();
  const { setIsLoading } = useLoader();

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timeout);
  }, [location]);

  return null;
};

export default RouteChangeHandler;
