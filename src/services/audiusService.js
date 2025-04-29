class AudiusService {
  constructor() {
    this.discoveryProviders = [
      'https://discoveryprovider.audius.co',
      'https://discoveryprovider3.audius.co',
      'https://discoveryprovider2.audius.co'
    ];
    this.currentProvider = 0;
    this.appName = 'Feelody';
  }

  async getEndpoint() {
    // Try each provider in sequence if the current one fails
    const initialProvider = this.currentProvider;
    let attempts = 0;

    while (attempts < this.discoveryProviders.length) {
      try {
        const provider = this.discoveryProviders[this.currentProvider];
        // Test the provider with a simple request
        const response = await fetch(`${provider}/v1/tracks/trending?app_name=${this.appName}&limit=1`);
        if (response.ok) {
          return provider;
        }
      } catch (error) {
        console.warn(`Provider ${this.discoveryProviders[this.currentProvider]} failed:`, error);
      }
      
      // Try next provider
      this.currentProvider = (this.currentProvider + 1) % this.discoveryProviders.length;
      attempts++;
    }

    // Reset to initial provider if all failed
    this.currentProvider = initialProvider;
    throw new Error('All Audius providers failed');
  }

  async searchTracks(query, limit = 10) {
    try {
      const endpoint = await this.getEndpoint();
      const response = await fetch(
        `${endpoint}/v1/tracks/search?query=${encodeURIComponent(query)}&limit=${limit}&app_name=${this.appName}`
      );
      if (!response.ok) throw new Error('Search request failed');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  }

  async getStreamUrl(trackId) {
    try {
      const endpoint = await this.getEndpoint();
      const response = await fetch(
        `${endpoint}/v1/tracks/${trackId}/stream?app_name=${this.appName}`,
        { redirect: 'follow' } // Ensure we follow redirects
      );
      
      if (!response.ok) throw new Error('Failed to get stream URL');

      // If we got redirected, use the final URL
      const finalUrl = response.url;
      console.log('Final stream URL:', finalUrl);
      
      // Verify the URL is accessible
      const testResponse = await fetch(finalUrl, { method: 'HEAD' });
      if (!testResponse.ok) throw new Error('Stream URL not accessible');

      return finalUrl;
    } catch (error) {
      console.error('Error getting stream URL:', error);
      return null;
    }
  }
}

const audiusService = new AudiusService();
export default audiusService;