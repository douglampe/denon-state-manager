import { ReceiverSettings } from './ReceiverSettings';
import { KeyValue } from './KeyValue';

export class MessageFormatter {
  public static statusRequestCommands = [
    'SI?',
    'PW?',
    'MV?',
    'CV?',
    'MU?',
    'ZM?',
    'SR?',
    'SD?',
    'DC?',
    'SV?',
    'SLP?',
    'MS?',
    'Z2?',
    'Z2MU?',
    'Z2CS?',
    'Z2CV?',
    'Z2HPF?',
    'Z2QUICK ?',
    'Z3?',
    'Z3MU?',
    'Z3CS?',
    'Z3CV?',
    'Z3HPF?',
    'Z3QUICK ?',
    'SSSPC ?',
    'PSCLV ?',
    'PSSWL ?',
    'SSLEV ?',
  ];

  public static mainZoneCommandMap: { [key in ReceiverSettings]?: string } = {
    [ReceiverSettings.MainPower]: 'PW',
    [ReceiverSettings.Volume]: 'MV',
    [ReceiverSettings.ChannelVolume]: 'CV',
    [ReceiverSettings.Mute]: 'MU',
    [ReceiverSettings.Source]: 'SI',
    [ReceiverSettings.Power]: 'ZM',
    [ReceiverSettings.SD]: 'SD',
    [ReceiverSettings.DigitalInput]: 'DC',
    [ReceiverSettings.VideoSelect]: 'SV',
    [ReceiverSettings.Sleep]: 'SLP',
    [ReceiverSettings.Standby]: 'STBY',
    [ReceiverSettings.ECOMode]: 'ECO',
    [ReceiverSettings.SurroundMode]: 'MS',
    [ReceiverSettings.Parameters]: 'PS',
  };

  public static zoneCommandMap: { [key in ReceiverSettings]?: string } = {
    [ReceiverSettings.Source]: '',
    [ReceiverSettings.Power]: '',
    [ReceiverSettings.Volume]: '',
    [ReceiverSettings.Mute]: 'MU',
    [ReceiverSettings.QuickSelect]: 'QUICK',
    [ReceiverSettings.ChannelSetting]: 'CS',
    [ReceiverSettings.ChannelVolume]: 'CV',
    [ReceiverSettings.HPF]: 'HPF',
    [ReceiverSettings.Parameters]: 'PS',
    [ReceiverSettings.Sleep]: 'SLP',
    [ReceiverSettings.Standby]: 'STBY',
  };

  public static getCommand(setting: ReceiverSettings, value: string, zone?: number): string | undefined {
    let processedValue: string;

    switch(setting) {
      case ReceiverSettings.ChannelVolume:
        const valueData: KeyValue = JSON.parse(value);
        processedValue = `${valueData.key} ${valueData.value}`;
        break;
      default:
        processedValue = value;
    }
    if (zone) {
      const command = MessageFormatter.zoneCommandMap[setting];
      if (typeof command !== 'undefined') {
        return `Z${zone}${command}${processedValue}`;
      }
    } else {
      const command = MessageFormatter.mainZoneCommandMap[setting];
      if (command) {
        return `${command}${processedValue}`;
      }
    }
  }

  public static sendStatusRequests(cb: (command: string) => void): void {
    for (const command of MessageFormatter.statusRequestCommands) {
      cb(command);
    }
  }
}
