import { useContext, useEffect, useState } from "react";
import api from "../../../auth/api/auth";
import Public from "../components/components/Public";
import "../../styles/publics.css";
import ShowAdLeft from "../../../inner_ad/components/components/ShowAdLeft";
import UsersSearchSide from "../components/UsersSearchSide";
import { useMemo } from "react";
import Loader from "../../../common_components/Loader";
import { AuthContext } from "../../../context/AuthContext";

const PublicsPage = () => {
  const auth = useContext(AuthContext);
  const [publics, setPublics] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPublics = async () => {
      const response = await api.get(`/api/public/publics`);
      setPublics(response.data.publics);
      setLoading(false);
    };
    getPublics();
  }, []);

  const createPublic = () => {
    window.location = "/createpublic";
  };

  const searchedPublics = useMemo(() => {
    return [...publics].filter((el) => {
      return (
        el.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        el.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        searchValue === ""
      );
    });
  }, [publics, searchValue]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <div className="users-ads">
        <UsersSearchSide
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>
      {!loading ? (
        <div className="publics">
          <button
            onClick={createPublic}
            className="button"
            style={{ marginBottom: "15px" }}
          >
            Создать группу
          </button>
          {searchedPublics.map((item) => (
            <Public item={item} />
          ))}
        </div>
      ) : (
        <Loader ml={"50%"} />
      )}
    </div>
  );
};

export default PublicsPage;
