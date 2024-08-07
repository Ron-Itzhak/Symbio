import React from "react";
import UsersTable from "./users-table";
import { User } from "../../lib/types";
import { cookies } from "next/headers";

async function getUsers() {
  const token = cookies().get("token");
  const url = `${process.env.NEXT_PUBLIC_API}/users`;
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
