"use client";

import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SpinnerIcon from "../components/spinner-icon";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

const RegisterForm = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await register(username, password);

      const toastMessage =
        response === 201 ? `Registered successfully` : `Already existing user`;

      toast({
        title: toastMessage,
        description: `User :  ${username} `,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1.5 ">
      <Card className=" w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Enter username and password below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <Label htmlFor="name">Username</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="username">Password</Label>
            <Input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Register
          </Button>
        </CardFooter>
        <div className="relative">
          <div className="absolute inset-0 flex items-center"></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
            <Link className="font-bold" href="/login">
              Login
            </Link>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default RegisterForm;
