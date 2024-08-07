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
import Link from "next/link";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1.5 ">
      <Card className=" w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter username and password below to enter your account
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
              id="username"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {loginError && <div style={{ color: "red" }}>{loginError}</div>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </CardFooter>
        <div className="relative">
          <div className="absolute inset-0 flex items-center"></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
            <Link className="font-bold" href="/register">
              Register
            </Link>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default LoginForm;
