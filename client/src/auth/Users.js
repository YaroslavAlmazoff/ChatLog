import React, { useEffect, useMemo, useState, useContext } from "react";
import UserItem from "./parts/UserItem";
import "./styles/users.css";
import useRandom from "../common_hooks/random.hook";
import api from "./api/auth";
import UsersFilterSide from "./parts/UsersFilterSide";
import UsersSearchSide from "./parts/UsersSearchSide";
import Loader from "../common_components/Loader";
import ShowAdLeft from "../inner_ad/components/components/ShowAdLeft";
import ShowAdRight from "../inner_ad/components/components/ShowAdRight";
import useVerify from "../common_hooks/verify.hook";
import { AuthContext } from "../context/AuthContext";
import useArray from "../common_hooks/array.hook";

const Users = () => {
  const auth = useContext(AuthContext);
  const { verify } = useVerify();
  useEffect(() => {
    verify();
  }, []);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { randomKey } = useRandom();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const response = await api.get(`/api/allusers/${page}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log(response.data.users);
      setUsers((prev) =>
        response.data.users
          ? [...prev, ...response.data.users].slice(0, response.data.count)
          : prev.slice(0, response.data.count)
      );
      setLoading(false);
    };
    fetchUsers();
  }, [page]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      console.log(scrollTop, windowHeight, pageHeight);
      if (scrollTop + windowHeight >= pageHeight) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", onScroll);

    const getFirstUsers = async () => {
      if (!auth.userId) return;
      setLoading(true);
      const response = await api.get(`/api/allusers/${1}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setUsers(response.data.users);
      setLoading(false);
    };
    if (users.length === 0) {
      getFirstUsers();
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [auth]);

  const searchedUsers = useMemo(() => {
    return [...users].filter((el) => {
      return (
        el.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        el.surname.toLowerCase().includes(searchValue.toLowerCase()) ||
        el.country.toLowerCase().includes(searchValue.toLowerCase()) ||
        el.city.toLowerCase().includes(searchValue.toLowerCase()) ||
        searchValue === "Поиск..."
      );
    });
  }, [users, searchValue]);

  return (
    <div className="users">
      {/*<div className="users-ads">
                    <ShowAdLeft width={'100%'} />
                </div>*/}

      <div className="users-list">
        {users.map((el) => (
          <UserItem
            key={randomKey()}
            name={el.name}
            surname={el.surname}
            age={el.age}
            avatarUrl={el.avatarUrl}
            id={el._id}
            isFriends={el.isFriends}
            isRequest={el.isRequest}
          />
        ))}
        {loading ? <Loader ml={"0%"} /> : <></>}
      </div>
      {/*<div className="users-ads">
                    <UsersSearchSide searchValue={searchValue} setSearchValue={setSearchValue} />  
                    <ShowAdRight width={'100%'} />
                </div>*/}
    </div>
  );
};

export default Users;

// const [selectAge, setSelectAge] = useState("Выберите возраст");
// const [selectCountry, setSelectCountry] = useState("Выберите страну");
// const [searchValue, setSearchValue] = useState("Поиск...");
