import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User } from "../../lib/types";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";

interface UserRowProps {
  user: User;
  onDelete: (id: number) => void;
}

const UserTableRow: React.FC<UserRowProps> = (userRowProps: UserRowProps) => {
  const apiUrl =
    typeof window === "undefined"
      ? process.env.INTERNAL_API
      : process.env.NEXT_PUBLIC_API;
  const { toast } = useToast();

  const deleteUser = async () => {
    const token = Cookies.get("token");
    const url = `${apiUrl}/users/${userRowProps.user.id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const toastMessage =
      res.status === 200
        ? `User deleted successfully`
        : `User failed to be deleted`;
    toast({
      title: toastMessage,
      description: `Deleted User: ${userRowProps.user.username} `,
    });
    if (res.status === 200) {
      userRowProps.onDelete(userRowProps.user.id);
    }
  };

  return (
    <TableRow key={userRowProps.user.id}>
      <TableCell className="font-medium">{userRowProps.user.id}</TableCell>
      <TableCell>{userRowProps.user.username}</TableCell>
      <TableCell className="text-right">
        <Button variant="outline" onClick={() => deleteUser()}>
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
