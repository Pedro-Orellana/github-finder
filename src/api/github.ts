export const fetchGithubUser = async (userName: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/users/${userName}`
  );

  if (!res.ok) throw new Error("User not found");

  const data = res.json();
  console.log(data);
  return data;
};

export const searchGithubUser = async (query: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/search/users?q=${query}`
  );

  if (!res.ok) throw new Error("User not found");

  const data = await res.json();
  console.log(data);
  return data.items;
};
