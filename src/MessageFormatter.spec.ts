import { MessageFormatter } from './MessageFormatter';
import { ReceiverSettings } from './ReceiverSettings';

interface TestData {
  zone: number;
  key: ReceiverSettings;
  value: string;
  command: string;
}

describe('MessageFormatter', () => {
  describe('getCommand()', () => {
    it.each([
      {
        zone: 0,
        key: ReceiverSettings.MainPower,
        value: 'ON',
        command: 'PWON',
      },
      { zone: 0, key: ReceiverSettings.Source, value: 'DVD', command: 'SIDVD' },
      {
        zone: 0,
        key: ReceiverSettings.VideoSelect,
        value: 'DVD',
        command: 'SVDVD',
      },
      { zone: 0, key: ReceiverSettings.SD, value: 'AUTO', command: 'SDAUTO' },
      {
        zone: 0,
        key: ReceiverSettings.DigitalInput,
        value: 'AUTO',
        command: 'DCAUTO',
      },
      {
        zone: 0,
        key: ReceiverSettings.SurroundMode,
        value: 'MOVIE',
        command: 'MSMOVIE',
      },
      { key: ReceiverSettings.Power, value: 'ON', command: 'ZMON' },
      { key: ReceiverSettings.Mute, value: 'ON', command: 'MUON' },
      { key: ReceiverSettings.Volume, value: '50', command: 'MV50' },
      { zone: 2, key: ReceiverSettings.Source, value: 'DVD', command: 'Z2DVD' },
      { zone: 2, key: ReceiverSettings.Power, value: 'ON', command: 'Z2ON' },
      { zone: 2, key: ReceiverSettings.Mute, value: 'ON', command: 'Z2MUON' },
      { zone: 2, key: ReceiverSettings.Volume, value: '50', command: 'Z250' },
    ])('should source command for $command', (data: TestData) => {
      const command = MessageFormatter.getCommand(data.key, data.value, data.zone);
      expect(command).toEqual(data.command);
    });

    it('should return undefined if no command found', () => {
      const command = MessageFormatter.getCommand(ReceiverSettings.ECOMode, 'OFF');

      expect(command).toBeUndefined();
    });
  });

  describe('sendStatusRequests', () => {
    const cb = jest.fn();

    MessageFormatter.sendStatusRequests(cb);

    expect(cb.mock.calls).toEqual(MessageFormatter.statusRequestCommands.map((i) => [i]));
  });
});
