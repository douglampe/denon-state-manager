import { ReceiverSettings } from './ReceiverSettings';

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
    [ReceiverSettings.Source]: 'SI',
    [ReceiverSettings.VideoSelect]: 'SV',
    [ReceiverSettings.SD]: 'SD',
    [ReceiverSettings.DigitalInput]: 'DC',
    [ReceiverSettings.SurroundMode]: 'MS',
    [ReceiverSettings.Power]: 'ZM',
    [ReceiverSettings.Mute]: 'MU',
    [ReceiverSettings.Volume]: 'MV',
  };

  public static zoneCommandMap: { [key in ReceiverSettings]?: string } = {
    [ReceiverSettings.Source]: '',
    [ReceiverSettings.Power]: '',
    [ReceiverSettings.Mute]: 'MU',
    [ReceiverSettings.Volume]: '',
  };

  public static getCommand(setting: ReceiverSettings, value: string, zone?: number): string | undefined {
    if (zone) {
      const command = MessageFormatter.zoneCommandMap[setting];
      if (typeof command !== 'undefined') {
        return `Z${zone}${command}${value}`;
      }
    } else {
      const command = MessageFormatter.mainZoneCommandMap[setting];
      if (command) {
        return `${command}${value}`;
      }
    }
  }

  public static sendStatusRequests(cb: (command: string) => void): void {
    for (const command of MessageFormatter.statusRequestCommands) {
      cb(command);
    }
  }
}
