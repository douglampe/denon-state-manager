import { MainParser } from './MainParser';
import { ParserResult } from './ParserResult';
import { ReceiverSettings } from './ReceiverSettings';
import { ReceiverState } from './ReceiverState';

interface TestData {
  command: string;
  key: ReceiverSettings;
  value: string;
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
        { command: 'PWON', key: ReceiverSettings.MainPower, value: 'ON' },
        { command: 'PWOFF', key: ReceiverSettings.MainPower, value: 'OFF' },
      ])('should handle global command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('General Main Zone commands', () => {
      it.each([
        { command: 'MV50', key: ReceiverSettings.Volume, value: '50' },
        { command: 'MUON', key: ReceiverSettings.Mute, value: 'ON' },
        { command: 'MUOFF', key: ReceiverSettings.Mute, value: 'OFF' },
        { command: 'ZMON', key: ReceiverSettings.Power, value: 'ON' },
        { command: 'ZMOFF', key: ReceiverSettings.Power, value: 'OFF' },
        { command: 'ZMOFF', key: ReceiverSettings.Power, value: 'OFF' },
        { command: 'ZMOFF', key: ReceiverSettings.Power, value: 'OFF' },
        { command: 'ZMOFF', key: ReceiverSettings.Power, value: 'OFF' },
        { command: 'SLPOFF', key: ReceiverSettings.Sleep, value: 'OFF' },
        { command: 'SLP60', key: ReceiverSettings.Sleep, value: '60' },
        { command: 'STBY15M', key: ReceiverSettings.Standby, value: '15M' },
        { command: 'STBY30M', key: ReceiverSettings.Standby, value: '30M' },
        { command: 'STBY60M', key: ReceiverSettings.Standby, value: '60M' },
        { command: 'STBYOFF', key: ReceiverSettings.Standby, value: 'OFF' },
        { command: 'ECOON', key: ReceiverSettings.ECOMode, value: 'ON' },
        { command: 'ECOAUTO', key: ReceiverSettings.ECOMode, value: 'AUTO' },
        { command: 'ECOOFF', key: ReceiverSettings.ECOMode, value: 'OFF' },
      ])('should handle main zone command $command', (data: TestData) => {
        runTestCase(data);
      });

      it('should ignore invalid volumes', () => {
        const result = parse('MVXX');
        expect(result.handled).toBeFalsy();
      });
    });

    describe('CV: Channel Volume Commands', () => {
      it.each([
        {
          command: 'CVFL 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"FL","volume":"50"}',
        },
        {
          command: 'CVFR 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"FR","volume":"50"}',
        },
        {
          command: 'CVC 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"C","volume":"50"}',
        },
        {
          command: 'CVSW 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"SW","volume":"50"}',
        },
        {
          command: 'CVSW2 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"SW2","volume":"50"}',
        },
        {
          command: 'CVSL 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"SL","volume":"50"}',
        },
        {
          command: 'CVSR 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"SR","volume":"50"}',
        },
        {
          command: 'CVSBL 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"SBL","volume":"50"}',
        },
        {
          command: 'CVSBR 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"SBR","volume":"50"}',
        },
        {
          command: 'CVSB 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"SB","volume":"50"}',
        },
        {
          command: 'CVFHL 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"FHL","volume":"50"}',
        },
        {
          command: 'CVFHR 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"FHR","volume":"50"}',
        },
        {
          command: 'CVFWL 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"FWL","volume":"50"}',
        },
        {
          command: 'CVFWR 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"FWR","volume":"50"}',
        },
        {
          command: 'CVTFL 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"TFL","volume":"50"}',
        },
        {
          command: 'CVTFR 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"TFR","volume":"50"}',
        },
        {
          command: 'CVTML 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"TML","volume":"50"}',
        },
        {
          command: 'CVTMR 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"TMR","volume":"50"}',
        },
        {
          command: 'CVTRL 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"TRL","volume":"50"}',
        },
        {
          command: 'CVTRR 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"TRR","volume":"50"}',
        },
        {
          command: 'CVRHL 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"RHL","volume":"50"}',
        },
        {
          command: 'CVRHR 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"RHR","volume":"50"}',
        },
        {
          command: 'CVFDL 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"FDL","volume":"50"}',
        },
        {
          command: 'CVFDR 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"FDR","volume":"50"}',
        },
        {
          command: 'CVSDL 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"SDL","volume":"50"}',
        },
        {
          command: 'CVSDR 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"SDR","volume":"50"}',
        },
        {
          command: 'CVBDL 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"BDL","volume":"50"}',
        },
        {
          command: 'CVBDR 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"BDR","volume":"50"}',
        },
        {
          command: 'CVSHL 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"SHL","volume":"50"}',
        },
        {
          command: 'CVSHR 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"SHR","volume":"50"}',
        },
        {
          command: 'CVTS 50',
          key: ReceiverSettings.ChannelVolume,
          value: '{"channel":"TS","volume":"50"}',
        },
      ])('should handle channel volume command $command', (data: TestData) => {
        runTestCase(data);
      });

      it('should ignore CVEND', () => {
        const result = parse('CVEND');
        expect(result.handled).toBeFalsy();
      });

      it('should return blank if no volume', () => {
        const result = parse('CVC');
        expect(result.value).toEqual('{"channel":"C","volume":""}');
      });
    });

    describe('SI: Main Zone Source Commands', () => {
      it.each([
        { command: 'SIPHONO', key: ReceiverSettings.Source, value: 'PHONO' },
        { command: 'SICD', key: ReceiverSettings.Source, value: 'CD' },
        { command: 'SITUNER', key: ReceiverSettings.Source, value: 'TUNER' },
        { command: 'SIDVD', key: ReceiverSettings.Source, value: 'DVD' },
        { command: 'SIBD', key: ReceiverSettings.Source, value: 'BD' },
        { command: 'SITV', key: ReceiverSettings.Source, value: 'TV' },
        {
          command: 'SISAT/CBL',
          key: ReceiverSettings.Source,
          value: 'SAT/CBL',
        },
        { command: 'SIMPLAY', key: ReceiverSettings.Source, value: 'MPLAY' },
        { command: 'SIGAME', key: ReceiverSettings.Source, value: 'GAME' },
        {
          command: 'SIHDRADIO',
          key: ReceiverSettings.Source,
          value: 'HDRADIO',
        },
        { command: 'SINET', key: ReceiverSettings.Source, value: 'NET' },
        {
          command: 'SIPANDORA',
          key: ReceiverSettings.Source,
          value: 'PANDORA',
        },
        {
          command: 'SISIRIUSXM',
          key: ReceiverSettings.Source,
          value: 'SIRIUSXM',
        },
        {
          command: 'SISPOTIFY',
          key: ReceiverSettings.Source,
          value: 'SPOTIFY',
        },
        { command: 'SILASTFM', key: ReceiverSettings.Source, value: 'LASTFM' },
        { command: 'SIFLICKR', key: ReceiverSettings.Source, value: 'FLICKR' },
        { command: 'SIIRADIO', key: ReceiverSettings.Source, value: 'IRADIO' },
        { command: 'SISERVER', key: ReceiverSettings.Source, value: 'SERVER' },
        {
          command: 'SIFAVORITES',
          key: ReceiverSettings.Source,
          value: 'FAVORITES',
        },
        { command: 'SIAUX1', key: ReceiverSettings.Source, value: 'AUX1' },
        { command: 'SIAUX2', key: ReceiverSettings.Source, value: 'AUX2' },
        { command: 'SIAUX3', key: ReceiverSettings.Source, value: 'AUX3' },
        { command: 'SIAUX4', key: ReceiverSettings.Source, value: 'AUX4' },
        { command: 'SIAUX5', key: ReceiverSettings.Source, value: 'AUX5' },
        { command: 'SIAUX6', key: ReceiverSettings.Source, value: 'AUX6' },
        { command: 'SIAUX7', key: ReceiverSettings.Source, value: 'AUX7' },
        { command: 'SIBT', key: ReceiverSettings.Source, value: 'BT' },
        {
          command: 'SIUSB/IPOD',
          key: ReceiverSettings.Source,
          value: 'USB/IPOD',
        },
        { command: 'SIUSB', key: ReceiverSettings.Source, value: 'USB' },
        { command: 'SIIPD', key: ReceiverSettings.Source, value: 'IPD' },
        { command: 'SIIRP', key: ReceiverSettings.Source, value: 'IRP' },
        { command: 'SIFVP', key: ReceiverSettings.Source, value: 'FVP' },
      ])('should handle main zone source command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('SD: SD commands', () => {
      it.each([
        { command: 'SDAUTO', key: ReceiverSettings.SD, value: 'AUTO' },
        { command: 'SDHDMI', key: ReceiverSettings.SD, value: 'HDMI' },
        { command: 'SDDIGITAL', key: ReceiverSettings.SD, value: 'DIGITAL' },
        { command: 'SDANALOG', key: ReceiverSettings.SD, value: 'ANALOG' },
        { command: 'SDEXT.IN', key: ReceiverSettings.SD, value: 'EXT.IN' },
        { command: 'SD7.1IN', key: ReceiverSettings.SD, value: '7.1IN' },
        { command: 'SDNO', key: ReceiverSettings.SD, value: 'NO' },
      ])('should handle SD command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('DC: Digital Input commands', () => {
      it.each([
        {
          command: 'DCAUTO',
          key: ReceiverSettings.DigitalInput,
          value: 'AUTO',
        },
        { command: 'DCPCM', key: ReceiverSettings.DigitalInput, value: 'PCM' },
        { command: 'DCDTS', key: ReceiverSettings.DigitalInput, value: 'DTS' },
      ])('should handle digital input command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('SV: Video Select commands', () => {
      it.each([
        {
          command: 'SVDVD',
          key: ReceiverSettings.VideoSelectSource,
          value: 'DVD',
        },
        {
          command: 'SVBD',
          key: ReceiverSettings.VideoSelectSource,
          value: 'BD',
        },
        {
          command: 'SVTV',
          key: ReceiverSettings.VideoSelectSource,
          value: 'TV',
        },
        {
          command: 'SVSAT/CBL',
          key: ReceiverSettings.VideoSelectSource,
          value: 'SAT/CBL',
        },
        {
          command: 'SVMPLAY',
          key: ReceiverSettings.VideoSelectSource,
          value: 'MPLAY',
        },
        {
          command: 'SVGAME',
          key: ReceiverSettings.VideoSelectSource,
          value: 'GAME',
        },
        {
          command: 'SVAUX1',
          key: ReceiverSettings.VideoSelectSource,
          value: 'AUX1',
        },
        {
          command: 'SVAUX2',
          key: ReceiverSettings.VideoSelectSource,
          value: 'AUX2',
        },
        {
          command: 'SVAUX3',
          key: ReceiverSettings.VideoSelectSource,
          value: 'AUX3',
        },
        {
          command: 'SVAUX4',
          key: ReceiverSettings.VideoSelectSource,
          value: 'AUX4',
        },
        {
          command: 'SVAUX5',
          key: ReceiverSettings.VideoSelectSource,
          value: 'AUX5',
        },
        {
          command: 'SVAUX6',
          key: ReceiverSettings.VideoSelectSource,
          value: 'AUX6',
        },
        {
          command: 'SVAUX7',
          key: ReceiverSettings.VideoSelectSource,
          value: 'AUX7',
        },
        {
          command: 'SVCD',
          key: ReceiverSettings.VideoSelectSource,
          value: 'CD',
        },
        { command: 'SVON', key: ReceiverSettings.VideoSelect, value: 'ON' },
        { command: 'SVOFF', key: ReceiverSettings.VideoSelect, value: 'OFF' },
      ])('should handle video select command $command', (data: TestData) => {
        runTestCase(data);
      });
    });

    describe('MS: Surround Mode commands', () => {
      it.each([
        {
          command: 'MSMOVIE',
          key: ReceiverSettings.SurroundMode,
          value: 'MOVIE',
        },
        {
          command: 'MSMUSIC',
          key: ReceiverSettings.SurroundMode,
          value: 'MUSIC',
        },
        {
          command: 'MSGAME',
          key: ReceiverSettings.SurroundMode,
          value: 'GAME',
        },
        {
          command: 'MSDIRECT',
          key: ReceiverSettings.SurroundMode,
          value: 'DIRECT',
        },
        {
          command: 'MSPURE DIRECT',
          key: ReceiverSettings.SurroundMode,
          value: 'PURE DIRECT',
        },
        {
          command: 'MSSTEREO',
          key: ReceiverSettings.SurroundMode,
          value: 'STEREO',
        },
        {
          command: 'MSAUTO',
          key: ReceiverSettings.SurroundMode,
          value: 'AUTO',
        },
        {
          command: 'MSDOLBY DIGITAL',
          key: ReceiverSettings.SurroundMode,
          value: 'DOLBY DIGITAL',
        },
        {
          command: 'MSDTS SURROUND',
          key: ReceiverSettings.SurroundMode,
          value: 'DTS SURROUND',
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
          value: '{"key":"TONE CTRL","value":"ON"}',
        },
        {
          command: 'PSTONE CTRL OFF',
          key: ReceiverSettings.Parameters,
          value: '{"key":"TONE CTRL","value":"OFF"}',
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
        expect(result.value).toEqual('{"key":"OOPS","value":""}');
      });

      it('should return blank if no value', () => {
        const result = parse('PSBAS');
        expect(result.value).toEqual('{"key":"BAS","value":""}');
      });
    });
  });

  describe('SS: Surround Level commands', () => {
    it.each([
      {
        command: 'SSLEVFL 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"FL","level":"50"}',
      },
      {
        command: 'SSLEVFR 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"FR","level":"50"}',
      },
      {
        command: 'SSLEVSL 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"SL","level":"50"}',
      },
      {
        command: 'SSLEVSR 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"SR","level":"50"}',
      },
      {
        command: 'SSLEVSBL 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"SBL","level":"50"}',
      },
      {
        command: 'SSLEVSBR 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"SBR","level":"50"}',
      },
      {
        command: 'SSLEVSB 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"SB","level":"50"}',
      },
      {
        command: 'SSLEVFHL 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"FHL","level":"50"}',
      },
      {
        command: 'SSLEVFHR 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"FHR","level":"50"}',
      },
      {
        command: 'SSLEVTFL 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"TFL","level":"50"}',
      },
      {
        command: 'SSLEVTFR 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"TFR","level":"50"}',
      },
      {
        command: 'SSLEVTML 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"TML","level":"50"}',
      },
      {
        command: 'SSLEVTMR 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"TMR","level":"50"}',
      },
      {
        command: 'SSLEVFDL 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"FDL","level":"50"}',
      },
      {
        command: 'SSLEVFDR 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"FDR","level":"50"}',
      },
      {
        command: 'SSLEVSDL 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"SDL","level":"50"}',
      },
      {
        command: 'SSLEVSDR 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"SDR","level":"50"}',
      },
      {
        command: 'SSLEVFWL 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"FWL","level":"50"}',
      },
      {
        command: 'SSLEVFWR 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"FWR","level":"50"}',
      },
      {
        command: 'SSLEVTRL 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"TRL","level":"50"}',
      },
      {
        command: 'SSLEVTRR 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"TRR","level":"50"}',
      },
      {
        command: 'SSLEVRHL 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"RHL","level":"50"}',
      },
      {
        command: 'SSLEVRHR 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"RHR","level":"50"}',
      },
      {
        command: 'SSLEVBDL 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"BDL","level":"50"}',
      },
      {
        command: 'SSLEVBDR 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"BDR","level":"50"}',
      },
      {
        command: 'SSLEVSHL 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"SHL","level":"50"}',
      },
      {
        command: 'SSLEVSHR 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"SHR","level":"50"}',
      },
      {
        command: 'SSLEVTS 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"TS","level":"50"}',
      },
      {
        command: 'SSLEVSW 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"SW","level":"50"}',
      },
      {
        command: 'SSLEVSW2 50',
        key: ReceiverSettings.SSLevels,
        value: '{"channel":"SW2","level":"50"}',
      },
    ])('should handle surround level command $command', (data: TestData) => {
      runTestCase(data);
    });

    it('should ignore invalid SS commands', () => {
      const result = parse('SSXX');
      expect(result.handled).toBeFalsy();
    });

    it('should return blank if no value', () => {
      const result = parse('SSLEVSDL');
      expect(result.value).toEqual('{"channel":"SDL","level":""}');
    });
  });

  describe('SSSPC: Surround Speaker commands', () => {
    it.each([
      {
        command: 'SSSPCFRO SMA',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"FRO","type":"SMA"}',
      },
      {
        command: 'SSSPCCEN SMA',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"CEN","type":"SMA"}',
      },
      {
        command: 'SSSPCSUA SMA',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"SUA","type":"SMA"}',
      },
      {
        command: 'SSSPCSBK 2SP',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"SBK","type":"2SP"}',
      },
      {
        command: 'SSSPCFRH NON',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"FRH","type":"NON"}',
      },
      {
        command: 'SSSPCTFR NON',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"TFR","type":"NON"}',
      },
      {
        command: 'SSSPCTPM NON',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"TPM","type":"NON"}',
      },
      {
        command: 'SSSPCFRD NON',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"FRD","type":"NON"}',
      },
      {
        command: 'SSSPCSUD NON',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"SUD","type":"NON"}',
      },
      {
        command: 'SSSPCTPR NON',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"TPR","type":"NON"}',
      },
      {
        command: 'SSSPCRHE NON',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"RHE","type":"NON"}',
      },
      {
        command: 'SSSPCBKD NON',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"BKD","type":"NON"}',
      },
      {
        command: 'SSSPCSHE NON',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"SHE","type":"NON"}',
      },
      {
        command: 'SSSPCTPS NON',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"TPS","type":"NON"}',
      },
      {
        command: 'SSSPCSWF 1SP',
        key: ReceiverSettings.SSSpeakers,
        value: '{"channel":"SWF","type":"1SP"}',
      },
    ])('should handle surround speaker command $command', (data: TestData) => {
      runTestCase(data);
    });

    it('should return blank if no value', () => {
      const result = parse('SSSPCSWF');
      expect(result.value).toEqual('{"channel":"SWF","type":""}');
    });
  });
});
