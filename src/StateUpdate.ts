import { ReceiverSettings } from "./ReceiverSettings";
import { StateValue } from "./StateValue";

export interface StateUpdate {
  key: ReceiverSettings,
  value: StateValue,
}