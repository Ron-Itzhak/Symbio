import { Post } from "@/lib/types";
import React from "react";
import { cookies } from "next/headers";
import PostsView from "./posts-view";

async function getPosts(): Promise<Post[]> {
  const token = cookies().get("token");

  const url = `${process.env.NEXT_PUBLIC_API}/posts`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  return await res.json();
}
const page = async () => {
  const posts: Post[] = await getPosts();

  return (
    <div>
      <PostsView posts={posts}></PostsView>
    </div>
  );
};

export default page;
