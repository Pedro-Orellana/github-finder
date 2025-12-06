import type { GithubUser } from "../types";

type SuggestionsDropdownProps = {
  suggestions: Array<GithubUser>;
  show: boolean;
  onSelect: (userName: string) => void;
};

const SuggestionsDropdown = ({
  suggestions,
  show,
  onSelect,
}: SuggestionsDropdownProps) => {
  if (!show) return null;

  return (
    <ul className="suggestions">
      {suggestions.slice(0, 5).map((user: GithubUser) => (
        <li
          key={user.login}
          onClick={() => {
            onSelect(user.login);
          }}
        >
          <img src={user.avatar_url} alt={user.login} className="avatar-xs" />
          {user.login}
        </li>
      ))}
    </ul>
  );
};

//  e.preventDefault();
//               setUserName(user.login);
//               setShowSuggestions(false);
//               if (submittedUserName !== user.login) {
//                 setSubmittedUserName(user.login);
//               } else {
//                 refetch();
//               }

export default SuggestionsDropdown;
