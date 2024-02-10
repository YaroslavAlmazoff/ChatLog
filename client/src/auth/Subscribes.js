import { useContext, useEffect, useState } from "react";
import api from "./api/auth";
import Public from "../publics/components/components/components/Public";
import "../publics/styles/publics.css";
import Loader from "../common_components/Loader";
import { AuthContext } from "../context/AuthContext";

const Subscribes = () => {
  const auth = useContext(AuthContext);
  const [publics, setPublics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPublics = async () => {
      const response = await api.get(`/api/public/subscribes/${auth.token}`);
      setPublics(response.data.publics);
      setLoading(false);
    };
    getPublics();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      {!loading ? (
        <div className="publics">
          {publics.map((item) => (
            <Public item={item} />
          ))}
        </div>
      ) : (
        <Loader ml={"50%"} />
      )}
    </div>
  );
};

export default Subscribes;
