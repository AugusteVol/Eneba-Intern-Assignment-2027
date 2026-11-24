export async function login(username: string, password: string): Promise<{
  id: number;
  username: string;
  role: "admin" | "user";
}> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  return response.json();
}

export async function fetchAccountById(id: number): Promise<{
  id: number;
  username: string;
  role: "admin" | "user";
}> {
  const response = await fetch(`/api/accounts/${id}`);
  if (!response.ok) {
    throw new Error("Account session is no longer valid");
  }

  return response.json();
}

export async function registerAccount(
  username: string,
  password: string,
): Promise<{
  id: number;
  username: string;
  role: "admin" | "user";
}> {
  const response = await fetch("/api/accounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, role: "user" }),
  });

  if (!response.ok) {
    throw new Error(
      response.status === 409
        ? "Username already exists"
        : "Unable to register",
    );
  }

  return response.json();
}