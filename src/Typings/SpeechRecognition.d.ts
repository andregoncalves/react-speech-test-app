/* ==========================================================================
 *
 * @project: React Speech App
 * @author: Andre Goncalves (andre@andregoncalves)
 * @copyright: 2018 Andre Goncalves
 * ==========================================================================
 */
interface RecognitionData {
  [index: number]: any;
  confidence: number;
  transcript: string;
}

interface SpeechRecognitionEvent {
  results: Array<RecognitionData>;
}
