import { MessageFormatter } from './MessageFormatter';
import { ReceiverSettings } from './ReceiverSettings';
import { StateValue } from './StateValue';

interface TestData {
  zone?: number;
  key: ReceiverSettings;
  value: StateValue;
  command: string;
}

describe('MessageFormatter', () => {
  describe('getCommand()', () => {
    it.each([
      {
        key: ReceiverSettings.None,
        value: { raw: 'MVUP' },
        command: 'MVUP',
      },
      {
        key: ReceiverSettings.MainPower,
        value: { raw: 'ON', text: 'ON' },
        command: 'PWON',
      },
      { key: ReceiverSettings.Source, value: { raw: 'DVD', text: 'DVD' }, command: 'SIDVD' },
      {
        key: ReceiverSettings.VideoSelect,
        value: { raw: 'DVD', text: 'DVD' },
        command: 'SVDVD',
      },
      { key: ReceiverSettings.SD, value: { raw: 'AUTO', text: 'AUTO' }, command: 'SDAUTO' },
      {
        key: ReceiverSettings.DigitalInput,
        value: { raw: 'AUTO', text: 'AUTO' },
        command: 'DCAUTO',
      },
      {
        key: ReceiverSettings.SurroundMode,
        value: { raw: 'MOVIE', text: 'MOVIE' },
        command: 'MSMOVIE',
      },
      { key: ReceiverSettings.Power, value: { raw: 'ON', text: 'ON' }, command: 'ZMON' },
      { key: ReceiverSettings.Mute, value: { raw: 'ON', text: 'ON' }, command: 'MUON' },
      { key: ReceiverSettings.Volume, value: { raw: '50', text: '50' }, command: 'MV50' },
      { key: ReceiverSettings.ChannelVolume, value: { raw: 'C 50', key: 'C', value: '50', numeric: 50 }, command: 'CVC 50' },
      { zone: 2, key: ReceiverSettings.Source, value: { raw: 'DVD', text: 'DVD' }, command: 'Z2DVD' },
      { zone: 2, key: ReceiverSettings.Power, value: { raw: 'ON', text: 'ON' }, command: 'Z2ON' },
      { zone: 2, key: ReceiverSettings.Mute, value: { raw: 'ON', text: 'ON' }, command: 'Z2MUON' },
      { zone: 2, key: ReceiverSettings.Volume, value: { raw: '50', text: '50' }, command: 'Z250' },
      { zone: 2, key: ReceiverSettings.ChannelVolume, value: { raw: 'C 50', key: 'C', value: '50' }, command: 'Z2CVC 50' },
    ])('should source command for $command', (data: TestData) => {
      const command = MessageFormatter.getCommand(data.key, data.value, data.zone);
      expect(command).toEqual(data.command);
    });

    it('should return undefined if no command found', () => {
      const command = MessageFormatter.getCommand(ReceiverSettings.DigitalInput, { raw: 'OFF', text: 'OFF' }, 2);

      expect(command).toBeUndefined();
    });

    it('should return undefined if no text or numeric in value', () => {
      const command = MessageFormatter.getCommand(ReceiverSettings.MainPower, { raw: 'OFF' }, 2);

      expect(command).toBeUndefined();
    });
  });

  describe('sendStatusRequests', () => {
    const cb = jest.fn();

    MessageFormatter.sendStatusRequests(cb);

    expect(cb.mock.calls).toEqual(MessageFormatter.statusRequestCommands.map((i) => [i]));
  });
});
