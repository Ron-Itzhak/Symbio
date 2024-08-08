package posts

import (
	"api/auth"
	"database/sql"
	"net/http"

	"github.com/gorilla/mux"
)

func RegisterRoutes(router *mux.Router, db *sql.DB) {
	router.Handle("/posts", auth.AuthMiddleware(http.HandlerFunc(CreatePostHandler(db)))).Methods("POST")
	router.Handle("/posts", auth.AuthMiddleware(http.HandlerFunc(GetAllPostsHandler(db)))).Methods("GET")
	router.Handle("/posts/{id}", auth.AuthMiddleware(http.HandlerFunc(EditPostHandler(db)))).Methods("PUT")

}
