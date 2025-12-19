const BASE_URL = "http://localhost:5000";

async function fetchUsers(page: number = 1, limit: number = 10) {
  const response = await fetch(`${BASE_URL}/users?page=${page}&limit=${limit}`);
  return response.json();
}

export { fetchUsers };