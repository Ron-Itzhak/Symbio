package users

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func DeleteUserHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["id"]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid user ID", http.StatusBadRequest)
			return
		}
		_, err = db.Exec("DELETE FROM users WHERE id = ?", id)
		if err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("User deleted successfully"))

	}
}

func GetAllUsersHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, username FROM users ORDER BY id")
		if err != nil {
			log.Printf("Error retrieving users from database: %v", err)
			http.Error(w, "Failed to retrieve posts", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var users []UserResponse

		for rows.Next() {
			var user UserResponse
			if err := rows.Scan(&user.Id, &user.Username); err != nil {
				log.Printf("Error scanning post row: %v", err)
				http.Error(w, "Failed to retrieve posts", http.StatusInternalServerError)
				return
			}
			users = append(users, user)
		}
		if err := rows.Err(); err != nil {
			log.Printf("Error iterating over posts: %v", err)
			http.Error(w, "Failed to retrieve posts", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		if len(users) == 0 {
			w.Write([]byte("[]"))
			return
		}
		if err := json.NewEncoder(w).Encode(users); err != nil {
			log.Printf("Error encoding users to JSON: %v", err)
			http.Error(w, "Failed to retrieve users", http.StatusInternalServerError)
		}
	}
}
