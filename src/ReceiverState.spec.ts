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

    it('should create dictionary for key/value pairs', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.SSLevels, { raw: 'FL 50', key: 'FL', value: '50' });
      state.updateState(ReceiverSettings.SSLevels, { raw: 'FR 50', key: 'FR', value: '50' });
      state.updateState(ReceiverSettings.SSLevels, { raw: 'C 50', key: 'C', value: '50' });
      expect(state.isUpdated()).toBeTruthy();
      state.popUpdated();
      state.popUpdated();
      const update = state.popUpdated();
      expect(update).toEqual({
        key: ReceiverSettings.SSLevels,
        value: {
          raw: 'C 50',
          key: 'C',
          value: '50',
          dictionary: { FL: '50', FR: '50', C: '50' },
        },
      });
    });

    it('should create dictionary for key/value pairs', () => {
      const state = new ReceiverState();
      state.updateState(ReceiverSettings.SSLevels, { raw: 'FL 50', key: 'FL', value: '50' });
      state.updateState(ReceiverSettings.SSLevels, { raw: 'FR 50', key: 'FR', value: '50' });
      state.updateState(ReceiverSettings.SSLevels, { raw: 'C 50', key: 'C', value: '50' });
      state.updateState(ReceiverSettings.SSLevels, { raw: 'FL 55', key: 'FL', value: '55' });
      expect(state.isUpdated()).toBeTruthy();
      state.popUpdated();
      state.popUpdated();
      state.popUpdated();
      const update = state.popUpdated();
      expect(update).toEqual({
        key: ReceiverSettings.SSLevels,
        value: {
          raw: 'FL 55',
          key: 'FL',
          value: '55',
          dictionary: { FL: '55', FR: '50', C: '50' },
        },
      });
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
