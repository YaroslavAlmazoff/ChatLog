import { useContext, useEffect, useState } from "react";
import api from "./api/auth";
import Public from "../publics/components/components/components/Public";
import "../publics/styles/publics.css";
import Loader from "../common_components/Loader";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router";

const Subscribes = () => {
  const params = useParams();

  const [publics, setPublics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPublics = async () => {
      const response = await api.get(`/api/public/subscribes/${params.id}`);
      setPublics(response.data.subscribes);
      setLoading(false);
    };
    getPublics();
  }, []);

  return (
    <div className="publics">
      {!loading ? (
        <>
          {publics.map((item) => (
            <Public item={item} />
          ))}
        </>
      ) : (
        <Loader ml={"50%"} />
      )}
    </div>
  );
};

export default Subscribes;
