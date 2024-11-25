export interface StateValue {
  raw: string;
  numeric?: number;
  text?: string;
  enum?: number;
  key?: string;
  value?: string;
  decimal?: boolean;
  dictionary?: Record<string, string>;
}
