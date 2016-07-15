# wachschutz
A solution for the door problem we face in our hackerspace.

# hardware
- [ ] create fritzing diagram (@hoktaar)
- [ ] create prototype (@hoktaar, @divramod)
- [ ] write installscript for raspberry pi model b+ (@divramod)
- [ ]

# software

## architecture
- [ ] create a diagram (@divramod)

## server

### hardware (in progress, @divramod)
This server usally runs on a Raspberry Pi and enables us to read the states of the door locks. It also makes it possible to switch the door indicator lights.

### location (in progress, @divramod)
In Eberswalde we have spaces at different locations. So we need one public reachable server at every location where we want to track things. This location-server is publicly accessible and communicates with the hardware-server, which is not publicly accessible.

### www (todo, @divramod)
This server hosts the website, which enables us to see the current states of our locks. it can be hosted everywhere and accesses the location-server which works as api and gives back the information needed.

## client

### slack (todo)
A slack Integration which pushes the state changes of the doors/switches to slack.

### website (todo)
A website that shows all the information.

### wordpress (todo, @hoktaar)
A wordpress plugin, that enables us to show the states of the doors on our wordpress website.
