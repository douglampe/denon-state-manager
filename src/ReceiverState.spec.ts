import { ReceiverSettings } from './ReceiverSettings';
import { ReceiverState } from './ReceiverState';

describe('ReceiverState', () => {
  describe('isUpdated()', () => {
    it('should return true if updated', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.MainPower, 'ON');
      expect(state.isUpdated()).toBeTruthy();
    });

    it('should return false if not updated', () => {
      const state = new ReceiverState();
      expect(state.isUpdated()).toBeFalsy();
    });
  });

  describe('updateState()', () => {
    it('should update if key does not exist', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.MainPower, 'ON');
      expect(state.isUpdated()).toBeTruthy();
      const update = state.popUpdated();
      expect(update).toEqual(ReceiverSettings.MainPower);
    });

    it('should update if value is different', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.MainPower, 'OFF');
      state.clearUpdated();
      state.updateState(ReceiverSettings.MainPower, 'ON');
      expect(state.isUpdated()).toBeTruthy();
      const update = state.popUpdated();
      expect(update).toEqual(ReceiverSettings.MainPower);
    });

    it('should do nothing if value is the same', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.MainPower, 'ON');
      state.clearUpdated();
      state.updateState(ReceiverSettings.MainPower, 'ON');
      expect(state.isUpdated()).toBeFalsy();
    });
  });

  describe('getState()', () => {
    it('should retrieve state', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.MainPower, 'ON');

      const updated = state.getState(ReceiverSettings.MainPower);

      expect(updated).toEqual('ON');
    });
  });

  describe('popUpdated()', () => {
    it('should retrieve and remove last updated item', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.MainPower, 'ON');
      expect(state.isUpdated()).toBeTruthy();

      const updated = state.popUpdated();

      expect(updated).toEqual(ReceiverSettings.MainPower);
      expect(state.isUpdated()).toBeFalsy();
    });
  });

  describe('clearUpdated()', () => {
    it('should empty updated list', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.MainPower, 'ON');
      expect(state.isUpdated()).toBeTruthy();

      state.clearUpdated();

      expect(state.isUpdated()).toBeFalsy();
    });
  });
});
