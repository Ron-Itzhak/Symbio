"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Post } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "../contexts/auth-context";
interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
}
const PostCard: React.FC<PostCardProps> = (props: PostCardProps) => {
  const apiUrl =
    typeof window === "undefined"
      ? process.env.INTERNAL_API
      : process.env.NEXT_PUBLIC_API;
  const { user } = useAuth();
  const [isEditable, setIsEditable] = useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  useEffect(() => {
    if (user) {
      setIsEditable(user.username === props.post.author);
    }
  }, [user, props.post.author]);
  const { toast } = useToast();
  const [bodyValue, setBodyValue] = useState(props.post.body);
  const [titleValue, setTitleValue] = useState(props.post.title);
  const handleTitleChange = (value: any) => {
    setTitleValue(value);
  };
  const handleBodyChange = (event: any) => {
    setBodyValue(event.target.value);
  };
  const [isInEditMode, setIsInEditMode] = useState(false);

  const editPostDetails = async (id: number) => {
    const token = Cookies.get("token");
    setIsInEditMode(!isInEditMode);
    try {
      const url = `${apiUrl}/posts/${id}`;

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: titleValue,
          body: bodyValue,
        }),
      });
      const toastMessage =
        res.status === 200
          ? `Updated post status successfully`
          : `Failed to update post status: `;
      toast({
        title: toastMessage,
        description: `Post name :${props.post.title} `,
      });
      props.onEdit({ ...props.post, title: titleValue, body: bodyValue });
    } catch (error) {
      toast({
        title: "Failed to update post status:",
        description: "erorr in sending request",
      });
    }
  };
  return (
    <div>
      <Card
        className={`w-[350px] transition-all duration-300 ${
          isExpanded ? "max-h-screen" : "max-h-60"
        }`}
      >
        <CardHeader>
          {!isInEditMode && (
            <CardTitle className="truncate ">{props.post.title}</CardTitle>
          )}
          {isInEditMode && (
            <>
              <Label>Edit title</Label>
              <Input
                type="text"
                value={titleValue}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </>
          )}

          <CardDescription className="max-h-3">
            Author:{props.post.author}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-1.5 ">
          {!isInEditMode && (
            <p className={`${isExpanded ? "" : "truncate"}`}>
              {props.post.body}
            </p>
          )}
          {isInEditMode && (
            <>
              {" "}
              <Label htmlFor="message-2">Edit body</Label>
              <Textarea value={bodyValue} onChange={handleBodyChange} />
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {isInEditMode ? (
            <Button onClick={() => editPostDetails(props.post.id)}>Save</Button>
          ) : (
            <Button
              disabled={!isEditable}
              onClick={() => {
                setIsInEditMode(!isInEditMode);
                setIsExpanded(true);
              }}
            >
              Edit
            </Button>
          )}
          {isInEditMode && (
            <Button
              variant="outline"
              onClick={() => {
                setIsInEditMode(!isInEditMode);
                setIsExpanded(false);
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            disabled={isInEditMode}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostCard;
