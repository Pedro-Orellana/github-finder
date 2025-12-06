import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

//components
import UserCard from "./user-card";
import RecentSearches from "./recent-searches";
import SuggestionsDropdown from "./suggestions-dropdown";

//import query function
import { fetchGithubUser, searchGithubUser } from "../api/github";
import type { GithubUser } from "../types";

const UserSearch = () => {
  const [userName, setUserName] = useState("");
  const [submittedUserName, setSubmittedUserName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  //initialize state with what is stored in local storage
  const [recentUsers, setRecentUsers] = useState<Array<string>>(() => {
    const storedUsers = localStorage.getItem("recent-users");
    if (storedUsers) return JSON.parse(storedUsers);
    return [];
  });

  //getting a debounced search query
  const [debouncedSearchQuery] = useDebounce(userName, 300);

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

  //Query for getting specific GitHub user
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users", submittedUserName],
    queryFn: () => fetchGithubUser(submittedUserName),
    enabled: !!submittedUserName,
  });

  //Query for getting GitHub user suggestions
  const { data: suggestions } = useQuery({
    queryKey: ["github-user-suggestions", debouncedSearchQuery],
    queryFn: () => searchGithubUser(debouncedSearchQuery),
    enabled: debouncedSearchQuery.length > 0,
  });

  //update the local storage every time recentUsers changes
  useEffect(() => {
    const newRecentUsers = JSON.stringify(recentUsers);
    localStorage.setItem("recent-users", newRecentUsers);
  }, [recentUsers]);

  return (
    <form className="form">
      <div className="dropdown-wrapper">
        <input
          type="text"
          placeholder="Enter Github username..."
          value={userName}
          onChange={(e) => {
            const query = e.target.value;
            setUserName(query);
            setShowSuggestions(query.trim().length > 0);
          }}
        />
        {showSuggestions && suggestions?.length > 0 && (
          <SuggestionsDropdown
            suggestions={suggestions}
            show={showSuggestions}
            onSelect={(name) => {
              setUserName(name);
              setShowSuggestions(false);
              if (submittedUserName !== name) {
                setSubmittedUserName(name);
              } else {
                refetch();
              }

              //add the selected name to the recently searched items
              setRecentUsers((prev) => {
                const updatedRecentUsers = [
                  name,
                  ...prev.filter((u) => u !== name),
                ];
                //return only the last 5 users
                return updatedRecentUsers.slice(0, 5);
              });
            }}
          />
        )}
      </div>

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
