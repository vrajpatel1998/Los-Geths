# Timothee (the server)

- [Overview](#Overview)
- [Installation](#Building-the-Server)
- [Todo](#To-Do)
- [Interface](#Interfacing-With-the-Server)
- [Sources](#Sources)

----

## Overview

This is a server that allows a group to connect in a simple way. To see the interface, you can go to the [interface](#Interfacing-With-the-Server). In the interface, each request type has what the request needs (request type, payload if any, and endpoint), and returns the results for each possible status code (either error or data), as well as an example curl request.

---

## Building the Server

Make sure you have go installed (if not, you can get it [here](https://golang.org/)). To install dependencies and build the server:
```bash
cd Src/
go get googlemaps.github.io/maps
go build
```

To run the server:
```bash
./Src [-svVD] [-p] port
```
- `port` is the port number you want the server to run on,
- `-s` only fatal errors are shown
- including no flag means all errors are shown
- `-v` all errors and warnings show up
- `-V` all errors, warnings, and user errors show up
- `-D` everything above, along with a message every time an endpoint is hit
- `-p` production mode (uses real API calls)

---

## To Do

- [X] Overrides for waiting rooms
- [ ] Timeouts for waiting rooms
- [X] Solve race conditions?
- [ ] Extra waiting room tests (for ready room/override/timeout)
- [X] Waiting Room
- [ ] Docker container
- [X] Integration with the Google Places API

**Future**

- Garbage collection of old rooms

---

## Interfacing With the Server

### Restaurant Data

|JSON name |Data contained       |Data Type  |
|----------|---------------------|-----------|
|`restID`  |ID                   |string     |
|`name`    |Name                 |string     |
|`location`|Address              |string     |
|`price`   |Cost level           |int (0-4)  |
|`rating`  |Aggregate user rating|float (0-5)|

### Creating a Room

**Request:**

|Option  |Data              |
|--------|------------------|
|Endpoint|`/create-room`    |
|Request |POST              |
|Payload |<ul><li>Time limit `timer`</li><li>Latitude `latitude`</li><li>Longitude `longitude`</li><li>Maximum Price range `maxPrice`</li></ul>|

**Return Value:**

|Code|Data|Error   |
|----|----|--------|
|201 |<ul><li>Room Code `roomCode`</li><li>ID `userID`</li><li>Timer `duration`</li><li>list of restaurants `restaurants`</li></ul>||
|500 |    |Internal|

**Example Curl Request**

```bash
curl --request   POST\
     --header    "Content-Type: application/json"\
     --write-out "%{http_code}\n"\
     --data      '{"timer":1200}'\
     http://127.0.0.1:8080/create-room
```

### Joining a Room

**Request:**

|Option  |Data|
|--------|----|
|Endpoint|`/join-room/[room-code]`|
|Request |GET |
|Payload |    |

**Return Value:**

|Code|Data|Error|
|----|----|-----|
|200 |<ul><li>Room Code `roomCode`</li><li>ID `userID`</li><li>Timer `duration`</li><li>list of restaurants `restaurants`</li></ul>||
|403 |    |Room is full|
|404 |    |Room does not exist|

**Example Curl Request**

```bash
curl --request   GET\
     --write-out "%{http_code}\n"\
     http://127.0.0.1:8080/join-room/99SXzJ1fea
```

### Ready Room

**Request:**

|Option  |Data|
|--------|----|
|Endpoint|`/ready/[room-code]`|
|Request |GET |
|Payload |    |

This next option is for the host to ready up the room. Any user that joins after the host has readied up will immediately move to the next screen.

|Option  |Data   |
|--------|--------|
|Endpoint|`/ready/[room-code]`|
|Request |POST    |
|Payload |`userID`|

**Return Value:**

|Code|Data|Error|
|----|----|-----|
|200 |Keeps connection open and responds host readies up||
|404 |    |Room does not exist|

```bash
curl --request   GET\
     --write-out "%{http_code}\n"\
     http://127.0.0.1:8080/ready/99SXzJ1fea
```

### Sending swipes

**Request:**

|Option  |Data|
|--------|----|
|Endpoint|`/send-swipes/[room-code]`|
|Request |POST|
|Payload |<ul><li>ID `userID`</li><li>List of Restaurant IDs swiped yes on `swipes`</li></ul>|

**Return Value:**

|Code|Data|Error|
|----|----|-----|
|200 |    ||
|403 |    |Restaurant ID does not exist in the room|
|404 |    |Room does not exist|

**Example Curl Request**

```bash
curl --request   POST\
     --header    "Content-Type: application/json"\
     --write-out "%{http_code}\n"\
     --data      '{"user-id":12,"swipes":[1,3,6,7]}'\
     http://127.0.0.1:8080/send-swipes/99SXzJ1fea
```

### Getting decision

**Request:**

|Option  |Data|
|--------|----|
|Endpoint|`/decide/[room-code]`|
|Request |GET |
|Payload |    |


**Return Value:**

|Code|Data|Error|
|----|----|-----|
|200 |<ul><li>Winner `winner`</li><li>Address `address`</li></ul>||
|404 |    |Room does not exist|
|500 |    |No swipes were recieved before decision|


**Example Curl Request**

```bash
curl --request   GET\
     --write-out "%{http_code}\n"\
     http://127.0.0.1:8080/decide/99SXzJ1fea
```

---

## Sources

**Golang**
- [Google's Places](https://pkg.go.dev/googlemaps.github.io/maps) or [here](https://github.com/googlemaps/google-maps-services-go)
- A lot from the [official website](https://golang.org/): [fmt](https://golang.org/pkg/fmt/), [http](https://golang.org/pkg/net/http/), [os](https://golang.org/pkg/os/), [sync](https://golang.org/pkg/sync/#Mutex) (mutexes), [time](https://golang.org/pkg/time/)
- [Mutexes](https://golangdocs.com/mutex-in-golang)
- [Condition Variables](https://stackoverflow.com/questions/36857167/how-to-correctly-use-sync-cond)

**Python**
- [classes](https://docs.python.org/3/tutorial/classes.html)
- [client](https://github.com/palvaro/CSE138-Fall20/blob/assignment4/client.py), [harness](https://github.com/palvaro/CSE138-Fall20/blob/assignment4/test_public.py) from CSE 138
- [random](https://docs.python.org/3/library/random.html)
- [requests](https://requests.readthedocs.io/en/master/)
- [unittest](https://docs.python.org/3/library/unittest.html)
- [Thread](https://docs.python.org/3/library/threading.html) and [threads with unittest](https://stackoverflow.com/questions/40447290/python-unittest-and-multithreading)

**Other** (because citational politics)
- [HTTP Codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
- [Markdown](https://www.markdownguide.org)
