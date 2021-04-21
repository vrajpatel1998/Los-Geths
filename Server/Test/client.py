import requests

url = "http://localhost:8080/"

class Client():
	def __init__ (self, code=""):
		self.code = code
		self.ID   = 0
		self.Rest = []

	def createRoom (self, timer):
		result = requests.post(url + "create-room", json = {'timer':timer})
		return self.formatJoinRoom(result)

	def joinRoom (self, timer):
		result = requests.get(url + "join-room/" + self.code)
		return self.formatJoinRoom(result)

	# returns if the request timed out
	def readyRoom (self, timeout=5):
		try:
			result = requests.get(url + "ready-room/" + self.code, timeout=timeout)
		except requests.exceptions.Timeout:
			return True
		return False

	def sendSwipes (self, swipes):
		result = requests.post(url + "send-swipes/" + self.code, json = {'userID':self.ID, 'swipes':swipes})
		return result.status_code

	def decide (self):
		try:
			result = requests.get(url + "/decide/" + self.code, timeout=2)
		except requests.exceptions.Timeout:
			return "missing", -1
		if result.status_code == 200:
			json = result.json()
			return json['winner'], 200
		return "missing", result.status_code

	def formatJoinRoom (self, result):
		json = result.json()
		if 'roomCode' in json:
			self.code = json['roomCode']
		if 'userID' in json:
			self.ID = json['userID']
		if 'restaurants' in json:
			self.Rest =  json['restaurants']
		json['http'] = result.status_code

		return json
