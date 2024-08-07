"use client";

import { Post } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import PostCard from "./post-card";
import { SearchComponent } from "../components/search-input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usePosts } from "../contexts/postsContext";

interface PostsViewComponentProps {
  posts: Post[];
}

const PostsView = (props: PostsViewComponentProps) => {
  const { posts, setInitialPosts, editPost } = usePosts();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  useEffect(() => {
    setInitialPosts(props.posts);
  }, []);

  const handleEditPost = (updatedPost: Post) => {
    editPost(updatedPost);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="pt-2 pl-2 flex space-x-4 items-center justify-center ">
        <Button
          className="pl-2 px-4"
          onClick={() => router.push("/posts/create")}
        >
          Add Post
        </Button>
        <SearchComponent onSearchChange={setSearchQuery}></SearchComponent>
      </div>
      <div className="flex items-center justify-center flex-wrap gap-4 pt-2 pb-2">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post: Post) => (
            <PostCard key={post.id} post={post} onEdit={handleEditPost} />
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  );
};

export default PostsView;
