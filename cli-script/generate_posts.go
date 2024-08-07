package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

type Post struct {
	Id     int    `json:"id"`
	Title  string `json:"title"`
	Body   string `json:"body"`
	Author string `json:"author"`
}

func main() {
	dsn := "root:Aa123456!@tcp(host.docker.internal:3306)/app"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, title, body, author FROM posts")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var post Post
		if err := rows.Scan(&post.Id, &post.Title, &post.Body, &post.Author); err != nil {
			log.Fatal(err)
		}
		posts = append(posts, post)
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
	file, err := os.Create("./cli-ui/posts.json")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(posts); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Posts have been written to posts.json")
}
