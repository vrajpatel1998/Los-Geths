package main

import (
	"encoding/json"
	"net/http"
	"sync"
)

type JoinedRoom struct {
	Code        string       `json:"roomCode"`
	ID          int          `json:"userID"`
	Timer       int          `json:"duration"`
	Restaurants []Restaurant `json:"restaurants"`
}

type NewRoom struct {
	Timer    int    `json:"timer"`
	MaxPrice int    `json:"maxPrice"`
	Lat      string `json:"latitude"`
	Long     string `json:"longitude"`
}

/***********************************************************************
 * Create Room                                                         *
 * Given a timer, it creates a room, including querying the Places API *
 ***********************************************************************/
func CreateRoom(w http.ResponseWriter, r *http.Request) {
	// Check that the user sent valid data
	var createRoom NewRoom
	err := json.NewDecoder(r.Body).Decode(&createRoom)
	if err != nil {
		error := ErrorMsg{
			"Missing body (duration of swiping)",
		}
		w.WriteHeader(400)
		json.NewEncoder(w).Encode(error)
		return
	}

	// Create a new room and make sure it doesn't conflict
	roomCode := Hash()
	_, exist := Rooms[roomCode]
	if exist {
		Error("Conflicting Room Codes (" + roomCode + "), please use a better hash function")
		w.WriteHeader(500)
		return
	}
	Info("Created room " + roomCode)

	// Get info for the room
	// and set up all the locks and data
	list, voteMap := GetList(createRoom)
	lock := sync.Mutex{}
	readyCond := sync.NewCond(&lock)
	decideCond := sync.NewCond(&lock)
	room := Room{
		NumPeople:   0,
		Restaurants: list,
		Votes:       voteMap,
		Timer:       createRoom.Timer,
		Winner:      Decision{},
		// Locks and cond variables
		Lock:       &lock,
		Ready:      0,
		ReadyCond:  readyCond,
		Decide:     0,
		DecideCond: decideCond,
	}

	// Respond
	room.Lock.Lock()
	resp := respondRoom(roomCode, room)
	w.WriteHeader(201)
	json.NewEncoder(w).Encode(resp)
}

/**************************************************************************
 * Join Room                                                              *
 * Given a room code, adds a user to the room, returning data gotten from *
 * the create request                                                     *
 **************************************************************************/
func JoinRoom(w http.ResponseWriter, r *http.Request) {
	// Find the room or return if it does not exist
	roomCode := r.URL.Path[len("/join-room/"):]
	getRoom, exist := LookupRoom(roomCode, w)
	if !exist {
		return
	}
	room := *getRoom
	Info("Joining room " + roomCode)

	// Check if the room is full
	if room.NumPeople > 31 {
		Warn("Full room " + roomCode + ", do we want larger Rooms?")
		w.WriteHeader(403)
		error := ErrorMsg{
			"Room is full",
		}
		json.NewEncoder(w).Encode(error)
		return
	}

	/* Preconditions checked */
	resp := respondRoom(roomCode, room)

	w.WriteHeader(200)
	json.NewEncoder(w).Encode(resp)
}

// Increments the room and packages the response to the user
func respondRoom(roomCode string, room Room) JoinedRoom {
	// Increment number of people and save it
	room.NumPeople += 1
	Rooms[roomCode] = room
	room.Lock.Unlock()

	// Respond to the user
	resp := JoinedRoom{
		Code:        roomCode,
		ID:          room.NumPeople,
		Timer:       room.Timer,
		Restaurants: room.Restaurants,
	}
	return resp
}
