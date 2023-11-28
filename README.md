# denon-state-manager

## Getting Started

```bash
yarn add denon-state-manager
# OR
npm i denon-state-manager
```

## What is This?

This package provides bi-directional parsing and state management for the Denon AVR control protocol. This protocol is
supported by many Denon and Marantz Audio Video Receivers (AVRs). While it does not provide 100% compatibility with
the protocol, it has been developed in line with documentation for version ("Application model") AVR-3312CI/AVR-3312
and version 0.06 of the specification for AVR-S700, S900, X1100, X3100, X4100, X5200, and X7200. It has been tested 
with the following receiver models:

- S950H
- X4500H

## Why Does This Exist?

Denon AVRs support both RS-232C and Ethernet interfaces. The Ethernet interface is a TCP interface which does not 
require any authentication or authorization. The interface is bi-directional meaning that changes made to the reciever
by other sources (ex: using the remote control) are broadcasted to the interface. This makes the interface ideal for
integrating with systems which operate best while maitaining accurate state such as the Home Automation platform 
Home Assistant.

Unfortunately, Home Assistant supports only Python, but it does support MQTT. Therefore, it is possible to build an
MQTT interface using Node.js. Also, the Denon mobile application is
lacking in capabilities. Therefore, there is demand for a third-party React Native application to provide additional 
controls and ease of use. This package is intended to support both efforts as well as any additional use cases for a 
Node.js interface.

## Requesting Latest State

```TypeScript
import { MessageFormatter } from 'denon-state-manager';

// Log each status request command:
console.log(MessageFormatter.sendStatusRequests((command) => { console.log(command)});

```

## Parsing Commands

```TypeScript
import { ReceiverState, MainParser, ZoneParser } from 'denon-state-manager';

const mainZoneState = new ReceiverState();
const zone2State = new ReceiverState();
const zone3State = new ReceiverState();

const mainZoneParser = new MainParser(mainZoneSate);
const zone2Parser = new Zone2Parer(zone2State, 'Z2');
const zone3Parser = new Zone3Parser(zone3State, 'Z3');

function parse(command: string): void {
  if (mainZoneParser.handle(command)) {
    const updated = mainZoneState.popUpdated();
    const value = mainZoneState.getUpdated(updated);
    console.log(`${updated}: ${value.text}`);
  } else if (zone2Parser.handle(command)) {
    const updated = zone2State.popUpdated();
    const value = zone2State.getUpdated(updated);
    console.log(`${updated}: ${value.numeric}`);
  } else if (zone3Parser.handle(command)) {
    const updated = zone3State.popUpdated();
    const value = zone3State.getUpdated(updated);
    console.log(`${updated}: ${value.key}/${value.value}`);
  }
}
```

## Usage

```TypeScript
import { StateManager, ReceiverState, MessageFormatter } from 'denon-state-manager';

// Create an instance. Zone2 and Zone3 states are optional.
const stateManager = new StateManager({
  mainState: new ReceiverState(),
  zone2State: new ReceiverState(),
  zone3State: new ReceiverState()});

// Send status request commands to the console.
MessageFormatter.sendStatusRequests((command: string) => console.log(command));

// Handle commands and update state accordingly.
stateManager.handleCommand('PWON');
stateManager.handleCommand('Z2ON');
stateManager.handleCommand('Z3ON');

// Get the latest state value.
const volume = stateManager.mainState.getState(ReceiverSettings.Volume)?.numeric;
const power = stateManager.mainState.getState(ReceiverSettings.Power)?.text;
const channelVolume = stateManager.mainState.getState(ReceiverSettings.ChannelVolume);
if (channelVolume) {
  const speakerName = SpeakerCodes.codeToName[channelVolume.key];
  console.log(`Channel: ${speakerName}, Volume:: ${channelVolume.numeric}`)
}

stateManager.sendUpdates((command: string) => console.log(command));
```