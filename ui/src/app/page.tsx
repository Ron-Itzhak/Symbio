"use client";
import Link from "next/link";
import { useAuth } from "./contexts/authContext";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-dvh">
      <section className="w-full pt-12 md:pt-24 lg:pt-32 ">
        <div className="container space-y-10 xl:space-y-16 px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.5rem]  w-full max-w-3xl">
              Welcome, {user?.username}
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Explore all posts and add your next one.
            </p>
            <Link
              href="/posts"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 mt-6"
              prefetch={false}
            >
              Search Posts
            </Link>
            <Button
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 mt-6"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container space-y-12 px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Manage Users</h3>
              <p className="text-sm text-muted-foreground">
                See all users and manage them
              </p>
              <Link
                href="/users"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Managae Users
              </Link>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Add Post</h3>
              <p className="text-sm text-muted-foreground">
                Expand our library by creating new posts.
              </p>
              <Link
                href="/posts/create"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Create Post
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
