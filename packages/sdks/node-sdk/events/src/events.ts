class Events {
  private apiEndpoint: string;
  private publicKey: string;
  private static recentEvents: Map<string, number> = new Map();
  private static eventTimeout: number = 1000; // 1 second timeout for duplicate events

  constructor(apiEndpoint: string, publicKey: string) {
    this.apiEndpoint = apiEndpoint;
    this.publicKey = publicKey;
  }

  private async handleInvoke(eventID: string, payload: object): Promise<void> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'hs-public-key': this.publicKey,
        },
        body: JSON.stringify({
          eventKey: eventID,
          metadata: payload,
        }),
      });
      
      if (!response.ok) {
        console.error('🚀 Hypership Analytics - Failed to log event');
      }

      console.log('Event logged successfully', {
        eventID,
        payload
      });
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }

  public async invoke(eventID: string, payload: object): Promise<void> {
    const currentTime = Date.now();
    const lastEventTime = Events.recentEvents.get(eventID);

    if (lastEventTime && currentTime - lastEventTime < Events.eventTimeout) {
      // Skip duplicate events
      return;
    }

    Events.recentEvents.set(eventID, currentTime);
    await this.handleInvoke(eventID, payload);

    setTimeout(() => Events.recentEvents.delete(eventID), Events.eventTimeout);
  }
}

export default Events;
