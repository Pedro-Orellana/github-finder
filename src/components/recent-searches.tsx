import { FaUser, FaClock } from "react-icons/fa";

type RecentSearchesProps = {
  users: Array<string>;
  onSelectUser: (user: string) => void;
};

const RecentSearches = ({ users, onSelectUser }: RecentSearchesProps) => {
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
