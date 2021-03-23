from .club_queue import ClubQueue

class ClubOrchestrator:

  def __init__(self):
    self.qs = {}

  def addClub(self, club):
    if club not in self.qs:
      self.qs[club] = ClubQueue()

  def addListener(self, club):
    self.addClub(club)
    return self.qs[club].listen()
  
  def announceClub(self, club, msg):
    self.addClub(club)
    self.qs[club].announce(msg)