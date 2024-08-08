package auth

import (
	"database/sql"

	"github.com/gorilla/mux"
)

func RegisterRoutes(router *mux.Router, db *sql.DB) {
	router.HandleFunc("/login", LoginHandler(db)).Methods("POST")
	router.HandleFunc("/register", RegisterHandler(db)).Methods("POST")
}
