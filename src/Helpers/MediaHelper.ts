/* ==========================================================================
 * Media Devices Helper
 *
 * @project: React Speech App
 * @author: Andre Goncalves (andre@andregoncalves)
 * @copyright: 2018 Andre Goncalves
 * ==========================================================================
 */

import constants from '../constants';

export default class MediaHelper {
  private animationFrame: number;

  public audioCtx: AudioContext;
  public node: ScriptProcessorNode;
  public stream: MediaStream;
  public analyser: AnalyserNode;

  private _createProcessorNode(source: any /*MediaStreamAudioSourceNode*/): ScriptProcessorNode | undefined {
    let node: ScriptProcessorNode | undefined = undefined;

    if (source.context.createJavaScriptNode ) {
      node = source.context.createJavaScriptNode(4096, 1, 1);
    }
    else if (source.context.createScriptProcessor) {
      node = source.context.createScriptProcessor(4096, 1, 1);
    }
    else {
      console.error('Could not create audio node for JavaScript based Audio Processing.');
    }

    return node;
  }

  private _setupAudioContextAnalyzer (): AnalyserNode {
    this.audioCtx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
    const analyser: AnalyserNode = this.audioCtx.createAnalyser();

    analyser.minDecibels           = constants.MIN_DECIBELS;
    analyser.maxDecibels           = constants.MAX_DECIBELS;
    analyser.smoothingTimeConstant = constants.SMOOTHING_TIME_CONSTANT;

    this.analyser = analyser;
    return analyser;
  }

  startStream (): Promise<any> {
    if (!this.analyser) {
      this._setupAudioContextAnalyzer();
    }

    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
        this.stream = stream;
        const source: any = this.audioCtx.createMediaStreamSource(stream);
        this.node = this._createProcessorNode(source)!;

        resolve(source);
      });
    });
  }

  stopStream () {
    const track = this.stream.getTracks()[0];
    track.stop();
    this.node.disconnect();

    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }

  detectSilence (stream: MediaStream, source: any, minDecibels: number = 80, silenceDelay: number = 1500): Promise<any> {
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    let silenceStart: number = performance.now();
    let started: boolean = false;

    return new Promise((resolve, reject) => {
      // We'll loop every 60th of a second to check if no sound was recorded
      const checkSilenceLoop = (time: number) => {
        this.analyser.getByteFrequencyData(data); // get current data

        if (time && data.some(v => v > minDecibels)) {
          started = true;
          silenceStart = time;
        }

        if (started && ((time - silenceStart) > silenceDelay)) {
          console.log('%c[APP] Silence detected, stopping...', 'color: purple');
          this.stopStream();
          resolve();
        }
        else {
          this.animationFrame = window.requestAnimationFrame(checkSilenceLoop);
        }
      };
      checkSilenceLoop(0);
    });
  }
}
