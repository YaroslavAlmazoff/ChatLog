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

  const { randomKey } = useRandom();

  const [users, setUsers] = useState([]);
  const fetchUsers = async (page) => {
    if (!auth.userId) return;
    const response = await api.get(`/api/allusers/${page}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    setUsers((prevUsers) => [...prevUsers, ...response.data.users]);
  };

  useEffect(() => {
    fetchUsers(1);
  });

  const onScroll = (event) => {
    var element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      console.log("end.");
    }
  };

  // const sortedUsersByAge = useMemo(() => {
  //   return [...users].filter((el) => {
  //     return el.age === selectAge || selectAge === "Выберите возраст";
  //   });
  // }, [users, selectAge]);

  // const sortedUsersByCountry = useMemo(() => {
  //   return [...sortedUsersByAge].filter((el) => {
  //     return (
  //       el.country.toLowerCase() === selectCountry.toLowerCase() ||
  //       selectCountry === "Выберите страну"
  //     );
  //   });
  // }, [sortedUsersByAge, selectCountry]);

  // const searchedUsers = useMemo(() => {
  //   return [...sortedUsersByCountry].filter((el) => {
  //     return (
  //       el.name.toLowerCase().includes(searchValue.toLowerCase()) ||
  //       el.surname.toLowerCase().includes(searchValue.toLowerCase()) ||
  //       el.country.toLowerCase().includes(searchValue.toLowerCase()) ||
  //       el.city.toLowerCase().includes(searchValue.toLowerCase()) ||
  //       searchValue === "Поиск..."
  //     );
  //   });
  // }, [sortedUsersByCountry, searchValue]);

  return (
    <div className="users">
      {/*<div className="users-ads">
                    <UsersFilterSide users={users} setUsers={setUsers} usersReserve={usersReserve} setSelectAge={setSelectAge} setSelectCountry={setSelectCountry} />
                    <ShowAdLeft width={'100%'} />
                </div>*/}
      {loading ? (
        <Loader ml={"0%"} />
      ) : (
        <div className="users-list" onScroll={(event) => onScroll(event)}>
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
        </div>
      )}
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
