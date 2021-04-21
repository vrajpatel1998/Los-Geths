package main

import (
	"fmt"
	"os"
)

// Colors :)
const RED    = "\x1b[31m"
const GREEN  = "\x1b[32m"
const BLUE   = "\x1b[34m"
const PURPLE = "\x1b[35m"
const CYAN   = "\x1b[96m"
const UNSET  = "\x1b[0m"

/*
 * Verbosity Modes
 * 0 - Fatal Errors only
 * 1 - Errors
 * 2 - Warnings
 * 3 - User issues too
 * 4 - Debug, messages for all connections
 */
var Verbose = 1

func Info (str string) {
	if Verbose == 4 {
		fmt.Fprintf(os.Stdout, "[%sINFO%s]:  %s\n", GREEN, UNSET, str)
	}
}

func Print (str string) {
	if Verbose >= 3 {
		fmt.Fprintf(os.Stdout, "[%sUERR%s]:  %s\n", BLUE, UNSET, str)
	}
}

func Warn (str string) {
	if Verbose >= 2 {
		fmt.Fprintf(os.Stderr, "[%sWARN%s]:  %s\n", PURPLE, UNSET, str)
	}
}

func Error (str string) {
	if Verbose >= 1 {
		fmt.Fprintf(os.Stderr, "[%sERROR%s]: %s\n", RED, UNSET, str)
	}
}

func Fatal (str string, exitCode int) {
	fmt.Fprintf(os.Stderr, "[%sFATAL%s]: %s\n", "\x1b[1;91m", UNSET, str)
	os.Exit(exitCode)
}

func Usage () {
	fmt.Fprintf(os.Stderr, "Usage: %s [-svVD] [-p] port\n", os.Args[0])
	fmt.Fprintf(os.Stderr, "\t\x1b[3m-s\x1b[0m silent\n")
	fmt.Fprintf(os.Stderr, "\t\x1b[3m-v\x1b[0m verbose\n")
	fmt.Fprintf(os.Stderr, "\t\x1b[3m-V\x1b[0m very verbose\n")
	fmt.Fprintf(os.Stderr, "\t\x1b[3m-D\x1b[0m debugging level verbosity\n")
	fmt.Fprintf(os.Stderr, "\t\x1b[3m-p\x1b[0m production mode (real API calls)\n")
	fmt.Fprintf(os.Stderr, "\t\x1b[3mport\x1b[0m port to run the server on\n")
	os.Exit(2)
}

func Start (port int) {
	fmt.Fprintf(os.Stdout, "%sStarting server on port %d\n", CYAN, port)
	fmt.Fprintf(os.Stdout, "Verbosity: ")
	switch (Verbose) {
	case 0:
		fmt.Fprintf(os.Stdout, "Quiet verbosity (only fatal errors)")
	case 1:
		fmt.Fprintf(os.Stdout, "Normal verbosity (including errors)")
	case 2:
		fmt.Fprintf(os.Stdout, "Verbose (including warnings)")
	case 3:
		fmt.Fprintf(os.Stdout, "Very verbose (including user errors)")
	case 4:
		fmt.Fprintf(os.Stdout, "Debugging level verbose (message every endpoint)")
	}
	fmt.Fprintf(os.Stdout, "\nProduction Mode: ")
	if Production {
		fmt.Fprintf(os.Stdout, "enabled (uses real API calls)")
	} else {
		fmt.Fprintf(os.Stdout, "disabled (uses mock API data)")
	}
	fmt.Fprintf(os.Stdout, "%s\n", UNSET)
}
