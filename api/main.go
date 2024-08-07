package main

import (
	"api/auth"
	"api/posts"
	"api/users"
	"database/sql"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {

	db, err := sql.Open("mysql", os.Getenv("DB_CONNECTION"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	router := mux.NewRouter()

	router.HandleFunc("/login", auth.LoginHandler(db)).Methods("POST")
	router.HandleFunc("/register", auth.RegisterHandler(db)).Methods("POST")

	router.Handle("/users", auth.AuthMiddleware(http.HandlerFunc(users.GetAllUsersHandler(db)))).Methods("GET")
	router.Handle("/users/{id}", auth.AuthMiddleware(http.HandlerFunc(users.DeleteUserHandler(db)))).Methods("DELETE")

	router.Handle("/posts", auth.AuthMiddleware(http.HandlerFunc(posts.CreatePostHandler(db)))).Methods("POST")
	router.Handle("/posts", auth.AuthMiddleware(http.HandlerFunc(posts.GetAllPostsHandler(db)))).Methods("GET")
	router.Handle("/posts/{id}", auth.AuthMiddleware(http.HandlerFunc(posts.EditPostHandler(db)))).Methods("PUT")

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
	)
	http.Handle("/", corsHandler(router))

	log.Println("Server starting on port: 8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
