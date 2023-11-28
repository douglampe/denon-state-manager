import { ReceiverSettings } from './ReceiverSettings';
import { StateValue } from './StateValue';

export interface ParserResult {
  handled: boolean;
  key?: ReceiverSettings;
  value?: StateValue;
}
