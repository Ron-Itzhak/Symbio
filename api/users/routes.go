package users

import (
	"api/auth"
	"database/sql"
	"net/http"

	"github.com/gorilla/mux"
)

func RegisterRoutes(router *mux.Router, db *sql.DB) {
	router.Handle("/users", auth.AuthMiddleware(http.HandlerFunc(GetAllUsersHandler(db)))).Methods("GET")
	router.Handle("/users/{id}", auth.AuthMiddleware(http.HandlerFunc(DeleteUserHandler(db)))).Methods("DELETE")

}
