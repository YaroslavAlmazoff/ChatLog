import React from "react";
import "../../../auth/styles/users.css";
import Search from "../../../auth/components/Universal/Search";

const UsersSearchSide = ({ searchValue, setSearchValue }) => {
  return (
    <div className="users-search-side">
      <Search searchValue={searchValue} setSearchValue={setSearchValue} />
    </div>
  );
};

export default UsersSearchSide;
