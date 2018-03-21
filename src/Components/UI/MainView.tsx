/* ==========================================================================
 * Main View component
 *
 * @project: React Speech App
 * @author: Andre Goncalves (andre@andregoncalves)
 * @copyright: 2018 Andre Goncalves
 * ==========================================================================
 */

import * as React from 'react';
import './MainView.css';

import Feedback from './Feedback';
import AudioWave from './AudioWave';

import TextareaAutosize from 'react-autosize-textarea';
import Phrases from '../../phrases';

interface MainViewProps {
  ref: any;
  langCode: string;
  language: string;
  result: number;
  onShowLanguageMenu? (event: any): void;
  onStartRecording? (event: any): void;
  onTextChanged (text: string): void;
  isRecording: boolean;
  audioAnalyser: AnalyserNode | undefined;
  visible: boolean;
}

interface MainViewState {
  language: string;
  langCode: string;
  text: string;
}

class MainView extends React.Component <MainViewProps, MainViewState> {

  defaultProps: {
    ref: null;
    visible: true;
    result: -1;
    langCode: 'en-US';
    language: 'English';
    isRecording: false;
  };

  textInput: HTMLTextAreaElement | null;
  audiowave: AudioWave;

  constructor (props: MainViewProps) {
    super(props);

    // Default State
    this.state = {
      language: 'English',
      langCode: props.langCode,
      text: this._newText(props.langCode),
     };
  }

  componentWillReceiveProps (props: MainViewProps) {
    if (props.langCode !== this.state.langCode) {
      this.setState({
        text: this._newText(props.langCode),
        langCode: props.langCode,
      });
    }
  }

  getText = (): string => {
    return this.textInput!.value.toLowerCase();
  }

  _newText = (langCode: string): string => {
    const data: string[]  = Phrases[langCode] as string[];

    // Get a random phrase from the array
    // Prevent reusing the same one
    let text: string = data[Math.floor(Math.random() * data.length)];
    const current: string = this.state ? this.state.text : '';

    while ( text === current ) {
      text = data[Math.floor(Math.random() * data.length)];
    }
    return text;
  }

  _changeText = (): void => {
    //const current = this.getText();
    const text = this._newText(this.state.langCode);
    this.setState({ text });
    this.props.onTextChanged(text);
  }

  _handleTextChange = (ev: React.FormEvent<EventTarget>): void => {
    const target: HTMLTextAreaElement = ev.target as HTMLTextAreaElement;
    const text: string = target.value;
    this.setState({ text });
  }

  render () {
    const result: string = this.props.result! > 0.5 ? 'success' : 'failed';

    return (
      <section className={`main-screen screen ${this.props.visible ? 'visible' : 'invisible'}`}>
        <header>
          <h1>Pronunciation Check</h1>
        </header>

        <div className="phrases">
          <div>
            <svg style={{ visibility: 'hidden' }} width="24" height="24" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"/></svg>
            <TextareaAutosize innerRef={ref => this.textInput = ref} value={this.state.text} onChange={this._handleTextChange} />
            <svg onClick={this._changeText} className={`result-${result}`} width="24" height="24" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"/></svg>
          </div>
        </div>

        <div className={`microphone ${this.props.isRecording ? 'active' : ''}`}>
          <svg onClick={this.props.onStartRecording} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 16c2.206 0 4-1.795 4-4v-6c0-2.206-1.794-4-4-4s-4 1.794-4 4v6c0 2.205 1.794 4 4 4z"></path> <path d="M19 12v-2c0-0.552-0.447-1-1-1s-1 0.448-1 1v2c0 2.757-2.243 5-5 5s-5-2.243-5-5v-2c0-0.552-0.447-1-1-1s-1 0.448-1 1v2c0 3.52 2.613 6.432 6 6.92v1.080h-3c-0.553 0-1 0.447-1 1s0.447 1 1 1h8c0.553 0 1-0.447 1-1s-0.447-1-1-1h-3v-1.080c3.387-0.488 6-3.4 6-6.92z"></path></svg>
          <small>Click to speak</small>
        </div>

        <audio id="player"></audio>

        <AudioWave width={450} height={100} isRecording={this.props.isRecording} audioAnalyser={this.props.audioAnalyser} />

        <Feedback score={this.props.result} />

        <div className="language" onClick={this.props.onShowLanguageMenu}>
          {this.props.language}
          <div style={{ display: 'inline-block', marginLeft: '1em', verticalAlign: 'bottom' }} >
            <svg className="icon icon-menu-toggle" aria-hidden="true" version="1.1" x="0px" y="0px" viewBox="0 0 100 100">
              <g className="svg-menu-toggle">
                <path className="line line-1" d="M5 13h90v14H5z"></path>
                <path className="line line-2" d="M5 43h90v14H5z"></path>
                <path className="line line-3" d="M5 73h90v14H5z"></path>
              </g>
            </svg>
          </div>

        </div>
      </section>
    );
  }
}

export default MainView;
