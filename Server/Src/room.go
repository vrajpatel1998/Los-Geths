package main

import (
	"encoding/json"
	"net/http"
	"sync"
)

type Room struct {
	NumPeople   int
	Restaurants []Restaurant
	Votes       map[string]int
	Timer       int
	Winner      Decision
	Lock        *sync.Mutex
	Ready       int
	ReadyCond   *sync.Cond
	Decide      int
	DecideCond  *sync.Cond
}

type Restaurant struct { // comments are the name in the struct
	ID       string   `json:"restID"`   //PlaceID
	Name     string   `json:"name"`     //Name
	Location string   `json:"location"` //FormattedAddress
	Price    int      `json:"price"`    //PriceLevel
	Rating   float32  `json:"rating"`   //Rating
	ImgList  [][]byte `json:"imgList`   // Location of directory holding the images for a restaurant. Images are labled 0.jpeg, 1.jpeg... 9.jpeg
}

// Structs for Messages, encoded in JSON
type ErrorMsg struct {
	Error string `json:"error"`
}

// Global map of all the Rooms
var Rooms map[string]Room

func Initialize() {
	Rooms = make(map[string]Room)
}

func LookupRoom(roomCode string, w http.ResponseWriter) (*Room, bool) {
	room, exist := Rooms[roomCode]
	if !exist {
		Print("User operation on non-existent room: " + roomCode)
		w.WriteHeader(404)
		error := ErrorMsg{
			"Room does not exist",
		}
		json.NewEncoder(w).Encode(error)
		return nil, false
	}
	room.Lock.Lock()
	room, _ = Rooms[roomCode]
	return &room, true

}
