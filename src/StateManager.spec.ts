import { ReceiverSettings } from './ReceiverSettings';
import { ReceiverState } from './ReceiverState';
import { StateManager } from './StateManager';

describe('StateManager', () => {
  describe('handleCommand()', () => {
    it('should handle main zone commands', () => {
      const mainState = new ReceiverState();
      const stateManager = new StateManager({
        mainState,
        zone2State: new ReceiverState(),
        zone3State: new ReceiverState(),
      });
      stateManager.handleCommand('MV00');
      const updated = mainState.popUpdated();
      expect(updated).toEqual({
        key: ReceiverSettings.Volume,
        value: {
          raw: '00',
          numeric: 0,
        },
      });
    });

    it('should handle zone 2 commands', () => {
      const zone2State = new ReceiverState();
      const stateManager = new StateManager({
        mainState: new ReceiverState(),
        zone2State,
        zone3State: new ReceiverState(),
      });
      stateManager.handleCommand('Z200');
      const updated = zone2State.popUpdated();
      expect(updated).toEqual({
        key: ReceiverSettings.Volume,
        value: {
          raw: '00',
          numeric: 0,
        },
      });
    });

    it('should handle zone 3 commands', () => {
      const zone3State = new ReceiverState();
      const stateManager = new StateManager({
        mainState: new ReceiverState(),
        zone2State: new ReceiverState(),
        zone3State,
      });
      stateManager.handleCommand('Z300');
      const updated = zone3State.popUpdated();
      expect(updated).toEqual({
        key: ReceiverSettings.Volume,
        value: {
          raw: '00',
          numeric: 0,
        },
      });
    });
  });

  describe('sendUpdates()', () => {
    it('should get update commands', () => {
      const cb = jest.fn();
      const stateManager = new StateManager({
        mainState: new ReceiverState(),
        zone2State: new ReceiverState(),
        zone3State: new ReceiverState(),
      });
      stateManager.handleCommand('PWON');
      stateManager.handleCommand('Z2ON');
      stateManager.handleCommand('Z3ON');
      stateManager.sendUpdates(cb);

      expect(cb.mock.calls).toEqual([['PWON'], ['Z2ON'], ['Z3ON']]);
    });
  });
});
