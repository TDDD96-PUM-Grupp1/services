import Deepstream from 'deepstream.io';
import settings from './config';
import createService from './services';

const serviceName = settings.communication.service_name;
let server;

const validInstance1 = {
  id: 'randomid',
  name: 'instanceName',
  maxPlayers: 10,
  gamemode: 'testGamemode',
};

const validInstance2 = {
  id: 'randomid2',
  name: 'instanceName2',
  maxPlayers: 15,
  gamemode: 'testGamemode2',
};
const invalidInstance1 = {};

const invalidInstance2 = {
  id: {},
  name: 12,
  maxPlayers: '',
  gamemode: {},
};

describe('Server', () => {
  it('starts without errors', async () => {
    server = new Deepstream('./src/testConfig.yml');
    await server.start();
  });
});

let service;
describe('Service', () => {
  it('starts without errors', async () => {
    service = createService('localhost:60060', false);
    service.start();
  });

  it('receives instances', async () => {
    await service.client.rpc.p
      .make(`${serviceName}/getInstances`, {})
      .then(instances => {
        expect(instances.length).toBe(0);
      })
      .catch(data => {
        expect(data).not.toEqual(expect.anything());
      });
  });

  it('creates instance without error', async () => {
    await service.client.rpc.p
      .make(`${serviceName}/createInstance`, validInstance1)
      .then(data => {
        expect(data).toEqual({});
      })
      .catch(data => {
        expect(data).not.toEqual(expect.anything());
      });
  });

  it('create instance with same name', async () => {
    await service.client.rpc.p
      .make(`${serviceName}/createInstance`, validInstance1)
      .then(data => {
        expect(data).not.toEqual({});
      })
      .catch(data => {
        expect(data).toEqual(expect.anything());
      });
  });

  it('get created instance', async () => {
    await service.client.rpc.p
      .make(`${serviceName}/getInstances`, {})
      .then(instances => {
        expect(instances[validInstance1.name]).toEqual(expect.objectContaining(validInstance1));
      })
      .catch(data => {
        expect(data).not.toEqual(expect.anything());
      });
  });

  it('closes without error', async () => {
    await service.close();
    await server.stop();
  });
});
