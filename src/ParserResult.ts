import { ReceiverSettings } from './ReceiverSettings';

export interface ParserResult {
  handled: boolean;
  key?: ReceiverSettings;
  value?: string;
}
