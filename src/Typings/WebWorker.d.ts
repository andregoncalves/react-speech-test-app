/* ==========================================================================
 *
 * @project: React Speech App
 * @author: Andre Goncalves (andre@andregoncalves)
 * @copyright: 2018 Andre Goncalves
 * ==========================================================================
 */
declare enum WorkerCommand {
  'END' = 'end',
  'DEBUG' = 'debug',
  'INIT' = 'init',
  'SAVE_AS_WAVE' = 'save_as_wavfile',
  'ENCODE' = 'encode',
  'FINISH' = 'finish',
}

interface IWorkerDataEvent {
  data: {
    cmd: WorkerCommand;
    buf: Blob;
  };
}
