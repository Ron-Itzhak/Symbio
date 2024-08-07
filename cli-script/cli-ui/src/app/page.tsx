import { promises as fs } from "fs";

type Post = {
  id: number;
  title: string;
  body: string;
  author: string;
};

export default async function Page() {
  const file = await fs.readFile(process.cwd() + "/posts.json", "utf8");
  const data = JSON.parse(file) as Post[];

  return (
    <div>
      {data.map((post: Post) => (
        <div key={post.id}>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
          <small>By {post.author}</small>
        </div>
      ))}
    </div>
  );
}
