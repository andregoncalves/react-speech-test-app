/* ==========================================================================
 * Interface to Google Cloud Speech API
 *
 * @project: React Speech App
 * @author: Andre Goncalves (andre@andregoncalves)
 * @copyright: 2018 Andre Gocalves
 * ==========================================================================
 */
const CloudSpeechAPI = {
  ApiKey: 'AIzaSyB583zRApVuJefhnnvVEXr05UeuvYr7LdU',

  /*
   * blob: base 64 encoded FLAC audio file as blob
   * sampleRate: audio sample rate, ex: 44100
   * language: language code, ex: en-US
   * alternatives: number of possible alternatives to display
   */
  sendRequest (blob: Blob, sampleRate: string, language: string, alternatives: number = 1) {
    // use FileReader to convert Blob to base64 encoded data-URL
    const reader = new (window as any).FileReader();

    reader.readAsDataURL(blob);

    reader.addEventListener('load', () => {
      let data = undefined;
      //only use base64-encoded data, i.e. remove meta-data from beginning:
      const audioData = reader.result.replace(/^data:audio\/flac;base64,/, '');

      data = {
        config: {
          encoding: 'FLAC',
          sampleRateHertz: sampleRate,
          languageCode: language,
          maxAlternatives: alternatives,
        },
        audio: { content: audioData },
      };

      let url = 'https://speech.googleapis.com/v1/speech:recognize';
      url = url + `?key=${this.ApiKey}`;

      fetch(url, {
        body: JSON.stringify(data),
        method: 'POST',
        mode: 'cors',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch(ex => console.error(ex));
    });
  },
};

export default CloudSpeechAPI;
