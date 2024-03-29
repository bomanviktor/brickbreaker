package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"sync"
	"time"
)

type playerData struct {
	Name   string `json:"name"`
	Level  int    `json:"level"`
	Points int    `json:"points"`
	Time   int    `json:"time"`
	Lives  int    `json:"lives"`
}

type leaderboardEntry struct {
	Name  string `json:"name"`
	Rank  int    `json:"rank"`
	Score int    `json:"score"`
	Time  string `json:"time"`
}

var players = make(map[string]*playerData)
var leaderboard = make([]leaderboardEntry, 0)
var mu sync.Mutex

func main() {
	http.HandleFunc("/api/data", handleData)               // POST
	http.HandleFunc("/api/leaderboard", handleLeaderboard) // GET
	fmt.Println("Server is running on port 5502 ... http://localhost:5502")
	log.Fatal((http.ListenAndServe(":5502", nil)))
}

// POST method handler for /api/data
//
// expects incoming JSON data in the following format
//
//	{
//	    "Name": "Fukame",
//	    "Level": 5,
//	    "Points": 99,
//	    "Time": 10,
//	    "Lives": 3
//	}
//
// Responds with Array of JSON, response format:
// [

// 	{
// 	    "name": "playerName",
// 	    "rank": 1,
// 	    "score": 99,
// 	    "time": "00:10"
// 	},
// 	.......

// ]
func handleData(w http.ResponseWriter, r *http.Request) {
	// Add CORS headers for preflight request
	if r.Method == "OPTIONS" {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "POST")
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Add CORS headers for actual request
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	fmt.Println("Request received: ", r.Method, r.URL.Path, r.RemoteAddr, r.UserAgent(), r.Header.Get("Content-Type"))
	fmt.Println(r.Body)

	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()

	var data playerData
	err := decoder.Decode(&data)
	if err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	mu.Lock()
	defer mu.Unlock()

	player, ok := players[data.Name]
	if !ok {
		player = &data
		players[data.Name] = player
	} else if data.Points > player.Points {
		player.Name = data.Name
		player.Level = data.Level
		player.Points = data.Points
		player.Time = data.Time
		player.Lives = data.Lives
	}

	leaderboard = make([]leaderboardEntry, 0, len(players))
	for _, player := range players {
		leaderboard = append(leaderboard, leaderboardEntry{
			Name:  player.Name,
			Rank:  calculateRank(player.Points),
			Score: player.Points,
			Time:  formatTime(player.Time),
		})
	}

	sort.Slice(leaderboard, func(i, j int) bool {
		return leaderboard[i].Rank < leaderboard[j].Rank
	})

	response, err := json.Marshal(leaderboard)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}

func handleLeaderboard(w http.ResponseWriter, r *http.Request) {

	// Add CORS headers for preflight request
	if r.Method == "OPTIONS" {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET")
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Add CORS headers for actual request
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	mu.Lock()
	defer mu.Unlock()

	response, err := json.Marshal(leaderboard)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}

func calculateRank(points int) int {
	rank := 1
	for _, player := range players {
		if player.Points > points {
			rank++
		}
	}
	return rank
}

func formatTime(seconds int) string {
	duration := time.Duration(seconds) * time.Second
	return fmt.Sprintf("%02d:%02d", int(duration.Minutes()), int(duration.Seconds())%60)
}
