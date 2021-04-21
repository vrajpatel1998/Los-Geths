package main

import (
	"encoding/json"
	"net/http"
)

type Override struct {
	UserID int `json:"userID"`
}

type Decision struct {
	Winner  string `json:"winner"`
	Address string `json:"address"`
}

/****************************************************
 * Ready Up                                         *
 * This manages people waiting in the ready up room *
 ****************************************************/
func ReadyUp(w http.ResponseWriter, r *http.Request) {
	// find room
	roomCode := r.URL.Path[len("/ready/"):]
	getRoom, exist := LookupRoom(roomCode, w)
	if !exist {
		return
	}
	room := *getRoom

	if r.Method == http.MethodGet {
		// Update number of ready people
		Info("Waiting at room: " + roomCode)
		if room.Ready < room.NumPeople {
			room.ReadyCond.Wait()
		}
	} else if r.Method == http.MethodPost {
		// Helper function that checks if the userID == 1
		if !checkAuthority(w, r) {
			return
		}
		Info("Starting room: " + roomCode)

		// Set to max for any future people to come in late
		room.Ready = 32
		Rooms[roomCode] = room
		room.ReadyCond.Broadcast()
	}
	room.Lock.Unlock()
	w.WriteHeader(200)
}

/**************************************************************************
 * Results                                                                *
 * This tallies the votes, only counting the votes once and returning the *
 * first value                                                            *
 **************************************************************************/
func Results(w http.ResponseWriter, r *http.Request) {
	// Get room
	roomCode := r.URL.Path[len("/decide/"):]
	getRoom, exist := LookupRoom(roomCode, w)
	if !exist {
		return
	}
	room := *getRoom
	Info("Deciding " + roomCode)

	/* Preconditions checked */
	// Have everyone wait so that everyone can get results at the same time
	if r.Method == http.MethodGet {
		// Increment Rooms
		room.Decide += 1
		Rooms[roomCode] = room
		if room.Decide < room.NumPeople {
			room.DecideCond.Wait()
		} else {
			room.DecideCond.Broadcast()
		}
	} else if r.Method == http.MethodPost {
		if !checkAuthority(w, r) {
			return
		}
		room.Decide = 32
		Rooms[roomCode] = room
		room.DecideCond.Broadcast()
	}

	room = Rooms[roomCode] // update the room to see if others already decided

	// Find the maximum voted for restaurant
	// (returning only the first maximum)
	winner := ""
	if room.Winner.Winner == "" { // Do we already have a winner?
		max := 0
		for id, vote := range room.Votes {
			if binCount(vote) > max {
				max = binCount(vote)
				winner = id
			}
		}

		if winner == "" {
			w.WriteHeader(500)
			Error("Results do not have any yes swipes, of which there should be")
			return
		}
		room.Winner = Decision{
			Winner: winner,
			Address: findAddress(room.Restaurants, winner),
		}
		Rooms[roomCode] = room
	}

	room.Lock.Unlock()

	json.NewEncoder(w).Encode(room.Winner)
}

/*
 * Helper Functions
 */
func checkAuthority(w http.ResponseWriter, r *http.Request) bool {
	var userID Override
	err := json.NewDecoder(r.Body).Decode(&userID)
	// Is there a body?
	if err != nil {
		w.WriteHeader(400)
		error := ErrorMsg{
			"Missing userID in body",
		}
		json.NewEncoder(w).Encode(error)
		return false
	}
	// does this person have the authority? This assumes that someone does
	// not give a false userID
	if userID.UserID != 1 {
		w.WriteHeader(403)
		error := ErrorMsg{
			"You do not have permission to override",
		}
		json.NewEncoder(w).Encode(error)
		return false
	}
	return true
}

// This counts the number of bits for each restaurant
// Each bit represents the vote of a user (and it is unique so that
// we can distinguish which user voted for what and not have duplicates)
func binCount(val int) int {
	count := 0
	for i := 0; i < 32; i++ {
		if (val & (0x1 << i)) > 0 {
			count++
		}
	}
	return count
}

func findAddress(rests []Restaurant, id string) string {
	if Production {
		return GetRestaurantAddress(id)
	} else {
		for _, rest := range rests {
			if rest.ID == id {
				return rest.Location
			}
		}
	}
	return "No restaurant found"
}