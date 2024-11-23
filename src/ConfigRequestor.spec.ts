import axios from 'axios';

import { ConfigRequestor } from './ConfigRequestor';

const zoneXml =
  '<?xml version="1.0" encoding="utf-8"?><listHomeMenu><MainZone><ZoneName>Living</ZoneName><SourceName>Fire TV</SourceName></MainZone><Zone2><ZoneName>Rumpus</ZoneName><SourceName>Alexa</SourceName></Zone2><Zone3><ZoneName>Porch</ZoneName><SourceName>Fire TV</SourceName></Zone3></listHomeMenu>';
const sourceXml =
  '<?xml version="1.0" encoding="utf-8"?><SourceList><Zone zone="1" index="1"><Source index="1"><Name>Fire TV</Name></Source><Source index="2"><Name>AppleTV</Name></Source><Source index="3"><Name>Blu-ray</Name></Source><Source index="4"><Name>XBox</Name></Source><Source index="5"><Name>Karaoke</Name></Source><Source index="6"><Name>TV Audio</Name></Source><Source index="7"><Name>AUX1</Name></Source><Source index="8"><Name>pi</Name></Source><Source index="9"><Name>Alexa</Name></Source><Source index="10"><Name>Phono</Name></Source><Source index="11"><Name>Tuner</Name></Source><Source index="13"><Name>HEOS Music</Name></Source></Zone><Zone zone="2" index="9"><Source index="1"><Name>Fire TV</Name></Source><Source index="2"><Name>AppleTV</Name></Source><Source index="3"><Name>Blu-ray</Name></Source><Source index="4"><Name>XBox</Name></Source><Source index="5"><Name>Karaoke</Name></Source><Source index="6"><Name>TV Audio</Name></Source><Source index="8"><Name>pi</Name></Source><Source index="9"><Name>Alexa</Name></Source><Source index="10"><Name>Phono</Name></Source><Source index="11"><Name>Tuner</Name></Source><Source index="13"><Name>HEOS Music</Name></Source><Source index="19"><Name>Source</Name></Source></Zone><Zone zone="3" index="1"><Source index="1"><Name>Fire TV</Name></Source><Source index="2"><Name>AppleTV</Name></Source><Source index="3"><Name>Blu-ray</Name></Source><Source index="4"><Name>XBox</Name></Source><Source index="5"><Name>Karaoke</Name></Source><Source index="6"><Name>TV Audio</Name></Source><Source index="9"><Name>Alexa</Name></Source><Source index="10"><Name>Phono</Name></Source><Source index="11"><Name>Tuner</Name></Source><Source index="13"><Name>HEOS Music</Name></Source><Source index="19"><Name>Source</Name></Source></Zone></SourceList>';

describe('ConfigRequestor', () => {
  const configRequestor = new ConfigRequestor('192.168.0.1234');

  describe('listZones()', () => {
    it('should return the list of zones', async () => {
      jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: zoneXml });
      const result = await configRequestor.listZones();
      expect(result).toEqual(['Living', 'Rumpus', 'Porch']);
    });
  });

  describe('listSources()', () => {
    it('should return the list of sources', async () => {
      jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: sourceXml });
      const result = await configRequestor.listSources();
      expect(result[0]).toEqual(['Fire TV', 'AppleTV', 'Blu-ray', 'XBox', 'Karaoke', 'TV Audio', 'AUX1', 'pi', 'Alexa', 'Phono', 'Tuner', 'HEOS Music']);
      expect(result[1]).toEqual(['Fire TV', 'AppleTV', 'Blu-ray', 'XBox', 'Karaoke', 'TV Audio', 'pi', 'Alexa', 'Phono', 'Tuner', 'HEOS Music', 'Source']);
      expect(result[2]).toEqual(['Fire TV', 'AppleTV', 'Blu-ray', 'XBox', 'Karaoke', 'TV Audio', 'Alexa', 'Phono', 'Tuner', 'HEOS Music', 'Source']);
    });
  });
});
