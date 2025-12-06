import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

//components
import UserCard from "./user-card";
import RecentSearches from "./recent-searches";

//import query function
import { FetchGithubUser } from "../api/github";

const UserSearch = () => {
  const [userName, setUserName] = useState("");
  const [submittedUserName, setSubmittedUserName] = useState("");
  const [recentUsers, setRecentUsers] = useState<Array<string>>([]);

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const trimmedUserName = userName.trim();
    setSubmittedUserName(trimmedUserName);
    setRecentUsers((prev) => {
      const updatedRecentUsers = [
        trimmedUserName,
        ...prev.filter((u) => u !== trimmedUserName),
      ];
      //return only the last 5 users
      return updatedRecentUsers.slice(0, 5);
    });
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", submittedUserName],
    queryFn: () => FetchGithubUser(submittedUserName),
    enabled: !!submittedUserName,
  });

  return (
    <form className="form">
      <input
        type="text"
        placeholder="Enter Github username..."
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      />
      <button
        type="submit"
        onClick={(e) => {
          handleSubmit(e);
        }}
      >
        Search
      </button>

      {isLoading && <p className="status">Loading...</p>}
      {isError && <p className="status error">{error.message}</p>}
      {data && <UserCard user={data} />}
      {recentUsers.length > 0 && (
        <RecentSearches
          users={recentUsers}
          onSelectUser={(prop) => {
            setUserName(prop);
            setSubmittedUserName(prop);
          }}
        />
      )}
    </form>
  );
};

export default UserSearch;
