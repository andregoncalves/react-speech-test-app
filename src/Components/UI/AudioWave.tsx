/* ==========================================================================
 * Audio Wave Compnent
 *
 * @project: React Speech App
 * @author: Andre Goncalves (andre@andregoncalves)
 * @copyright: 2018 Andre Goncalves
 * ==========================================================================
 */

import * as React from 'react';
import './AudioWave.css';

const FILLCOLOR: string = 'rgb(30, 56, 76)';
const STROKECOLOR: string = 'rgb(50, 186, 250)';
const LINEWIDTH: number = 2;

interface AudioWaveProps {
  width: number;
  height: number;
  isRecording: boolean;
  audioAnalyser: AnalyserNode | undefined;
 }

class AudioWave extends React.Component <AudioWaveProps> {

  defaultProps: {
    width: 450;
    height: 100;
    isRecording: false;
  };

  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  bufferLength: number;
  requestFrameID: number;

  componentDidMount () {
    this.canvas = document.querySelector('#App-audio-wave canvas')! as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
  }

  componentWillReceiveProps (props: AudioWaveProps) {
    if (props.isRecording === false && this.props.isRecording !== props.isRecording) {
      this.stop();
    }
  }

  componentWillUnmount () {
    this.stop();
  }

  start = () => {
    console.log('Canvas: start');

    if (!this.props.audioAnalyser) {
      return;
    }

    this.bufferLength = this.props.audioAnalyser.fftSize;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    this._draw();
  }

  stop = () => {
    console.log('Canvas: stop');

    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    }
    window.cancelAnimationFrame(this.requestFrameID);
  }

  _clearCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = FILLCOLOR;
    ctx.fillRect(0, 0, this.props.width, this.props.height);
  }

  _draw = () => {
    this.requestFrameID = window.requestAnimationFrame(this._draw);

    this.props.audioAnalyser!.getByteTimeDomainData(this.dataArray);

    this._clearCanvas(this.ctx);
    this.ctx.lineWidth = LINEWIDTH;
    this.ctx.strokeStyle = STROKECOLOR;

    this.ctx.beginPath();

    const sliceWidth = this.props.width * 1.0 / this.bufferLength;
    let x = 0;

    for (let i = 0; i < this.bufferLength; i++) {
      const v = this.dataArray[i] / 128.0;
      const y = v * this.props.height / 2;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      }
      else {
        this.ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    this.ctx.lineTo(this.props.width, this.props.height / 2);
    this.ctx.stroke();
  }

  render () {
    if (this.props.isRecording) {
      this.start();
    }

    return (
      <div id="App-audio-wave">
        <canvas id="visualizer" width={this.props.width} height={this.props.height}></canvas>
      </div>
    );
  }
}

export default AudioWave;
