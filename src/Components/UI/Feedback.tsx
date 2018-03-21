/* ==========================================================================
 * Feedback Component
 * Provides feedback message UI and audio cue after speech recognition
 *
 * @project: React Speech App
 * @author: Andre Goncalves (andre@andregoncalves)
 * @copyright: 2018 Andre Gocalves
 * ==========================================================================
 */
import * as React from 'react';
import './Feedback.css';

import constants from '../../constants';

const successIcon = () => (
  <svg id="success" version="1.1" x="0px" y="0px" viewBox="0 0 512 512">
    <g>
      <path d="M256,32C132.3,32,32,132.3,32,256c0,123.7,100.3,224,224,224c123.7,0,224-100.3,224-224C480,132.3,379.7,32,256,32z
      M370.9,181.1L231.8,359.6c-1.1,1.1-2.9,3.5-5.1,3.5c-2.3,0-3.8-1.6-5.1-2.9c-1.3-1.3-78.9-75.9-78.9-75.9l-1.5-1.5
      c-0.6-0.9-1.1-2-1.1-3.2c0-1.2,0.5-2.3,1.1-3.2c0.4-0.4,0.7-0.7,1.1-1.2c7.7-8.1,23.3-24.5,24.3-25.5c1.3-1.3,2.4-3,4.8-3
      c2.5,0,4.1,2.1,5.3,3.3c1.2,1.2,45,43.3,45,43.3l111.3-143c1-0.8,2.2-1.4,3.5-1.4c1.3,0,2.5,0.5,3.5,1.3l30.6,24.1
      c0.8,1,1.3,2.2,1.3,3.5C372,179.1,371.5,180.2,370.9,181.1z"/>
    </g>
  </svg>
);

const failedIcon = () => (
  <svg id="failed" viewBox="0 0 744.09 1052.4" version="1.1">
    <g id="layer1">
      <path id="path2989" d="m814.29 606.65a314.29 314.29 0 1 1 -628.57 0 314.29 314.29 0 1 1 628.57 0z" stroke="#000" strokeWidth="0" transform="matrix(1.1048 0 0 1.1048 -179.21 -162.53)" />
      <g id="g3763" transform="matrix(.91837 0 0 .91837 47.587 10.944)" stroke="rgb(30, 56, 76)" strokeLinecap="round" strokeWidth="133.87" fill="none">
        <path id="path2991" d="m176.51 362.87 356.13 356.13" />
        <path id="path2993" d="m532.64 362.87-356.13 356.13" />
      </g>
    </g>
  </svg>
);

interface FeedbackProps {
 score: number;
}

const Feedback: React.SFC<FeedbackProps> = (props) => {
  const score = props.score;

  // Success Conditions
  const succeeded: boolean = (score > 0.5);
  const failed: boolean = (score > -1 && score < 0.5);

  if (succeeded) {
    return (
      <div className="feedback SUCCESS">
        {successIcon()}
        <p>Excellent, we understand you!<br/>
        Try another phrase or type a new one.</p>
        <audio src={`${constants.ASSETS_PATH}/public/success.mp3`} autoPlay />
      </div>
    );
  }

  if (failed) {
    return (
      <div className="feedback FAILED">
        {failedIcon()}
        <p>What did you say? We can't understand you. Try again!</p>
        <audio src={`${constants.ASSETS_PATH}/public/error.mp3`} autoPlay />
      </div>
    );
  }

  // Default, don't display anything
  return (
    <div className="feedback"></div>
  );
};

Feedback.defaultProps = {
  score: -1, // A score of -1 means no evaluation was performed
};

export default Feedback;
