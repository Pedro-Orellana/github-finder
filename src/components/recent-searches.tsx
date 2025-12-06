import { FaUser, FaClock } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { fetchGithubUser } from "../api/github";

type RecentSearchesProps = {
  users: Array<string>;
  onSelectUser: (user: string) => void;
};

const RecentSearches = ({ users, onSelectUser }: RecentSearchesProps) => {
  //create queryClient to implement pre-fetch
  const queryClient = useQueryClient();

  return (
    <div className="recent-searches">
      <div className="recent-header">
        <FaClock />
        <h3>Recent Searches</h3>
      </div>
      <ul>
        {users.map((user) => (
          <li key={user}>
            <button
              onClick={(e) => {
                e.preventDefault();
                onSelectUser(user);
              }}
              onMouseEnter={() => {
                queryClient.prefetchQuery({
                  queryKey: ["users", user],
                  queryFn: () => fetchGithubUser(user),
                });
              }}
            >
              <FaUser className="user-icon" />
              {user}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearches;
