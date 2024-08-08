"use client";

import { useState } from "react";
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
import { toast } from "@/components/ui/use-toast";
import SpinnerIcon from "@/app/components/spinner-icon";
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/auth-context";
import { usePosts } from "@/app/contexts/posts-context";

interface AddResponse {
  post_id: number;
  message: string;
}
async function sendRequest(title: string, body: string) {
  const apiUrl =
    typeof window === "undefined"
      ? process.env.INTERNAL_API
      : process.env.NEXT_PUBLIC_API;
  const url = `${apiUrl}/posts`;
  const token = Cookies.get("token");

  const res = await fetch(url, {
    body: JSON.stringify({ title, body }),
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}

const CreatePostForm = () => {
  const { user } = useAuth();

  const router = useRouter();
  const { addPost } = usePosts();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: any) => {
    setBody(event.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await sendRequest(title, body);

      const toastMessage =
        response.status === 201
          ? `Post created successfully`
          : `Error in creating post`;

      const result = (await response.json()) as unknown as AddResponse;
      const postAdded = {
        id: result.post_id,
        title,
        body,
        author: user!.username,
      };
      addPost(postAdded);

      toast({
        title: toastMessage,
        description: `User :  ${title} `,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
      router.push("/posts");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1.5 ">
      <Card className=" w-[350px]">
        <CardHeader>
          <CardTitle>Create Post</CardTitle>
          <CardDescription>
            Enter title and body below to create your post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <Label htmlFor="name">Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="username">Body</Label>
            <Textarea value={body} onChange={handleChange} required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default CreatePostForm;
