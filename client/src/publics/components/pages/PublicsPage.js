import { useContext, useEffect, useState } from "react";
import api from "../../../auth/api/auth";
import Public from "../components/components/Public";
import "../../styles/publics.css";
import "../../../auth/styles/users.css";
import "../../../auth/components/Universal/styles/search.css";
import ShowAdLeft from "../../../inner_ad/components/components/ShowAdLeft";
import UsersSearchSide from "../components/UsersSearchSide";
import { useMemo } from "react";
import Loader from "../../../common_components/Loader";
import { AuthContext } from "../../../context/AuthContext";
import useHighlight from "../../../common_hooks/highlight.hook";

const PublicsPage = () => {
  const { randomBlockShadow } = useHighlight();
  const auth = useContext(AuthContext);
  const [publics, setPublics] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchDisplay, setSearchDisplay] = useState(false);

  useEffect(() => {
    const getPublics = async () => {
      const response = await api.get(`/api/public/all-publics`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log(response);
      setPublics(response.data.publics);
      setLoading(false);
      setSearchDisplay(true);
    };
    getPublics();
  }, [auth]);

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
    <div className="users">
      <div className="users-list">
        {!loading ? (
          <>
            <button
              onClick={createPublic}
              className="button"
              style={{ marginBottom: "15px" }}
            >
              Создать группу
            </button>

            {searchDisplay && (
              <div className="users-search">
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="search"
                  className="users-search-field users-search-field-width"
                  placeholder="Поиск..."
                />
                <button
                  className="button"
                  onClick={() => {
                    setSearchValue(searchValue);
                    setPage(1);
                  }}
                >
                  Поиск
                </button>
              </div>
            )}
            {searchedPublics.map((item) => (
              <Public item={item} />
            ))}
          </>
        ) : (
          <Loader ml={"50%"} />
        )}
      </div>
    </div>
  );
};

export default PublicsPage;
