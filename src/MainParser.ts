import { BaseParser } from './BaseParser';
import { ReceiverSettings } from './ReceiverSettings';
import { ReceiverState } from './ReceiverState';

export class MainParser extends BaseParser {
  constructor(state: ReceiverState) {
    super(state);
    this.populateMap();
  }

  populateMap(): void {
    [{ prefix: 'SV', key: ReceiverSettings.VideoSelect, list: ['ON', 'OFF'] }].map((i) => this.addListParser(i));

    [
      { prefix: 'SI', key: ReceiverSettings.Source },
      { prefix: 'SV', key: ReceiverSettings.VideoSelectSource },
      { prefix: 'SD', key: ReceiverSettings.SD },
      { prefix: 'DC', key: ReceiverSettings.DigitalInput },
      { prefix: 'MS', key: ReceiverSettings.SurroundMode },
      { prefix: 'PW', key: ReceiverSettings.MainPower },
      { prefix: 'ZM', key: ReceiverSettings.Power },
      { prefix: 'MU', key: ReceiverSettings.Mute },
    ].map((i) => this.addPassthroughParser(i));

    [{ prefix: 'MV', key: ReceiverSettings.MaxVolume, firstPart: 'MAX' }].map((i) => this.addDelimitedParser(i));

    [
      { prefix: 'SL', key: ReceiverSettings.Sleep, ending: 'P' },
      { prefix: 'ST', key: ReceiverSettings.Standby, ending: 'BY' },
      { prefix: 'EC', key: ReceiverSettings.ECOMode, ending: 'O' },
    ].map((i) => this.addLongPrefixParser(i));

    this.addParser('CV', (data: string) => {
      if (data !== 'END') {
        const parts = data.split(' ');
        const key = parts[0];
        const value = parts.length > 1 ? parts[1] : '';
        return {
          handled: true,
          key: ReceiverSettings.ChannelVolume,
          value: { raw: data, key, value },
        };
      }
      return {
        handled: false,
      };
    });

    this.addParser('MV', (data: string) => {
      const volume = parseInt(data);
      if (!isNaN(volume)) {
        return {
          handled: true,
          key: ReceiverSettings.Volume,
          value: { raw: data, numeric: volume },
          zone: 1,
        };
      }
      return {
        handled: false,
      };
    });

    this.addParser('PS', (data: string) => {
      if (data !== 'END') {
        const lastSpaceIndex = data.lastIndexOf(' ');
        const key = lastSpaceIndex > -1 ? data.substring(0, lastSpaceIndex) : data;
        const value = lastSpaceIndex > -1 ? data.substring(lastSpaceIndex + 1) : '';
        return {
          handled: true,
          key: ReceiverSettings.Parameters,
          value: { raw: data, key, value },
        };
      }
      return {
        handled: false,
      };
    });

    this.addParser('SS', (data: string) => {
      if (data.startsWith('LEV') && data !== 'LEV END') {
        const parts = data.substring(3).split(' ');
        const key = parts[0];
        const value = parts.length > 1 ? parts[1] : '';
        return {
          handled: true,
          key: ReceiverSettings.SSLevels,
          value: { raw: data, key, value },
        };
      }
      if (data.startsWith('SPC') && data !== 'SPC END') {
        const parts = data.substring(3).split(' ');
        const key = parts[0];
        const value = parts.length > 1 ? parts[1] : '';
        return {
          handled: true,
          key: ReceiverSettings.SSSpeakers,
          value: { raw: data, key, value },
        };
      }
      return {
        handled: false,
      };
    });
  }
}
