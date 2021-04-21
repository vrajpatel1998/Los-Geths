package main

import (
	"net/http"
	"encoding/json"
	"strconv"
)

type GetSwipes struct {
	ID     int      `json:"userID"`
	Swipes []string `json:"swipes"`
}

/*************************************
 * Send Swipes                       *
 * This aggregates swipes for a room *
 *************************************/
func SendSwipes(w http.ResponseWriter, r *http.Request) {
	// Check that the payload is valid
	id, swipes := checkInput(w, r)
	if swipes == nil { // invalid input
		return
	}
	// Get room
	roomCode := r.URL.Path[len("/send-swipes/"):]
	getRoom, exist := LookupRoom(roomCode, w)
	if !exist {
		return
	}
	room := *getRoom
	defer room.Lock.Unlock()
	Info("Reciving Swipes " + roomCode)

	/* Preconditions checked */
	// Loop through all the swipes (only yes swipes are inputs)
	for _, restID := range swipes {
		rest, exist := room.Votes[restID]
		if !exist {
			Print("Restaurant does not exist - Room: " + roomCode + ", Restaurant: " + restID)
			w.WriteHeader(403)
			Rooms[roomCode] = room
			return
		}

		if (rest & (0x1 << (id - 1))) != 0 {
			Print("Duplicate Votes - Room: " + roomCode + ", Restaurant: " + restID + ", Participant: " + strconv.Itoa(id))
		} else {
			room.Votes[restID] = rest | (0x1 << (id - 1))
		}
	}
	Rooms[roomCode] = room
	w.WriteHeader(200)
}

// Parses and checks for valid inputs
func checkInput(w http.ResponseWriter, r *http.Request) (int, []string) {
	// Parse input
	var swipes GetSwipes
	err := json.NewDecoder(r.Body).Decode(&swipes)
	if err != nil {
		error := ErrorMsg{
			"Missing body (ID and restaurants swiped right on)",
		}
		w.WriteHeader(400)
		json.NewEncoder(w).Encode(error)
		return 0, nil
	}

	// Check for a valid ID
	if swipes.ID <= 0 || swipes.ID > 32 {
		Print("User has invalid ID: " + strconv.Itoa(swipes.ID))
		error := ErrorMsg{
			"This is not a valid ID for this room",
		}
		w.WriteHeader(403)
		json.NewEncoder(w).Encode(error)
		return 0, nil
	}
	return swipes.ID, swipes.Swipes
}