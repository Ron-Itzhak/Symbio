"use client";

import { Post } from "@/lib/types";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useRef,
} from "react";

interface PostsContextType {
  posts: Post[];
  addPost: (newPost: Post) => void;
  setInitialPosts: (initialPosts: Post[]) => void;
  editPost: (updatedPost: Post) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

interface PostsProviderProps {
  children: ReactNode;
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const hasInitialized = useRef(false);

  const setInitialPosts = (initialPosts: Post[]) => {
    if (!hasInitialized.current) {
      setPosts(initialPosts);
      hasInitialized.current = true;
    }
  };

  const addPost = (newPost: Post) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };
  const editPost = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  return (
    <PostsContext.Provider
      value={{ posts, addPost, editPost, setInitialPosts }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = (): PostsContextType => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};
