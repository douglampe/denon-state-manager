import { ParserResult } from './ParserResult';
import { ReceiverSettings } from './ReceiverSettings';
import { ReceiverState } from './ReceiverState';
import { StateValue } from './StateValue';
import { ZoneParser } from './ZoneParser';

interface TestData {
  zone: string;
  command: string;
  key: ReceiverSettings;
  value: StateValue;
}

function parse(zone: string, command: string): ParserResult {
  const state = new ReceiverState();
  const zoneParser = new ZoneParser(state, zone);
  return zoneParser.parse(command);
}

function runTestCase(data: TestData) {
  const result = parse(data.zone, data.command);
  expect(result.handled).toBeTruthy();
  expect(result.key).toEqual(data.key);
  expect(result.value).toEqual(data.value);
}

describe('ZoneParser', () => {
  describe('parse()', () => {
    it('should ignore non-zone commands', () => {
      const result = parse('Z2', 'ZMON');
      expect(result.handled).toBeFalsy();
    });

    describe('Z*: Commands', () => {
      it.each([
        {
          zone: 'Z2',
          command: 'Z2ON',
          key: ReceiverSettings.Power,
          value: { raw: 'ON', text: 'ON' },
        },
        {
          zone: 'Z2',
          command: 'Z2OFF',
          key: ReceiverSettings.Power,
          value: { raw: 'OFF', text: 'OFF' },
        },
        {
          zone: 'Z3',
          command: 'Z3ON',
          key: ReceiverSettings.Power,
          value: { raw: 'ON', text: 'ON' },
        },
        {
          zone: 'Z3',
          command: 'Z3OFF',
          key: ReceiverSettings.Power,
          value: { raw: 'OFF', text: 'OFF' },
        },
        {
          zone: 'Z2',
          command: 'Z2MUON',
          key: ReceiverSettings.Mute,
          value: { raw: 'ON', text: 'ON' },
        },
        {
          zone: 'Z2',
          command: 'Z2MUOFF',
          key: ReceiverSettings.Mute,
          value: { raw: 'OFF', text: 'OFF' },
        },
        {
          zone: 'Z3',
          command: 'Z3MUON',
          key: ReceiverSettings.Mute,
          value: { raw: 'ON', text: 'ON' },
        },
        {
          zone: 'Z3',
          command: 'Z3MUOFF',
          key: ReceiverSettings.Mute,
          value: { raw: 'OFF', text: 'OFF' },
        },
        {
          zone: 'Z2',
          command: 'Z250',
          key: ReceiverSettings.Volume,
          value: { raw: '50', numeric: 50 },
        },
        {
          zone: 'Z3',
          command: 'Z350',
          key: ReceiverSettings.Volume,
          value: { raw: '50', numeric: 50 },
        },
      ])('should handle Zone command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('CV: Channel Volume Commands', () => {
      it.each([
        {
          zone: 'Z2',
          command: 'Z2CVFL 50',
          key: ReceiverSettings.ChannelVolume,
          value: { raw: 'FL 50', key: 'FL', value: '50', numeric: 50 },
        },
        {
          zone: 'Z2',
          command: 'Z2CVFR 50',
          key: ReceiverSettings.ChannelVolume,
          value: { raw: 'FR 50', key: 'FR', value: '50', numeric: 50 },
        },
        {
          zone: 'Z3',
          command: 'Z3CVFL 50',
          key: ReceiverSettings.ChannelVolume,
          value: { raw: 'FL 50', key: 'FL', value: '50', numeric: 50 },
        },
        {
          zone: 'Z3',
          command: 'Z3CVFR 50',
          key: ReceiverSettings.ChannelVolume,
          value: { raw: 'FR 50', key: 'FR', value: '50', numeric: 50 },
        },
      ])('should handle channel volume command $command', (data: TestData) => {
        runTestCase(data);
      });

      it('should return blank if no volume', () => {
        const result = parse('Z2', 'Z2CVFL');
        expect(result.handled).toBeTruthy();
        expect(result.value).toEqual({ raw: 'FL', key: 'FL', value: '' });
      });
    });

    describe('CS: Channel Setting Commands', () => {
      it.each([
        {
          zone: 'Z2',
          command: 'Z2CSST',
          key: ReceiverSettings.ChannelSetting,
          value: { raw: 'ST', text: 'ST' },
        },
        {
          zone: 'Z2',
          command: 'Z2CSMONO',
          key: ReceiverSettings.ChannelSetting,
          value: { raw: 'MONO', text: 'MONO' },
        },
        {
          zone: 'Z3',
          command: 'Z3CSST',
          key: ReceiverSettings.ChannelSetting,
          value: { raw: 'ST', text: 'ST' },
        },
        {
          zone: 'Z3',
          command: 'Z3CSMONO',
          key: ReceiverSettings.ChannelSetting,
          value: { raw: 'MONO', text: 'MONO' },
        },
      ])('should handle channel volume command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('HP: HP Commands', () => {
      it.each([
        {
          zone: 'Z2',
          command: 'Z2HPFON',
          key: ReceiverSettings.HPF,
          value: { raw: 'ON', text: 'ON' },
        },
        {
          zone: 'Z2',
          command: 'Z2HPFOFF',
          key: ReceiverSettings.HPF,
          value: { raw: 'OFF', text: 'OFF' },
        },
        {
          zone: 'Z3',
          command: 'Z3HPFON',
          key: ReceiverSettings.HPF,
          value: { raw: 'ON', text: 'ON' },
        },
        {
          zone: 'Z3',
          command: 'Z3HPFOFF',
          key: ReceiverSettings.HPF,
          value: { raw: 'OFF', text: 'OFF' },
        },
      ])('should handle channel volume command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('QUICK: Quick Select Commands', () => {
      it.each([
        {
          zone: 'Z2',
          command: 'Z2QUICK1',
          key: ReceiverSettings.QuickSelect,
          value: { raw: '1', numeric: 1 },
        },
        {
          zone: 'Z2',
          command: 'Z2QUICK2',
          key: ReceiverSettings.QuickSelect,
          value: { raw: '2', numeric: 2 },
        },
        {
          zone: 'Z2',
          command: 'Z2QUICK3',
          key: ReceiverSettings.QuickSelect,
          value: { raw: '3', numeric: 3 },
        },
        {
          zone: 'Z2',
          command: 'Z2QUICK4',
          key: ReceiverSettings.QuickSelect,
          value: { raw: '4', numeric: 4 },
        },
        {
          zone: 'Z2',
          command: 'Z2QUICK5',
          key: ReceiverSettings.QuickSelect,
          value: { raw: '5', numeric: 5 },
        },
        {
          zone: 'Z3',
          command: 'Z3QUICK1',
          key: ReceiverSettings.QuickSelect,
          value: { raw: '1', numeric: 1 },
        },
        {
          zone: 'Z3',
          command: 'Z3QUICK2',
          key: ReceiverSettings.QuickSelect,
          value: { raw: '2', numeric: 2 },
        },
        {
          zone: 'Z3',
          command: 'Z3QUICK3',
          key: ReceiverSettings.QuickSelect,
          value: { raw: '3', numeric: 3 },
        },
        {
          zone: 'Z3',
          command: 'Z3QUICK4',
          key: ReceiverSettings.QuickSelect,
          value: { raw: '4', numeric: 4 },
        },
        {
          zone: 'Z3',
          command: 'Z3QUICK5',
          key: ReceiverSettings.QuickSelect,
          value: { raw: '5', numeric: 5 },
        },
      ])('should handle quick select command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('Z*: Zone Source Commands', () => {
      it.each([
        {
          zone: 'Z2',
          command: 'Z2PHONO',
          key: ReceiverSettings.Source,
          value: { raw: 'PHONO', text: 'PHONO' },
        },
        {
          zone: 'Z2',
          command: 'Z2CD',
          key: ReceiverSettings.Source,
          value: { raw: 'CD', text: 'CD' },
        },
        {
          zone: 'Z2',
          command: 'Z2TUNER',
          key: ReceiverSettings.Source,
          value: { raw: 'TUNER', text: 'TUNER' },
        },
        {
          zone: 'Z2',
          command: 'Z2DVD',
          key: ReceiverSettings.Source,
          value: { raw: 'DVD', text: 'DVD' },
        },
        {
          zone: 'Z2',
          command: 'Z2BD',
          key: ReceiverSettings.Source,
          value: { raw: 'BD', text: 'BD' },
        },
        {
          zone: 'Z2',
          command: 'Z2TV',
          key: ReceiverSettings.Source,
          value: { raw: 'TV', text: 'TV' },
        },
        {
          zone: 'Z2',
          command: 'Z2SAT/CBL',
          key: ReceiverSettings.Source,
          value: { raw: 'SAT/CBL', text: 'SAT/CBL' },
        },
        {
          zone: 'Z2',
          command: 'Z2MPLAY',
          key: ReceiverSettings.Source,
          value: { raw: 'MPLAY', text: 'MPLAY' },
        },
        {
          zone: 'Z2',
          command: 'Z2GAME',
          key: ReceiverSettings.Source,
          value: { raw: 'GAME', text: 'GAME' },
        },
        {
          zone: 'Z2',
          command: 'Z2HDRADIO',
          key: ReceiverSettings.Source,
          value: { raw: 'HDRADIO', text: 'HDRADIO' },
        },
        {
          zone: 'Z2',
          command: 'Z2NET',
          key: ReceiverSettings.Source,
          value: { raw: 'NET', text: 'NET' },
        },
        {
          zone: 'Z2',
          command: 'Z2PANDORA',
          key: ReceiverSettings.Source,
          value: { raw: 'PANDORA', text: 'PANDORA' },
        },
        {
          zone: 'Z2',
          command: 'Z2SIRIUSXM',
          key: ReceiverSettings.Source,
          value: { raw: 'SIRIUSXM', text: 'SIRIUSXM' },
        },
        {
          zone: 'Z2',
          command: 'Z2SPOTIFY',
          key: ReceiverSettings.Source,
          value: { raw: 'SPOTIFY', text: 'SPOTIFY' },
        },
        {
          zone: 'Z2',
          command: 'Z2LASTFM',
          key: ReceiverSettings.Source,
          value: { raw: 'LASTFM', text: 'LASTFM' },
        },
        {
          zone: 'Z2',
          command: 'Z2FLICKR',
          key: ReceiverSettings.Source,
          value: { raw: 'FLICKR', text: 'FLICKR' },
        },
        {
          zone: 'Z2',
          command: 'Z2IRADIO',
          key: ReceiverSettings.Source,
          value: { raw: 'IRADIO', text: 'IRADIO' },
        },
        {
          zone: 'Z2',
          command: 'Z2SERVER',
          key: ReceiverSettings.Source,
          value: { raw: 'SERVER', text: 'SERVER' },
        },
        {
          zone: 'Z2',
          command: 'Z2FAVORITES',
          key: ReceiverSettings.Source,
          value: { raw: 'FAVORITES', text: 'FAVORITES' },
        },
        {
          zone: 'Z2',
          command: 'Z2AUX1',
          key: ReceiverSettings.Source,
          value: { raw: 'AUX1', text: 'AUX1' },
        },
        {
          zone: 'Z2',
          command: 'Z2AUX2',
          key: ReceiverSettings.Source,
          value: { raw: 'AUX2', text: 'AUX2' },
        },
        {
          zone: 'Z2',
          command: 'Z2AUX3',
          key: ReceiverSettings.Source,
          value: { raw: 'AUX3', text: 'AUX3' },
        },
        {
          zone: 'Z2',
          command: 'Z2AUX4',
          key: ReceiverSettings.Source,
          value: { raw: 'AUX4', text: 'AUX4' },
        },
        {
          zone: 'Z2',
          command: 'Z2AUX5',
          key: ReceiverSettings.Source,
          value: { raw: 'AUX5', text: 'AUX5' },
        },
        {
          zone: 'Z2',
          command: 'Z2AUX6',
          key: ReceiverSettings.Source,
          value: { raw: 'AUX6', text: 'AUX6' },
        },
        {
          zone: 'Z2',
          command: 'Z2AUX7',
          key: ReceiverSettings.Source,
          value: { raw: 'AUX7', text: 'AUX7' },
        },
        {
          zone: 'Z2',
          command: 'Z2BT',
          key: ReceiverSettings.Source,
          value: { raw: 'BT', text: 'BT' },
        },
        {
          zone: 'Z2',
          command: 'Z2USB/IPOD',
          key: ReceiverSettings.Source,
          value: { raw: 'USB/IPOD', text: 'USB/IPOD' },
        },
        {
          zone: 'Z2',
          command: 'Z2USB',
          key: ReceiverSettings.Source,
          value: { raw: 'USB', text: 'USB' },
        },
        {
          zone: 'Z2',
          command: 'Z2IPD',
          key: ReceiverSettings.Source,
          value: { raw: 'IPD', text: 'IPD' },
        },
        {
          zone: 'Z2',
          command: 'Z2IRP',
          key: ReceiverSettings.Source,
          value: { raw: 'IRP', text: 'IRP' },
        },
        {
          zone: 'Z2',
          command: 'Z2FVP',
          key: ReceiverSettings.Source,
          value: { raw: 'FVP', text: 'FVP' },
        },
        {
          zone: 'Z3',
          command: 'Z3PHONO',
          key: ReceiverSettings.Source,
          value: { raw: 'PHONO', text: 'PHONO' },
        },
        {
          zone: 'Z3',
          command: 'Z3CD',
          key: ReceiverSettings.Source,
          value: { raw: 'CD', text: 'CD' },
        },
        {
          zone: 'Z3',
          command: 'Z3TUNER',
          key: ReceiverSettings.Source,
          value: { raw: 'TUNER', text: 'TUNER' },
        },
        {
          zone: 'Z3',
          command: 'Z3DVD',
          key: ReceiverSettings.Source,
          value: { raw: 'DVD', text: 'DVD' },
        },
        {
          zone: 'Z3',
          command: 'Z3BD',
          key: ReceiverSettings.Source,
          value: { raw: 'BD', text: 'BD' },
        },
        {
          zone: 'Z3',
          command: 'Z3TV',
          key: ReceiverSettings.Source,
          value: { raw: 'TV', text: 'TV' },
        },
        {
          zone: 'Z3',
          command: 'Z3SAT/CBL',
          key: ReceiverSettings.Source,
          value: { raw: 'SAT/CBL', text: 'SAT/CBL' },
        },
        {
          zone: 'Z3',
          command: 'Z3MPLAY',
          key: ReceiverSettings.Source,
          value: { raw: 'MPLAY', text: 'MPLAY' },
        },
        {
          zone: 'Z3',
          command: 'Z3GAME',
          key: ReceiverSettings.Source,
          value: { raw: 'GAME', text: 'GAME' },
        },
        {
          zone: 'Z3',
          command: 'Z3HDRADIO',
          key: ReceiverSettings.Source,
          value: { raw: 'HDRADIO', text: 'HDRADIO' },
        },
        {
          zone: 'Z3',
          command: 'Z3NET',
          key: ReceiverSettings.Source,
          value: { raw: 'NET', text: 'NET' },
        },
        {
          zone: 'Z3',
          command: 'Z3PANDORA',
          key: ReceiverSettings.Source,
          value: { raw: 'PANDORA', text: 'PANDORA' },
        },
        {
          zone: 'Z3',
          command: 'Z3SIRIUSXM',
          key: ReceiverSettings.Source,
          value: { raw: 'SIRIUSXM', text: 'SIRIUSXM' },
        },
        {
          zone: 'Z3',
          command: 'Z3SPOTIFY',
          key: ReceiverSettings.Source,
          value: { raw: 'SPOTIFY', text: 'SPOTIFY' },
        },
        {
          zone: 'Z3',
          command: 'Z3LASTFM',
          key: ReceiverSettings.Source,
          value: { raw: 'LASTFM', text: 'LASTFM' },
        },
        {
          zone: 'Z3',
          command: 'Z3FLICKR',
          key: ReceiverSettings.Source,
          value: { raw: 'FLICKR', text: 'FLICKR' },
        },
        {
          zone: 'Z3',
          command: 'Z3IRADIO',
          key: ReceiverSettings.Source,
          value: { raw: 'IRADIO', text: 'IRADIO' },
        },
        {
          zone: 'Z3',
          command: 'Z3SERVER',
          key: ReceiverSettings.Source,
          value: { raw: 'SERVER', text: 'SERVER' },
        },
        {
          zone: 'Z3',
          command: 'Z3FAVORITES',
          key: ReceiverSettings.Source,
          value: { raw: 'FAVORITES', text: 'FAVORITES' },
        },
        {
          zone: 'Z3',
          command: 'Z3AUX1',
          key: ReceiverSettings.Source,
          value: { raw: 'AUX1', text: 'AUX1' },
        },
        {
          zone: 'Z3',
          command: 'Z3AUX2',
          key: ReceiverSettings.Source,
          value: { raw: 'AUX2', text: 'AUX2' },
        },
        {
          zone: 'Z3',
          command: 'Z3AUX3',
          key: ReceiverSettings.Source,
          value: { raw: 'AUX3', text: 'AUX3' },
        },
        {
          zone: 'Z3',
          command: 'Z3AUX4',
          key: ReceiverSettings.Source,
          value: { raw: 'AUX4', text: 'AUX4' },
        },
        {
          zone: 'Z3',
          command: 'Z3AUX5',
          key: ReceiverSettings.Source,
          value: { raw: 'AUX5', text: 'AUX5' },
        },
        {
          zone: 'Z3',
          command: 'Z3AUX6',
          key: ReceiverSettings.Source,
          value: { raw: 'AUX6', text: 'AUX6' },
        },
        {
          zone: 'Z3',
          command: 'Z3AUX7',
          key: ReceiverSettings.Source,
          value: { raw: 'AUX7', text: 'AUX7' },
        },
        {
          zone: 'Z3',
          command: 'Z3BT',
          key: ReceiverSettings.Source,
          value: { raw: 'BT', text: 'BT' },
        },
        {
          zone: 'Z3',
          command: 'Z3USB/IPOD',
          key: ReceiverSettings.Source,
          value: { raw: 'USB/IPOD', text: 'USB/IPOD' },
        },
        {
          zone: 'Z3',
          command: 'Z3USB',
          key: ReceiverSettings.Source,
          value: { raw: 'USB', text: 'USB' },
        },
        {
          zone: 'Z3',
          command: 'Z3IPD',
          key: ReceiverSettings.Source,
          value: { raw: 'IPD', text: 'IPD' },
        },
        {
          zone: 'Z3',
          command: 'Z3IRP',
          key: ReceiverSettings.Source,
          value: { raw: 'IRP', text: 'IRP' },
        },
        {
          zone: 'Z3',
          command: 'Z3FVP',
          key: ReceiverSettings.Source,
          value: { raw: 'FVP', text: 'FVP' },
        },
      ])('should handle main zone source command $command', (data: TestData) => {
        runTestCase(data);
      });
    });
  });

  describe('handle()', () => {
    it('should call parse()', () => {
      const state = new ReceiverState();
      const zoneParser = new ZoneParser(state, 'Z2');

      const mockHandle = jest.spyOn(zoneParser, 'handle');

      const result = zoneParser.handle('Z2ON');

      expect(mockHandle).toHaveBeenCalledWith('Z2ON');
      expect(result).toBeTruthy();
    });
  });
});
