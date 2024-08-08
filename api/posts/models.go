package posts

import "time"

type Post struct {
	Id        int       `json:"id"`
	Title     string    `json:"title"`
	Body      string    `json:"body"`
	Author    string    `json:"author"`
	AuthorId  int       `json:"author_id"`
	CreatedAt time.Time `json:"created_at"`
}

type CreatePostRequest struct {
	Title string `json:"title"`
	Body  string `json:"body"`
}

type CreatePostResponse struct {
	PostId  int    `json:"post_id"`
	Message string `json:"message"`
}

type EditPostRequest struct {
	Title string `json:"title,omitempty"`
	Body  string `json:"body,omitempty"`
}
