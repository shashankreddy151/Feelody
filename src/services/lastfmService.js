const MOOD_TAGS = {
  happy: ['happy', 'upbeat', 'feel good', 'party', 'sunshine'],
  exuberant: ['uplifting', 'euphoric', 'exciting', 'epic', 'triumphant'],
  energetic: ['energetic', 'power', 'workout', 'dance', 'adrenaline'],
  frantic: ['intense', 'fast', 'heavy', 'aggressive', 'rush'],
  anxious: ['melancholic', 'emotional', 'sad', 'atmospheric', 'dark ambient'],
  depression: ['dark', 'gloomy', 'sad', 'melancholy', 'downtempo'],
  calm: ['calm', 'relaxing', 'peaceful', 'ambient', 'meditation'],
  contentment: ['chill', 'mellow', 'smooth', 'easy listening', 'soft']
};

class LastFmService {
  constructor() {
    this.apiKey = process.env.REACT_APP_LASTFM_API_KEY;
    this.baseUrl = 'https://ws.audioscrobbler.com/2.0/';
    this.cache = new Map();
  }

  async makeRequest(params) {
    const queryParams = new URLSearchParams({
      ...params,
      api_key: this.apiKey,
      format: 'json',
      // Add parameter to ensure we get extended track info including images
      extended: 1
    });

    const url = `${this.baseUrl}?${queryParams}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getTracksByMood(mood, options = { limit: 30, page: 1 }) {
    try {
      const cacheKey = `${mood}-${options.page}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const tags = MOOD_TAGS[mood];
      if (!tags) return [];

      const trackPromises = tags.map(async tag => {
        const result = await this.makeRequest({
          method: 'tag.gettoptracks',
          tag,
          limit: Math.ceil(options.limit / tags.length),
          page: options.page
        });

        // Debug logging
        console.log('API Response for tag', tag, ':', result);
        
        if (!result.tracks || !result.tracks.track) {
          console.error('Invalid response structure for tag:', tag);
          return [];
        }

        return result.tracks.track;
      });

      const results = await Promise.all(trackPromises);
      const tracks = results.flat();
      console.log('All tracks before processing:', tracks);

      const tracksWithMetadata = await Promise.all(
        tracks.map(async track => {
          try {
            const trackInfo = await this.makeRequest({
              method: 'track.getInfo',
              artist: track.artist.name,
              track: track.name,
              autocorrect: 1
            });

            console.log('Track info for', track.name, ':', trackInfo);
            
            if (trackInfo.track && trackInfo.track.album) {
              return {
                ...track,
                image: trackInfo.track.album.image || track.image,
                album: trackInfo.track.album
              };
            }
            return track;
          } catch (error) {
            console.error('Error fetching track info:', error);
            return track;
          }
        })
      );
      
      const tracksWithScore = tracksWithMetadata.map(track => ({
        ...track,
        popularityScore: (parseInt(track.listeners) || 0) + (parseInt(track.playcount) || 0) / 1000
      }));

      const uniqueTracks = this.removeDuplicates(tracksWithScore);
      const sortedTracks = this.sortByPopularity(uniqueTracks);
      
      this.cache.set(cacheKey, sortedTracks);
      return sortedTracks;
    } catch (error) {
      console.error('Error in getTracksByMood:', error);
      return [];
    }
  }

  async getTrackInfo(track) {
    try {
      const trackInfo = await this.makeRequest({
        method: 'track.getInfo',
        artist: track.artist.name,
        track: track.name,
        autocorrect: 1
      });

      const similarTracks = await this.getSimilarTracks(track);
      return { ...trackInfo.track, similarTracks };
    } catch (error) {
      console.error('Error fetching track info:', error);
      return null;
    }
  }

  async getSimilarTracks(track, limit = 5) {
    try {
      const similar = await this.makeRequest({
        method: 'track.getSimilar',
        artist: track.artist.name,
        track: track.name,
        limit,
        autocorrect: 1
      });
      return similar.similartracks.track;
    } catch (error) {
      console.error('Error fetching similar tracks:', error);
      return [];
    }
  }

  async getArtistInfo(artistName) {
    try {
      const result = await this.makeRequest({
        method: 'artist.getInfo',
        artist: artistName,
        autocorrect: 1
      });
      return result;
    } catch (error) {
      console.error('Error fetching artist info:', error);
      return null;
    }
  }

  removeDuplicates(tracks) {
    const seen = new Set();
    return tracks.filter(track => {
      const key = `${track.artist.name}-${track.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  sortByPopularity(tracks) {
    return [...tracks].sort((a, b) => b.popularityScore - a.popularityScore);
  }

  clearCache() {
    this.cache.clear();
  }
}

const lastFmService = new LastFmService();
export default lastFmService;