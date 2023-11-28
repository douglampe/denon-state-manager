import { MainParser } from './MainParser';
import { ParserResult } from './ParserResult';
import { ReceiverSettings } from './ReceiverSettings';
import { ReceiverState } from './ReceiverState';
import { SpeakerCodes } from './SpeakerCodes';
import { StateValue } from './StateValue';

interface TestData {
  command: string;
  key: ReceiverSettings;
  value: StateValue;
}

function parse(command: string): ParserResult {
  const state = new ReceiverState();
  const mainParser = new MainParser(state);
  return mainParser.parse(command);
}

function runTestCase(data: TestData) {
  const result = parse(data.command);
  expect(result.handled).toBeTruthy();
  expect(result.key).toEqual(data.key);
  expect(result.value).toEqual(data.value);
}

describe('MainParser', () => {
  describe('parse()', () => {
    describe('Global commands', () => {
      it.each([
        { command: 'PWON', key: ReceiverSettings.MainPower, value: { raw: 'ON', text: 'ON' } },
        { command: 'PWOFF', key: ReceiverSettings.MainPower, value: { raw: 'OFF', text: 'OFF' } },
      ])('should handle global command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('General Main Zone commands', () => {
      it.each([
        { command: 'MV50', key: ReceiverSettings.Volume, value: { raw: '50', numeric: 50 } },
        { command: 'MUON', key: ReceiverSettings.Mute, value: { raw: 'ON', text: 'ON' } },
        { command: 'MUOFF', key: ReceiverSettings.Mute, value: { raw: 'OFF', text: 'OFF' } },
        { command: 'ZMON', key: ReceiverSettings.Power, value: { raw: 'ON', text: 'ON' } },
        { command: 'ZMOFF', key: ReceiverSettings.Power, value: { raw: 'OFF', text: 'OFF' } },
        { command: 'ZMOFF', key: ReceiverSettings.Power, value: { raw: 'OFF', text: 'OFF' } },
        { command: 'ZMOFF', key: ReceiverSettings.Power, value: { raw: 'OFF', text: 'OFF' } },
        { command: 'ZMOFF', key: ReceiverSettings.Power, value: { raw: 'OFF', text: 'OFF' } },
        { command: 'SLPOFF', key: ReceiverSettings.Sleep, value: { raw: 'OFF', text: 'OFF' } },
        { command: 'SLP60', key: ReceiverSettings.Sleep, value: { raw: '60', numeric: 60 } },
        { command: 'STBY15M', key: ReceiverSettings.Standby, value: { raw: '15M', text: '15M' } },
        { command: 'STBY30M', key: ReceiverSettings.Standby, value: { raw: '30M', text: '30M' } },
        { command: 'STBY60M', key: ReceiverSettings.Standby, value: { raw: '60M', text: '60M' } },
        { command: 'STBYOFF', key: ReceiverSettings.Standby, value: { raw: 'OFF', text: 'OFF' } },
        { command: 'ECOON', key: ReceiverSettings.ECOMode, value: { raw: 'ON', text: 'ON' } },
        { command: 'ECOAUTO', key: ReceiverSettings.ECOMode, value: { raw: 'AUTO', text: 'AUTO' } },
        { command: 'ECOOFF', key: ReceiverSettings.ECOMode, value: { raw: 'OFF', text: 'OFF' } },
      ])('should handle main zone command $command', (data: TestData) => {
        runTestCase(data);
      });

      it('should ignore invalid volumes', () => {
        const result = parse('MVXX');
        expect(result.handled).toBeFalsy();
      });
    });

    describe('CV: Channel Volume Commands', () => {
      it.each(
        Object.keys(SpeakerCodes.codesToNames).map((key) => {
          return { command: `CV${key} 50`, key: ReceiverSettings.ChannelVolume, value: { raw: `${key} 50`, key, value: '50', numeric: 50 } };
        }),
      )('should handle channel volume command $command', (data: TestData) => {
        runTestCase(data);
      });

      it('should ignore CVEND', () => {
        const result = parse('CVEND');
        expect(result.handled).toBeFalsy();
      });

      it('should return blank if no volume', () => {
        const result = parse('CVC');
        expect(result.value).toEqual({ raw: 'C', key: 'C', value: '' });
      });
    });

    describe('SI: Main Zone Source Commands', () => {
      it.each([
        { command: 'SIPHONO', key: ReceiverSettings.Source, value: { raw: 'PHONO', text: 'PHONO' } },
        { command: 'SICD', key: ReceiverSettings.Source, value: { raw: 'CD', text: 'CD' } },
        { command: 'SITUNER', key: ReceiverSettings.Source, value: { raw: 'TUNER', text: 'TUNER' } },
        { command: 'SIDVD', key: ReceiverSettings.Source, value: { raw: 'DVD', text: 'DVD' } },
        { command: 'SIBD', key: ReceiverSettings.Source, value: { raw: 'BD', text: 'BD' } },
        { command: 'SITV', key: ReceiverSettings.Source, value: { raw: 'TV', text: 'TV' } },
        {
          command: 'SISAT/CBL',
          key: ReceiverSettings.Source,
          value: { raw: 'SAT/CBL', text: 'SAT/CBL' },
        },
        { command: 'SIMPLAY', key: ReceiverSettings.Source, value: { raw: 'MPLAY', text: 'MPLAY' } },
        { command: 'SIGAME', key: ReceiverSettings.Source, value: { raw: 'GAME', text: 'GAME' } },
        {
          command: 'SIHDRADIO',
          key: ReceiverSettings.Source,
          value: { raw: 'HDRADIO', text: 'HDRADIO' },
        },
        { command: 'SINET', key: ReceiverSettings.Source, value: { raw: 'NET', text: 'NET' } },
        {
          command: 'SIPANDORA',
          key: ReceiverSettings.Source,
          value: { raw: 'PANDORA', text: 'PANDORA' },
        },
        {
          command: 'SISIRIUSXM',
          key: ReceiverSettings.Source,
          value: { raw: 'SIRIUSXM', text: 'SIRIUSXM' },
        },
        {
          command: 'SISPOTIFY',
          key: ReceiverSettings.Source,
          value: { raw: 'SPOTIFY', text: 'SPOTIFY' },
        },
        { command: 'SILASTFM', key: ReceiverSettings.Source, value: { raw: 'LASTFM', text: 'LASTFM' } },
        { command: 'SIFLICKR', key: ReceiverSettings.Source, value: { raw: 'FLICKR', text: 'FLICKR' } },
        { command: 'SIIRADIO', key: ReceiverSettings.Source, value: { raw: 'IRADIO', text: 'IRADIO' } },
        { command: 'SISERVER', key: ReceiverSettings.Source, value: { raw: 'SERVER', text: 'SERVER' } },
        {
          command: 'SIFAVORITES',
          key: ReceiverSettings.Source,
          value: { raw: 'FAVORITES', text: 'FAVORITES' },
        },
        { command: 'SIAUX1', key: ReceiverSettings.Source, value: { raw: 'AUX1', text: 'AUX1' } },
        { command: 'SIAUX2', key: ReceiverSettings.Source, value: { raw: 'AUX2', text: 'AUX2' } },
        { command: 'SIAUX3', key: ReceiverSettings.Source, value: { raw: 'AUX3', text: 'AUX3' } },
        { command: 'SIAUX4', key: ReceiverSettings.Source, value: { raw: 'AUX4', text: 'AUX4' } },
        { command: 'SIAUX5', key: ReceiverSettings.Source, value: { raw: 'AUX5', text: 'AUX5' } },
        { command: 'SIAUX6', key: ReceiverSettings.Source, value: { raw: 'AUX6', text: 'AUX6' } },
        { command: 'SIAUX7', key: ReceiverSettings.Source, value: { raw: 'AUX7', text: 'AUX7' } },
        { command: 'SIBT', key: ReceiverSettings.Source, value: { raw: 'BT', text: 'BT' } },
        {
          command: 'SIUSB/IPOD',
          key: ReceiverSettings.Source,
          value: { raw: 'USB/IPOD', text: 'USB/IPOD' },
        },
        { command: 'SIUSB', key: ReceiverSettings.Source, value: { raw: 'USB', text: 'USB' } },
        { command: 'SIIPD', key: ReceiverSettings.Source, value: { raw: 'IPD', text: 'IPD' } },
        { command: 'SIIRP', key: ReceiverSettings.Source, value: { raw: 'IRP', text: 'IRP' } },
        { command: 'SIFVP', key: ReceiverSettings.Source, value: { raw: 'FVP', text: 'FVP' } },
      ])('should handle main zone source command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('SD: SD commands', () => {
      it.each([
        { command: 'SDAUTO', key: ReceiverSettings.SD, value: { raw: 'AUTO', text: 'AUTO' } },
        { command: 'SDHDMI', key: ReceiverSettings.SD, value: { raw: 'HDMI', text: 'HDMI' } },
        { command: 'SDDIGITAL', key: ReceiverSettings.SD, value: { raw: 'DIGITAL', text: 'DIGITAL' } },
        { command: 'SDANALOG', key: ReceiverSettings.SD, value: { raw: 'ANALOG', text: 'ANALOG' } },
        { command: 'SDEXT.IN', key: ReceiverSettings.SD, value: { raw: 'EXT.IN', text: 'EXT.IN' } },
        { command: 'SD7.1IN', key: ReceiverSettings.SD, value: { raw: '7.1IN', text: '7.1IN' } },
        { command: 'SDNO', key: ReceiverSettings.SD, value: { raw: 'NO', text: 'NO' } },
      ])('should handle SD command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('DC: Digital Input commands', () => {
      it.each([
        {
          command: 'DCAUTO',
          key: ReceiverSettings.DigitalInput,
          value: { raw: 'AUTO', text: 'AUTO' },
        },
        { command: 'DCPCM', key: ReceiverSettings.DigitalInput, value: { raw: 'PCM', text: 'PCM' } },
        { command: 'DCDTS', key: ReceiverSettings.DigitalInput, value: { raw: 'DTS', text: 'DTS' } },
      ])('should handle digital input command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('SV: Video Select commands', () => {
      it.each([
        {
          command: 'SVDVD',
          key: ReceiverSettings.VideoSelectSource,
          value: { raw: 'DVD', text: 'DVD' },
        },
        {
          command: 'SVBD',
          key: ReceiverSettings.VideoSelectSource,
          value: { raw: 'BD', text: 'BD' },
        },
        {
          command: 'SVTV',
          key: ReceiverSettings.VideoSelectSource,
          value: { raw: 'TV', text: 'TV' },
        },
        {
          command: 'SVSAT/CBL',
          key: ReceiverSettings.VideoSelectSource,
          value: { raw: 'SAT/CBL', text: 'SAT/CBL' },
        },
        {
          command: 'SVMPLAY',
          key: ReceiverSettings.VideoSelectSource,
          value: { raw: 'MPLAY', text: 'MPLAY' },
        },
        {
          command: 'SVGAME',
          key: ReceiverSettings.VideoSelectSource,
          value: { raw: 'GAME', text: 'GAME' },
        },
        {
          command: 'SVAUX1',
          key: ReceiverSettings.VideoSelectSource,
          value: { raw: 'AUX1', text: 'AUX1' },
        },
        {
          command: 'SVAUX2',
          key: ReceiverSettings.VideoSelectSource,
          value: { raw: 'AUX2', text: 'AUX2' },
        },
        {
          command: 'SVAUX3',
          key: ReceiverSettings.VideoSelectSource,
          value: { raw: 'AUX3', text: 'AUX3' },
        },
        {
          command: 'SVAUX4',
          key: ReceiverSettings.VideoSelectSource,
          value: { raw: 'AUX4', text: 'AUX4' },
        },
        {
          command: 'SVAUX5',
          key: ReceiverSettings.VideoSelectSource,
          value: { raw: 'AUX5', text: 'AUX5' },
        },
        {
          command: 'SVAUX6',
          key: ReceiverSettings.VideoSelectSource,
          value: { raw: 'AUX6', text: 'AUX6' },
        },
        {
          command: 'SVAUX7',
          key: ReceiverSettings.VideoSelectSource,
          value: { raw: 'AUX7', text: 'AUX7' },
        },
        {
          command: 'SVCD',
          key: ReceiverSettings.VideoSelectSource,
          value: { raw: 'CD', text: 'CD' },
        },
        { command: 'SVON', key: ReceiverSettings.VideoSelect, value: { raw: 'ON', text: 'ON' } },
        { command: 'SVOFF', key: ReceiverSettings.VideoSelect, value: { raw: 'OFF', text: 'OFF' } },
      ])('should handle video select command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('MS: Surround Mode commands', () => {
      it.each([
        {
          command: 'MSMOVIE',
          key: ReceiverSettings.SurroundMode,
          value: { raw: 'MOVIE', text: 'MOVIE' },
        },
        {
          command: 'MSMUSIC',
          key: ReceiverSettings.SurroundMode,
          value: { raw: 'MUSIC', text: 'MUSIC' },
        },
        {
          command: 'MSGAME',
          key: ReceiverSettings.SurroundMode,
          value: { raw: 'GAME', text: 'GAME' },
        },
        {
          command: 'MSDIRECT',
          key: ReceiverSettings.SurroundMode,
          value: { raw: 'DIRECT', text: 'DIRECT' },
        },
        {
          command: 'MSPURE DIRECT',
          key: ReceiverSettings.SurroundMode,
          value: { raw: 'PURE DIRECT', text: 'PURE DIRECT' },
        },
        {
          command: 'MSSTEREO',
          key: ReceiverSettings.SurroundMode,
          value: { raw: 'STEREO', text: 'STEREO' },
        },
        {
          command: 'MSAUTO',
          key: ReceiverSettings.SurroundMode,
          value: { raw: 'AUTO', text: 'AUTO' },
        },
        {
          command: 'MSDOLBY DIGITAL',
          key: ReceiverSettings.SurroundMode,
          value: { raw: 'DOLBY DIGITAL', text: 'DOLBY DIGITAL' },
        },
        {
          command: 'MSDTS SURROUND',
          key: ReceiverSettings.SurroundMode,
          value: { raw: 'DTS SURROUND', text: 'DTS SURROUND' },
        },
      ])('should handle surround mode command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('PS: Parameter commands', () => {
      it.each([
        {
          command: 'PSTONE CTRL ON',
          key: ReceiverSettings.Parameters,
          value: { raw: 'TONE CTRL ON', key: 'TONE CTRL', value: 'ON' },
        },
        {
          command: 'PSTONE CTRL OFF',
          key: ReceiverSettings.Parameters,
          value: { raw: 'TONE CTRL OFF', key: 'TONE CTRL', value: 'OFF' },
        },
      ])('should handle surround mode command $command', (data: TestData) => {
        runTestCase(data);
      });

      it('should ignore PSEND', () => {
        const result = parse('PSEND');
        expect(result.handled).toBeFalsy();
      });

      it('should return blank if no space', () => {
        const result = parse('PSOOPS');
        expect(result.value).toEqual({ raw: 'OOPS', key: 'OOPS', value: '' });
      });

      it('should return blank if no value', () => {
        const result = parse('PSBAS');
        expect(result.value).toEqual({ raw: 'BAS', key: 'BAS', value: '' });
      });
    });
  });

  describe('SS: Surround Level commands', () => {
    it.each(
      Object.keys(SpeakerCodes.codesToNames).map((key) => {
        return { command: `SSLEV${key} 50`, key: ReceiverSettings.SSLevels, value: { raw: `LEV${key} 50`, key, value: '50', numeric: 50 } };
      }),
    )('should handle surround level command $command', (data: TestData) => {
      runTestCase(data);
    });

    it('should ignore invalid SS commands', () => {
      const result = parse('SSXX');
      expect(result.handled).toBeFalsy();
    });

    it('should return blank if no value', () => {
      const result = parse('SSLEVSDL');
      expect(result.value).toEqual({ raw: 'LEVSDL', key: 'SDL', value: '' });
    });
  });

  describe('SSSPC: Surround Speaker commands', () => {
    it.each([
      {
        command: 'SSSPCFRO SMA',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCFRO SMA', key: 'FRO', value: 'SMA' },
      },
      {
        command: 'SSSPCCEN SMA',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCCEN SMA', key: 'CEN', value: 'SMA' },
      },
      {
        command: 'SSSPCSUA SMA',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCSUA SMA', key: 'SUA', value: 'SMA' },
      },
      {
        command: 'SSSPCSBK 2SP',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCSBK 2SP', key: 'SBK', value: '2SP' },
      },
      {
        command: 'SSSPCFRH NON',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCFRH NON', key: 'FRH', value: 'NON' },
      },
      {
        command: 'SSSPCTFR NON',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCTFR NON', key: 'TFR', value: 'NON' },
      },
      {
        command: 'SSSPCTPM NON',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCTPM NON', key: 'TPM', value: 'NON' },
      },
      {
        command: 'SSSPCFRD NON',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCFRD NON', key: 'FRD', value: 'NON' },
      },
      {
        command: 'SSSPCSUD NON',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCSUD NON', key: 'SUD', value: 'NON' },
      },
      {
        command: 'SSSPCTPR NON',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCTPR NON', key: 'TPR', value: 'NON' },
      },
      {
        command: 'SSSPCRHE NON',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCRHE NON', key: 'RHE', value: 'NON' },
      },
      {
        command: 'SSSPCBKD NON',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCBKD NON', key: 'BKD', value: 'NON' },
      },
      {
        command: 'SSSPCSHE NON',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCSHE NON', key: 'SHE', value: 'NON' },
      },
      {
        command: 'SSSPCTPS NON',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCTPS NON', key: 'TPS', value: 'NON' },
      },
      {
        command: 'SSSPCSWF 1SP',
        key: ReceiverSettings.SSSpeakers,
        value: { raw: 'SPCSWF 1SP', key: 'SWF', value: '1SP' },
      },
    ])('should handle surround speaker command $command', (data: TestData) => {
      runTestCase(data);
    });

    it('should return blank if no value', () => {
      const result = parse('SSSPCSWF');
      expect(result.value).toEqual({ raw: 'SPCSWF', key: 'SWF', value: '' });
    });
  });
});
