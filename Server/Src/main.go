package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
)

var   seed     = 1
const CODE_LEN = 4 // code is room code

func Hash () (string) {
	bytes := make([]byte, CODE_LEN)
	for i := 0; i < CODE_LEN; i++ {
		//LCG if it is too small
		if (seed < 0x00080000) {
			seed = 3 * seed + 0x09
		}
		// LSFR
		seed ^= seed >> 11
		seed ^= seed << 6
		seed ^= seed >> 15
		seed ^= seed << 10
		bytes[i] = byte(seed & 0xff)
		//Only allow 0-9, A-Z, and a-z in the code
		if (bytes[i] < 48 || bytes[i] > 57) && (bytes[i] < 65 || bytes[i] > 90) && (bytes[i] < 97 || bytes[i] > 122) {
			i = i - 1
		}
	}
	return string(bytes)
}

func setArgs(args [2]byte) {
	for _, char := range args {
		switch (char) {
			case 's':
				Verbose = 0
			// Default verbosity is 1
			case 'v':
				Verbose = 2
			case 'V':
				Verbose = 3
			case 'D': // Debug, every connection is shown
				Verbose = 4
			case 'p':
				Production = true
			case ' ':
				Info("Good morning!")
			default:
				Error("Option" + string(char) + "not recognized")
				Usage()
		}
	}
}

func parseArgs(args []string) (int) {
	var opt [2]byte
	opt[0], opt[1] = ' ', ' '
	var port string
	if len(args) == 2 {
		port = args[1]
	} else if len(args) == 3 {
		if args[1][0] == '-' {
			opt[0] = args[1][1]
			port = args[2]
		} else {
			opt[0] = args[2][1]
			port = args[1]
		}
	} else if len(args) == 4 {
		if args[1][0] != '-' {
			port = args[1]
			opt[0], opt[1] = args[2][1], args[3][1]
		} else if args[2][0] != '-' {
			port = args[2]
			opt[0], opt[1] = args[1][1], args[3][1]
		} else {
			port = args[3]
			opt[0], opt[1] = args[1][1], args[2][1]
		}
	} else {
		Usage()
	}
	setArgs(opt)
	portNum, err := strconv.Atoi(port)
	if err != nil {
		Usage()
	}
	Start(portNum)
	return portNum
}

func main () {
	port := parseArgs(os.Args)

	// Set up the map for rooms
	Initialize()

	http.HandleFunc("/create-room",  CreateRoom)
	http.HandleFunc("/join-room/",   JoinRoom)
	http.HandleFunc("/ready/",       ReadyUp)
	http.HandleFunc("/send-swipes/", SendSwipes)
	http.HandleFunc("/decide/",      Results)
	log.Fatal(http.ListenAndServe(":" + strconv.Itoa(port), nil))
}
