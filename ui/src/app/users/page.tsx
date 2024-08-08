import React from "react";
import UsersTable from "./users-table";
import { User } from "../../lib/types";
import { cookies } from "next/headers";

async function getUsers() {
  const apiUrl =
    typeof window === "undefined"
      ? process.env.INTERNAL_API
      : process.env.NEXT_PUBLIC_API;
  const token = cookies().get("token");
  const url = `${apiUrl}/users`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  return await res.json();
}

const users = async () => {
  const users: User[] = await getUsers();
  return <UsersTable users={users}></UsersTable>;
};

export default users;
