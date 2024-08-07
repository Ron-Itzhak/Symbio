export interface User {
  username: string;
  id: number;
  password: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  author: string;
}
