package posts

import (
	"api/auth"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"time"

	"github.com/gorilla/mux"
)

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

func CreatePostHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		claims, ok := r.Context().Value("user").(*auth.Claims)
		if !ok {
			http.Error(w, "Invalid context from token", http.StatusUnauthorized)
			return
		}

		var req CreatePostRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}
		if req.Title == "" || req.Body == "" {
			http.Error(w, "Title and body are required", http.StatusBadRequest)
			return
		}

		result, err := db.Exec("INSERT INTO posts (title, body, author_id, author, created_at) VALUES (?, ?, ?, ?, ?)",
			req.Title, req.Body, claims.UserId, claims.Username, time.Now())
		if err != nil {
			log.Printf("Error inserting post into database: %v", err)

			http.Error(w, "Failed to create post", http.StatusInternalServerError)
			return
		}

		postId, err := result.LastInsertId()
		if err != nil {
			log.Printf("Error getting last insert ID: %v", err)
			http.Error(w, "Failed to retrieve post ID", http.StatusInternalServerError)
			return
		}

		response := CreatePostResponse{
			PostId:  int(postId),
			Message: "Post created successfully",
		}

		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(response); err != nil {
			log.Printf("Error encoding response to JSON: %v", err)
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}

type EditPostRequest struct {
	Title string `json:"title,omitempty"`
	Body  string `json:"body,omitempty"`
}

func EditPostHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		claims, ok := r.Context().Value("user").(*auth.Claims)
		if !ok {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		vars := mux.Vars(r)
		postIDStr := vars["id"]
		postId, err := strconv.Atoi(postIDStr)
		if err != nil {
			http.Error(w, "Invalid post ID", http.StatusBadRequest)
			return
		}

		var req EditPostRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		var authorId int
		err = db.QueryRow("SELECT author_id FROM posts WHERE id = ?", postId).Scan(&authorId)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Post not found", http.StatusNotFound)
			} else {
				log.Printf("Error getting post from database: %v", err)

				http.Error(w, "Database error", http.StatusInternalServerError)
			}
			return
		}

		if authorId != claims.UserId {
			http.Error(w, "You do not have permission to edit this post", http.StatusForbidden)
			return
		}

		query := "UPDATE posts SET "
		args := []interface{}{}
		first := true

		if req.Title != "" {
			if !first {
				query += ",title = ? "
			}
			if first {
				query += "title = ? "

			}
			args = append(args, req.Title)
			first = false
		}

		if req.Body != "" {
			if !first {
				query += ", body = ? "
			}
			if first {
				query += "body = ? "
			}
			args = append(args, req.Body)
			first = false
		}

		query += "WHERE id = ?"
		args = append(args, postId)
		_, err = db.Exec(query, args...)
		if err != nil {
			log.Printf("Error updating post in database: %v", err)
			http.Error(w, "Failed to update post", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Post updated successfully"))
	}
}

func GetAllPostsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, title, body, author_id, author FROM posts")
		if err != nil {
			log.Printf("Error retrieving posts from database: %v", err)
			http.Error(w, "Failed to retrieve posts", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var posts []Post

		for rows.Next() {
			var post Post
			if err := rows.Scan(&post.Id, &post.Title, &post.Body, &post.AuthorId, &post.Author); err != nil {
				log.Printf("Error scanning post row: %v", err)
				http.Error(w, "Failed to retrieve posts", http.StatusInternalServerError)
				return
			}
			posts = append(posts, post)
		}

		if err := rows.Err(); err != nil {
			log.Printf("Error iterating over posts: %v", err)
			http.Error(w, "Failed to retrieve posts", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if len(posts) == 0 {
			w.Write([]byte("[]"))
			return
		}
		if err := json.NewEncoder(w).Encode(posts); err != nil {
			log.Printf("Error encoding posts to JSON: %v", err)
			http.Error(w, "Failed to retrieve posts", http.StatusInternalServerError)
		}
	}
}
