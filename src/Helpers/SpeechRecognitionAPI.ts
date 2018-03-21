/* ==========================================================================
 * Helper for the browser speechRecognitionAPI
 * Reference for Speech Recognition API here:
 * https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/SpeechRecognition
 *
 * @project: React Speech App
 * @author: Andre Goncalves (andre@andregoncalves)
 * @copyright: 2018 Andre Gocalves
 * ==========================================================================
 */
class SpeechRecognitionAPI {
  private api: any;
  private expects: string;

  public onResult: any;
  public onError: any;
  public onEnd: any;
  public onAudioEnd: any;

  constructor () {
    if ('speechRecognition' in window) {
      this.api = new (window as any).speechRecognition();
    }
    else if ('webkitSpeechRecognition' in window) {
      this.api = new (window as any).webkitSpeechRecognition();
    }

    this._subscribeEvents();
  }

  private _subscribeEvents = () => {
    this.api.onstart = (e: Event) => console.log(`Starting Speech Recognition with ${this.api.language}`);
    this.api.onerror = (e: Event) => console.error('Speech Recognition Error', e);
    this.api.onresult = this._onResult;
    this.api.onaudioend = (e: Event) => {
      if (this.onAudioEnd) {
        this.onAudioEnd();
      }
    };
    this.api.onnomatch = (e: Event) => this.api.onend(e);
    this.api.onend = (e: Event) => {
      if (this.onEnd) {
        this.onEnd();
      }
    };
  }

  private _onResult = (e: SpeechRecognitionEvent) => {
    const firstResult = e.results[0];
    const score: number = firstResult[0].confidence;
    let transcript: string = firstResult[0].transcript.toLowerCase();
    let expects: string = this.expects;

    transcript = this._removePunctuation(transcript);
    expects    = this._removePunctuation(expects);

    console.log(`Matching '${transcript}' with '${expects}' - confidence level ${score}`);

    const result: number = (score > 0.5 && transcript === expects) ? score : 0;

    if (this.onResult) {
      this.onResult(result);
    }
  }

  setLanguage (langCode: string) {
    this.api.language = langCode;
    this.api.lang = langCode;
    console.log(`Setting speech recognition API language to ${langCode}`);
  }

  compareWith (phrase: string): SpeechRecognitionAPI {
    this.expects = phrase;
    return this;
  }

  start () {
    this.api.start();
  }

  stop () {
    this.api.stop();
  }

  private _removePunctuation = (str: string) => str.replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|’|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g, '');
}

export default SpeechRecognitionAPI;
