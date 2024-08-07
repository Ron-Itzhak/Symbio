"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import UserTableRow from "./users-table-row";
import { User } from "@/lib/types";

interface UserTableComponentProps {
  users: User[];
}

const UsersTable = (props: UserTableComponentProps) => {
  const [users, setUsers] = useState<User[]>(props.users);
  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
  };
  return (
    <div>
      {users.length > 0 ? (
        <Table>
          <TableCaption>Users List</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">User Id</TableHead>
              <TableHead>Username</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: User) => (
              <UserTableRow
                key={user.id}
                user={user}
                onDelete={handleDeleteUser}
              ></UserTableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No posts found</p>
      )}
    </div>
  );
};

export default UsersTable;
