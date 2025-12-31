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
      { key: ReceiverSettings.Volume, value: { raw: '50', text: '50' }, command: 'MV50' },
      { key: ReceiverSettings.ChannelVolume, value: { raw: 'C 50', key: 'C', value: '50', numeric: 50 }, command: 'CVC 50' },
      { key: ReceiverSettings.MaxVolume, value: { raw: '98', numeric: 98 }, command: 'MVMAX 98' },
      { key: ReceiverSettings.Mute, value: { raw: 'ON', text: 'ON' }, command: 'MUON' },
      { key: ReceiverSettings.Source, value: { raw: 'DVD', text: 'DVD' }, command: 'SIDVD' },
      { key: ReceiverSettings.Power, value: { raw: 'ON', text: 'ON' }, command: 'ZMON' },
      { key: ReceiverSettings.SD, value: { raw: 'AUTO', text: 'AUTO' }, command: 'SDAUTO' },
      { key: ReceiverSettings.DigitalInput, value: { raw: 'AUTO', text: 'AUTO' }, command: 'DCAUTO' },
      {
        key: ReceiverSettings.VideoSelect,
        value: { raw: 'ON', text: 'ON' },
        command: 'SVON',
      },
      {
        key: ReceiverSettings.VideoSelectSource,
        value: { raw: 'DVD', text: 'DVD' },
        command: 'SVDVD',
      },
      { key: ReceiverSettings.Sleep, value: { raw: 'ON', text: 'ON' }, command: 'SLPON' },
      { key: ReceiverSettings.Standby, value: { raw: '15M', text: '15M' }, command: 'STBY15M' },
      {
        key: ReceiverSettings.ECOMode,
        value: { raw: 'ON', text: 'ON' },
        command: 'ECOON',
      },
      {
        key: ReceiverSettings.SurroundMode,
        value: { raw: 'MOVIE', text: 'MOVIE' },
        command: 'MSMOVIE',
      },
      { key: ReceiverSettings.Parameters, value: { raw: 'BAS 50', key: 'BAS', value: '50' }, command: 'PSBAS 50' },
      { key: ReceiverSettings.SSLevels, value: { raw: 'BDL 50', key: 'BDL', value: '50' }, command: 'SSLEVBDL 50' },
      { key: ReceiverSettings.SSSpeakers, value: { raw: 'FRO LAR', key: 'FRO', value: 'LAR' }, command: 'SSSPCFRO LAR' },
      { key: ReceiverSettings.QuickSelect, value: { raw: '1', numeric: 1 }, command: 'MSQUICK1' },
      { zone: 2, key: ReceiverSettings.Source, value: { raw: 'DVD', text: 'DVD' }, command: 'Z2DVD' },
      { zone: 1, key: ReceiverSettings.Power, value: { raw: 'ON', text: 'ON' }, command: 'ZMON' },
      { zone: 2, key: ReceiverSettings.Power, value: { raw: 'ON', text: 'ON' }, command: 'Z2ON' },
      { zone: 2, key: ReceiverSettings.Volume, value: { raw: '50', text: '50' }, command: 'Z250' },
      { zone: 2, key: ReceiverSettings.Mute, value: { raw: 'ON', text: 'ON' }, command: 'Z2MUON' },
      { zone: 2, key: ReceiverSettings.QuickSelect, value: { raw: '1', text: '1' }, command: 'Z2QUICK1' },
      { zone: 2, key: ReceiverSettings.ChannelSetting, value: { raw: 'ST', text: 'ST' }, command: 'Z2CSST' },
      { zone: 2, key: ReceiverSettings.ChannelVolume, value: { raw: 'FL 50', key: 'FL', value: '50' }, command: 'Z2CVFL 50' },
      { zone: 2, key: ReceiverSettings.HPF, value: { raw: 'ON', text: 'ON' }, command: 'Z2HPFON' },
      { zone: 2, key: ReceiverSettings.Parameters, value: { raw: 'BAS 50', key: 'BAS', value: '50' }, command: 'Z2PSBAS 50' },
      { zone: 2, key: ReceiverSettings.Sleep, value: { raw: 'ON', text: 'ON' }, command: 'Z2SLPON' },
      { zone: 2, key: ReceiverSettings.Standby, value: { raw: '15M', text: '15M' }, command: 'Z2STBY15M' },
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
