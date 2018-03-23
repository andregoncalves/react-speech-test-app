/* ==========================================================================
 * Main entry component
 *
 * @project: React Speech App
 * @author: Andre Goncalves (andre@andregoncalves)
 * @copyright: 2018 Andre Goncalves
 * ==========================================================================
 */

import * as React from 'react';
import './Main.css';

import LanguageMenuView from './UI/LanguageMenuView';
import MainView from './UI/MainView';

import constants from '../Constants';
import CloudSpeechAPI from '../Helpers/SpeechApi';
import SpeechRecognitionAPI from '../Helpers/SpeechRecognitionAPI';
import MediaHelper from '../Helpers/MediaHelper';

const NO_RESULT = -1;
const FAILED_RESULT = 0;

enum AppViews { 'MAIN', 'LANGUAGES' }

interface AppProps {
  defaultLangCode: string;
}

interface AppState {
  result: number;
  view: AppViews;
  language: string;
  langCode: string;
  isRecording: boolean;
}

class App extends React.Component <AppProps, AppState> {
  private encoder: any;
  private mainView: MainView;
  private speechAPI: SpeechRecognitionAPI | undefined;
  private media: MediaHelper;

  constructor (props: AppProps) {
    super(props);

    // Default State
    this.state = {
      result: NO_RESULT,
      view: AppViews.MAIN,
      language: 'English',
      langCode: props.defaultLangCode,
      isRecording: false,
     };

    // Instantiate Media Devices Helper
    // Media devices helper handles all the WebAudio Streaming
    // and processing
    this.media = new MediaHelper();
  }

  componentDidMount () {

    // Instantiate web worker
    this.encoder = new Worker(constants.ASSETS_PATH + '/Worker.js');
    this.encoder.onmessage = this._onWorkerData;
    this.encoder.onmessageerror = (e: any) => console.error(e);
    this.encoder.onerror = (e: any) => console.error(e);

    if (constants.SUPPORTS_RECOGNITION_API) {
      this.speechAPI = new SpeechRecognitionAPI();

      // Recognition was successful
      // result is number representing the confidence in the result
      this.speechAPI.onResult = (result: number) => this.setState({ result });

      // Recognition Complete
      // A timeout is needed because sometimes the API doesn't
      // return any value, so, we wait 500ms to make sure the
      // the recognition process has completed
      this.speechAPI.onEnd = () => {
        if (this.state.isRecording) {
          this._stopRecording();

          setTimeout(() => {
            if (this.state.result === NO_RESULT) {
              this.setState({ result: FAILED_RESULT });
            }
          }, 500);
        }
      };

      this.speechAPI.onAudioEnd = () => {
        if (this.state.isRecording) {
          console.log('%c[APP] Automatic silence detected via SpeechRecognition API', 'color: brown; background: yellow');
          this._stopRecording();
        }
      };
    }
  }

  _onWorkerData = (e: IWorkerDataEvent) => {
    const cmd = e.data.cmd;

    if (cmd === 'end') {
      //this.encoder.terminate();

      console.log('Sending data to Cloud Speech API');
      CloudSpeechAPI.sendRequest(e.data.buf, '44100', this.state.langCode)
        .then((data: any) => {
          // TODO: create typings
          if (data && data['results']) {
            const result: number = CloudSpeechAPI.compareWith(data['results'][0]['alternatives'][0]['confidence'], data['results'][0]['alternatives'][0]['transcript'], this.mainView.getText());
            this.setState({ result });
          }
          else {
            this.setState({ result: FAILED_RESULT });
          }
        });
    }
    else if (cmd === 'debug') {
      console.log(e.data);
    }
    else {
      console.error('Unknown event from encoder (WebWorker):', e);
    }
  }

  _onStartRecording = () => {
    this._startRecording();
  }

  _showMainMenu = (ev: any) => {
    const languageName = ev.target.title;
    const languageCode = ev.target.getAttribute('value');
    console.log(`Set language to ${languageName} ( ${languageCode} )`);

    this.setState({
      view: AppViews.MAIN,
      language: languageName,
      langCode: languageCode,
     });
  }

  _onShowLanguageMenu = () => {
    this._stopRecording();

    this.setState({
      view: AppViews.LANGUAGES,
      result: NO_RESULT,
    });
  }

  // User clicked the arrow to change text or started editing the textarea
  _onTextChanged = (text: string) => {
    this._stopRecording();
    this.setState({ result: NO_RESULT });
  }

  _encodeAudio = (e: any) => {
    // We're using just the left audio channel because stereo causes an issue with encoding
    const channelLeft  = e.inputBuffer.getChannelData(0);
    // const channelRight = e.inputBuffer.getChannelData(1);
    this.encoder.postMessage({ cmd: 'encode', buf: channelLeft });
  }

  _startRecording = () => {
    this.setState({
      result: NO_RESULT,
      isRecording: true,
    });

    this.media.startStream()
      // We have a stream source, now setup audio encoding via web worker
      .then((source: MediaStreamAudioSourceNode) => {

        const config = {
          bps: 16,
          channels: 1,
          samplerate: this.media.audioCtx.sampleRate,
          compression: 5,
        };

        console.log(`audioContext.sampleRate: ${config.samplerate}`);
        console.log(this.encoder);
        this.encoder.postMessage({ cmd: 'init', config });

        this.media.node.addEventListener('audioprocess', this._encodeAudio);

        return source;
      })
      // Now connect all the processing nodes
      .then((source: MediaStreamAudioSourceNode) => {
        source.connect(this.media.node!);
        this.media.node!.connect(this.media.audioCtx.destination);
        source.connect(this.media.analyser);

        return source;
      })
      // Start speech recognition API calls and/or silence detection logic
      .then((source: MediaStreamAudioSourceNode) => {
        if (constants.SUPPORTS_RECOGNITION_API) {
          window.console.log('%cSpeechRecognition API available, rejoice! ', 'color: green');

          this.speechAPI!.setLanguage(this.state.langCode);
          this.speechAPI!.compareWith(this.mainView.getText());
          this.speechAPI!.start();
        }
        else {
          this.media.detectSilence(this.media.stream!, source)
            .then(() => {
              this._stopRecording();
              this.encoder.postMessage({ cmd: 'finish' });
            });
        }
      });
  }

  _stopRecording = () => {
    if (this.media.node) {
      this.media.node.removeEventListener('audioprocess', this._encodeAudio);
    }

    this.media.stopStream();

    if (this.speechAPI) {
      this.speechAPI.stop();
    }

    this.setState({ isRecording: false });
  }

  render () {
    return (
      <div className="app">

        <MainView
          ref={(ref: MainView) => this.mainView = ref}
          result={this.state.result}
          langCode={this.state.langCode}
          language={this.state.language}
          isRecording={this.state.isRecording}
          audioAnalyser={this.media.analyser}
          onStartRecording={this._onStartRecording}
          onShowLanguageMenu={this._onShowLanguageMenu}
          onTextChanged={this._onTextChanged}
          visible={this.state.view === AppViews.MAIN} />

        <LanguageMenuView
          onChange={this._showMainMenu}
          selected={this.state.language}
          visible={this.state.view === AppViews.LANGUAGES} />

      </div>
    );
  }
}

export default App;
