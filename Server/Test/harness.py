import random
import requests
import unittest
import time # sleep
import threading
from client import Client

class Tests(unittest.TestCase):

	restIDs = ["ChIJG1TkZnC7woARugv6xt1PXnQ", "ChIJOYLLA6C8woAR_kAWoV3ofq0",
		"ChIJkRk48127woARG4kwAcoR7ds", "ChIJ0yyciV-7woARbw2QYzuVcUg",
		"ChIJAw8o2mC7woARLkkp7BBsPUw", "ChIJdQxLNGe7woARuCQEu8htn1o",
		"ChIJs1BC7YG8woARofdzE__xr0A", "ChIJ13tinVDHwoAR8KZVDfgB5o0",
		"ChIJ67Z6v2-7woARqnucvxyLAaA", "ChIJn7LK9V27woARGqtd0uQBerY",
		"ChIJzxUzqV27woARWlNDFudzoOk", "ChIJg9BkeqC8woARNfLi6xPS8-g"]

	###########
	# Helpers #
	###########
	def name (self, name):
		print("\x1b[1;3;4;96;45m", name, "\x1b[0m")

	def joinRoomHelper (self, resp, http, duration):
		self.assertEqual(resp['http'], http)
		if http <= 201:
			self.assertEqual(resp['duration'], duration)

	def create (self, duration):
		client = Client()
		results = client.createRoom(duration)
		self.joinRoomHelper(results, 201, duration)
		return client

	def join (self, code, http, duration):
		client = Client(code)
		results = client.joinRoom(duration)
		self.joinRoomHelper(results, http, duration)
		return client

	# Assume the ready room does not time out
	def ready (self, client, timeout=5, expires=False):
		self.assertEqual(client.readyRoom(timeout), expires)

	def swipes (self, client, http, swipes):
		httpCode = client.sendSwipes(swipes)
		self.assertEqual(httpCode, http)

	def decideHelper (self, client, http, expWinner):
		actWinner, httpCode = client.decide()
		self.assertEqual(httpCode, http)
		if httpCode != 200:
			return
		for i in expWinner: # to have multiple with the same number swiped on
			if actWinner == i:
				return
		self.assertEqual(actWinner, expWinner[0])

	def decide (self, clients, http, expWinner):
		threads = []
		for client in clients:
			thread = threading.Thread(target = self.decideHelper, args = [client, http, expWinner])
			threads.append(thread)
			thread.start()

		for thread in threads:
			thread.join()

	################
	# Actual Tests #
	################
	# Create a few rooms
	def test_create (self):
		self.name("Create")
		for i in range(10):
			self.create((i + 1) * 100)

	# Have some people join a room
	def test_create_join(self):
		self.name("Create and Join")
		clients = []
		clients.append(self.create(300))
		for i in range(4): # add 4 more people for a total of 5
			clients.append(self.join(clients[0].code, 200, 300))

	def test_simple (self):
		self.name("Simple")
		# Add some clients
		clients = []
		clients.append(self.create(200))
		for i in range(4):
			clients.append(self.join(clients[0].code, 200, 200))
		self.assertEqual(clients[4].ID, 5)

		# Add swipes
		self.swipes(clients[0], 200, self.restIDs[0:2])
		self.swipes(clients[4], 200, self.restIDs[1:3])
		self.decide(clients, 200, [self.restIDs[1]])

	def test_medium (self):
		self.name("Medium")
		clients = []
		clients.append(self.create(100))
		for i in range(9):
			clients.append(self.join(clients[0].code, 200, 100))
		random.seed(10)
		for j in range(100):
			self.swipes(clients[random.randint(0, 9)], 200,
				[self.restIDs[random.randint(1, 3)],
				 self.restIDs[random.randint(2, 5)]])
		self.decide(clients, 200, self.restIDs[1:6])


	def test_hard (self): # it's probably not that hard, just a lot of requests
		self.name("Hard")
		clients = []
		clients.append(self.create(500))
		for i in range(16):
			clients.append(self.join(clients[0].code, 200, 500))
		random.seed(32)
		for j in range(32):
			swipes = []
			for k in range(4):
				swipes.append(self.restIDs[random.randint(0, 9)])
			self.swipes(clients[random.randint(0, 16)], 200, swipes)

		self.decide(clients, 200, self.restIDs)


	# Can the server handle a single user vote multiple times
	def test_multivote (self):
		self.name("Multivote")
		clients = []
		clients.append(self.create(300))
		for i in range(3):
			clients.append(self.join(clients[0].code, 200, 300))
		self.swipes(clients[1], 200, self.restIDs[2:5])
		self.swipes(clients[2], 200, self.restIDs[1:3])
		self.swipes(clients[1], 200, self.restIDs[3:7])
		self.swipes(clients[1], 200, self.restIDs[3:5])
		self.decide(clients,    200, [self.restIDs[2]])

	def test_timeout (self):
		self.name("Timeout")
		clients = []
		clients.append(self.create(30))
		for i in range(4):
			clients.append(self.join(clients[0].code, 200, 30))
		random.seed(127)
		for j in range(6):
			swipes = []
			for k in range(2):
				swipes.append(self.restIDs[random.randint(0, 9)])
			self.swipes(clients[random.randint(0, 4)], 200, swipes)

		self.decide(clients[1:], -1, self.restIDs)

	###########################
	# A little error checking #
	###########################
	def test_failJoinRoom (self):
		self.name("Fail Join")
		client1 = self.create(300)
		self.join("YEEET", 404, 0)
		for i in range(31): # should fill it up
			self.join(client1.code, 200, 300)
		self.join(client1.code, 403, 0) # full room

		client2 = Client("HMM")
		self.swipes(client2, 403, ["fns", "soup"])
		# Client 2 isn't in the room, but what if it was?
		client2.code = client1.code

	def test_noSwipesDecide (self):
		self.name("No Swipes Decide")
		client1 = self.create(10)
		self.decideHelper(client1, 500, [])

	def test_failSwipes (self):
		self.name("Fail Swipes")
		client1 = self.create(500)
		self.swipes(client1, 403, ["fns", "medE"]) # mediocre Eats

		# Client 2, but what if we change to an invalid ID
		client2 = self.join(client1.code, 200, 500)
		client2.ID = 4
		self.swipes(client2, 403, ["medE"])
		self.swipes(client1, 200, self.restIDs[8:10])
		client3 = Client(client1.code)
		self.decide([client1, client2, client3], 200, self.restIDs[8:10])

	# This is trying with malformed requests
	def test_missing_things (self):
		self.name("Missing Things (Byzantine inspired)")
		url = "http://localhost:8080/" # changing the url to point things at
		                               # the wrong endpoints

		# timer with NaN value
		result = requests.post(url + "create-room", json = {'timer':'time'})
		self.assertEqual(result.status_code, 400)

		# trying to GET on a POST endpoint
		result = requests.get(url + "create-room")
		self.assertEqual(result.status_code, 400)

		# trying to GET with no room code
		result = requests.get(url + "join-room/")
		self.assertEqual(result.status_code, 404)


########
# Main #
########
if __name__ == "__main__":
	unittest.main()
