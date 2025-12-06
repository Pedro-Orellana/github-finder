export const FetchGithubUser = async (userName: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/users/${userName}`
  );

  if (!res.ok) throw new Error("User not found");

  const data = res.json();
  console.log(data);
  return data;
};
