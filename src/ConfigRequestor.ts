import axios from 'axios';
import https from 'https';
import * as xml2js from 'xml2js';

export class ConfigRequestor {
  constructor(private ip: string) {}

  public async getJsonFromXmlEndpoint(path: string) {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const response = await axios.get(`https://${this.ip}:10443${path}`, { httpsAgent: agent });
    return await xml2js.parseStringPromise(response.data);
  }

  public async listZones() {
    const { listHomeMenu } = await this.getJsonFromXmlEndpoint(`/ajax/home/get_config?type=1&_=${Date.now()}`);

    const zones = [listHomeMenu.MainZone[0].ZoneName[0]];

    if (listHomeMenu.Zone2) {
      zones.push(listHomeMenu.Zone2[0].ZoneName[0]);
    }

    if (listHomeMenu.Zone3) {
      zones.push(listHomeMenu.Zone3[0].ZoneName[0]);
    }

    return zones;
  }

  public async listSources() {
    const { SourceList } = await this.getJsonFromXmlEndpoint('/ajax/globals/get_config?type=7');

    const sources = [SourceList.Zone[0].Source.map((i: any) => i.Name[0])];

    if (SourceList.Zone.length > 1) {
      sources.push(SourceList.Zone[1].Source.map((i: any) => i.Name[0]));
    }

    if (SourceList.Zone.length > 2) {
      sources.push(SourceList.Zone[2].Source.map((i: any) => i.Name[0]));
    }

    return sources;
  }
}
