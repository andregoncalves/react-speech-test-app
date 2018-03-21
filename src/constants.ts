/* ==========================================================================
 * APP constants
 *
 * @project:
 * @author: Andre Goncalves (andre@andregoncalves)
 * @copyright: 2018 Andre Goncalves
 * ==========================================================================
 */

export default {
  PRODUCTION: (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1'),
  ASSETS_PATH: (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') ? '/speech-test/assets' : './assets',
  API_KEY: 'AIzaSyB583zRApVuJefhnnvVEXr05UeuvYr7LdU',
  SUPPORTS_BGSYNC: 'SyncManager' in self,
  SUPPORTS_IMAGE_CAPTURE: 'ImageCapture' in self,
  SUPPORTS_MEDIA_DEVICES: 'mediaDevices' in navigator,
  SUPPORTS_AUDIO_CONTEXT: 'AudioContext' in window || 'webkitAudioContext' in window,
  SUPPORTS_RECOGNITION_API: ('speechRecognition' in window || 'webkitSpeechRecognition' in window),
  SPEECH_API_RESULTS_TIMEOUT: 500,
  MIN_DECIBELS: -90,
  MAX_DECIBELS: -10,
  SMOOTHING_TIME_CONSTANT: 0.85,
};
