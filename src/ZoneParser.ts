import { BaseParser } from './BaseParser';
import { ParserResult } from './ParserResult';
import { ReceiverSettings } from './ReceiverSettings';
import { ReceiverState } from './ReceiverState';

export class ZoneParser extends BaseParser {
  constructor(
    state: ReceiverState,
    private zonePrefix: string,
  ) {
    super(state);
  }

  public parse(data: string): ParserResult {
    if (data.startsWith(this.zonePrefix)) {
      return this.parseZone(data.substring(2));
    }
    return {
      handled: false,
    };
  }

  public handle(data: string): boolean {
    const result = this.parse(data);
    if (result.handled) {
      this.updateState(result.key, result.value!);
    }
    return result.handled;
  }

  parseZone(data: string): ParserResult {
    if (data === 'ON' || data === 'OFF') {
      return {
        handled: true,
        key: ReceiverSettings.Power,
        value: this.formatResult({ raw: data }),
      };
    }
    if (data.startsWith('CV')) {
      const suffix = data.substring(2);
      const parts = suffix.split(' ');
      const key = parts[0];
      const value = parts.length > 1 ? parts[1] : '';
      return {
        handled: true,
        key: ReceiverSettings.ChannelVolume,
        value: this.formatResult({ raw: suffix, key, value }),
      };
    }
    if (data.startsWith('MU')) {
      const suffix = data.substring(2);
      return {
        handled: true,
        key: ReceiverSettings.Mute,
        value: this.formatResult({ raw: suffix }),
      };
    }
    if (data.startsWith('CS')) {
      const suffix = data.substring(2);
      return {
        handled: true,
        key: ReceiverSettings.ChannelSetting,
        value: this.formatResult({ raw: suffix }),
      };
    }
    if (data.startsWith('HPF')) {
      const suffix = data.substring(3);
      return {
        handled: true,
        key: ReceiverSettings.HPF,
        value: this.formatResult({ raw: suffix }),
      };
    }
    if (data.startsWith('QUICK')) {
      const suffix = data.substring(5);
      return {
        handled: true,
        key: ReceiverSettings.QuickSelect,
        value: this.formatResult({ raw: suffix }),
      };
    }
    const volume = parseInt(data);
    if (!isNaN(volume) || data == '00') {
      return {
        handled: true,
        key: ReceiverSettings.Volume,
        value: this.formatResult({ raw: data }),
      };
    }
    return {
      handled: true,
      key: ReceiverSettings.Source,
      value: this.formatResult({ raw: data }),
    };
  }
}
