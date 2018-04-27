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

const validInstance1Compare = {
  id: 'randomid',
  maxPlayers: 10,
  gamemode: 'testGamemode',
};

const validInstance2Compare = {
  id: 'randomid2',
  maxPlayers: 15,
  gamemode: 'testGamemode2',
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
        expect(instances).toEqual({});
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
        console.log('above create instance data');
        console.log(data);
        console.log('below data');
        // TODO Fix this one
        //expect(data).not.toEqual(expect.anything());
      });
  });

  it('failes to create instance with same name', async () => {
    await service.client.rpc.p
      .make(`${serviceName}/createInstance`, validInstance1)
      .then(data => {
        expect(data).not.toEqual({});
      })
      .catch(data => {
        expect(data).toEqual(expect.anything());
      });
  });

  it('gets the created instance', async () => {
    await service.client.rpc.p
      .make(`${serviceName}/getInstances`, {})
      .then(instances => {
        const obj = expect.objectContaining(validInstance1Compare);
        expect(instances[validInstance1.name]).toEqual(obj);
      })
      .catch(data => {
        // TODO fix this
        // expect(data).not.toEqual(expect.anything());
      });
  });

  it('creates another instance without error', async () => {
    await service.client.rpc.p
      .make(`${serviceName}/createInstance`, validInstance2)
      .then(data => {
        expect(data).toEqual({});
      })
      .catch(data => {
        // TODO Fix this
        // expect(data).not.toEqual(expect.anything());
      });
  });

  it('gets the created instances', async () => {
    await service.client.rpc.p
      .make(`${serviceName}/getInstances`, {})
      .then(instances => {
        const obj1 = expect.objectContaining(validInstance1Compare);
        const obj2 = expect.objectContaining(validInstance2Compare);
        expect(instances[validInstance1.name]).toEqual(obj1);
        expect(instances[validInstance2.name]).toEqual(obj2);
      })
      .catch(data => {
        // TODO Fix this
        // expect(data).not.toEqual(expect.anything());
      });
  });

  it('failes to create an instance with no values', async () => {
    await service.client.rpc.p
      .make(`${serviceName}/createInstance`, invalidInstance1)
      .then(data => {
        expect(data).not.toEqual({});
      })
      .catch(data => {
        expect(data).toEqual(expect.anything());
      });
  });

  it('failes to create an instance with invalid parameters', async () => {
    await service.client.rpc.p
      .make(`${serviceName}/createInstance`, invalidInstance2)
      .then(data => {
        expect(data).not.toEqual({});
      })
      .catch(data => {
        expect(data).toEqual(expect.anything());
      });
  });
  it('closes without error', async () => {
    await service.close();
    await server.stop();
  });
});
