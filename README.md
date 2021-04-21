![logo.svg](assets/logo.svg)

# Los Gehts

|Los Gehts     |CSE 115A          |
|--------------|------------------|
|Ankur Mishra  |Release: Alpha    |
|Aria Diamond  |Version: 1.0      |
|Jonathan Amar |Revised: 3/9/2021 |
|Spencer Gurley|Hunger Harmony    |
|Vraj Patel    |SAVAJ DMAPG       |

### Installation

##### Backend

To build the server, golang is needed. You can install it [here](https://golang.org/dl/). To build the server:
```bash
cd Server/Src
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

##### Frontend

To build the frontend, you need [node](https://nodejs.org/en/download/) to install packages and Expo.
```bash
npm install -g expo-cli
npm install
```

To start expo, run `expo start`. You can then run it on an emulator, or if you install Expo Go on your phone and run it there.

### Product

Have you wanted to go eat with your friends, but couldn't decide where to go?

If you want a quick way to discover restaurants and decide with a group of friends on where to go. A group can get consensus on a restaurant to go to, with a bounded amount of time before a decision is made.

### Documentation

||Living Documents||
|-----|----|---|
|[Scrum Board](https://trello.com/invite/b/HrUWNCZX/fe7660c8b65422eaa0f254b92162533b/agile-sprint-board)|[Burnup Chart](https://docs.google.com/spreadsheets/d/1-vf5ZuhsJArLeOi4oFn8tWIePTQURwFhZY-5a8F2M6I/edit?usp=sharing)|[Team Working Agreement](https://docs.google.com/document/d/1n_9oafdGBJQFS49cpFHjY28V9A8JRD3xpxg14aub5aI/edit?usp=sharing)|

||Release Docs||
|-------|-----|----|
|Planning|[Release plan](https://docs.google.com/document/d/17SzmROXOXmMB7aSTAcV3qO_fZliFTb1DsbnPjqwwT20/edit?usp=sharing)|[Initial Presentation](https://docs.google.com/presentation/d/1s3zteTZ93tm04xrx72Ot5A7npYSPaLwx8S6WGHldLPI/edit?usp=sharing)|
|Post|[Source](https://github.com/jsamar17/los-geht-s)|[Final Presentation](https://docs.google.com/presentation/d/1l8hHNhHHqVrZwBNvXt7YKd0XjFuwvG2lefLNKSgxNDE/edit?usp=sharing)|
|Post part 2|[Prototype](https://docs.google.com/document/d/1IFDZqWxLcCKJNwl5iYnZF7mOOLCXOxe8ysG5qA6qGUE/edit?usp=sharing)|[Testing](https://docs.google.com/document/d/1fkcGg9xmFpGEoarK4VFfT01YUYr6dWrZdDaaoYyQEGM/edit?usp=sharing)|

|Sprint  |Plan|Report|
|:------:|----|------|
|1       |[plan](https://docs.google.com/document/d/1B6dHso8kiLSMdzi3YfBSkA00tFf2MYirUBrRE0jRXVY/edit?usp=sharing)|[report](https://docs.google.com/document/d/1AucboDgaf0plQjECIoR8EdqypQEH23H0q1C_u2Sga7I/edit?usp=sharing)|
|2       |[plan](https://docs.google.com/document/d/1aJO-Ga5tMzr_47RvIc8gNJX8kPG--GzTQDlyC2pRqKU/edit?usp=sharing)|[report](https://docs.google.com/document/d/1JIwI1etnIkyrE61JexSEMlFmT41rBK8lkFk5FiTWjHw/edit?usp=sharing)|
|3       |[plan](https://docs.google.com/document/d/193pM6-wmuRdb--det1hGdd5XoO3kUhf3hfoahaDf8eg/edit?usp=sharing)|[report](https://docs.google.com/document/d/1zmKe-Niap_7djkwjJBvwm4jt1ZTGBoGY_kQSpu8wdqw/edit?usp=sharing)|
|4       |[plan](https://docs.google.com/document/d/16ijHcJ2KISebOa-FqooE3Du71tqAb98s-1R9GVQzGJM/edit?usp=sharing)|[report](https://docs.google.com/document/d/1dDBWBzviqhyTHI35o_IcJQPykbIB3yJohyRdXIsmAVk/edit?usp=sharing)|

