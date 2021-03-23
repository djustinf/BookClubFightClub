import queue

class ClubQueue:

  def __init__(self):
    self.listeners = []

  def listen(self):
    q = queue.Queue(maxsize=5)
    self.listeners.append(q)
    return q

  def announce(self, msg):
    for i in reversed(range(len(self.listeners))):
      try:
        self.listeners[i].put_nowait(msg)
      except queue.Full:
        # assume they've stopped listening
        del self.listeners[i]