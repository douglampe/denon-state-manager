import { ReceiverSettings } from './ReceiverSettings';
import { ReceiverState } from './ReceiverState';

describe('ReceiverState', () => {
  describe('isUpdated()', () => {
    it('should return true if updated', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.MainPower, { raw: 'ON', text: 'ON' });
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
      state.updateState(ReceiverSettings.MainPower, { raw: 'ON', text: 'ON' });
      expect(state.isUpdated()).toBeTruthy();
      const update = state.popUpdated();
      expect(update).toEqual({
        key: ReceiverSettings.MainPower,
        value: {
          raw: 'ON',
          text: 'ON',
        },
      });
    });

    it('should update if value is different', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.MainPower, { raw: 'OFF', text: 'OFF' });
      state.clearUpdated();
      state.updateState(ReceiverSettings.MainPower, { raw: 'ON', text: 'ON' });
      expect(state.isUpdated()).toBeTruthy();
      const update = state.popUpdated();
      expect(update).toEqual({
        key: ReceiverSettings.MainPower,
        value: {
          raw: 'ON',
          text: 'ON',
        },
      });
    });

    it('should do nothing if value is the same', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.MainPower, { raw: 'ON', text: 'ON' });
      state.clearUpdated();
      state.updateState(ReceiverSettings.MainPower, { raw: 'ON', text: 'ON' });
      expect(state.isUpdated()).toBeFalsy();
    });
  });

  describe('getState()', () => {
    it('should retrieve state', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.MainPower, { raw: 'ON', text: 'ON' });

      const updated = state.getState(ReceiverSettings.MainPower);

      expect(updated).toEqual({ raw: 'ON', text: 'ON' });
    });
  });

  describe('popUpdated()', () => {
    it('should retrieve and remove last updated item', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.MainPower, { raw: 'ON', text: 'ON' });
      expect(state.isUpdated()).toBeTruthy();

      const updated = state.popUpdated();

      expect(updated).toEqual({
        key: ReceiverSettings.MainPower,
        value: {
          raw: 'ON',
          text: 'ON',
        },
      });
      expect(state.isUpdated()).toBeFalsy();
    });
  });

  describe('clearUpdated()', () => {
    it('should empty updated list', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.MainPower, { raw: 'ON', text: 'ON' });
      expect(state.isUpdated()).toBeTruthy();

      state.clearUpdated();

      expect(state.isUpdated()).toBeFalsy();
    });
  });
});
