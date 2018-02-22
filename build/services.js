'use strict';

var _dsNodeService = require('ds-node-service');

const serviceName = 'conf-v1';
const defaultCredentialsUrl = 'http://auth:8009/getAuthToken';

function createService(address, runForever, credentialsUrl) {
  const obj = (0, _dsNodeService.createRpcService)({
    serviceName,
    address,
    runForever,
    credentialsUrl
  });

  obj.items = dataset(); // Attach whatever needed in any suitable way

  obj.registerApi({
    createItem: {
      method: ({ id, properties }) => {
        (0, _dsNodeService.typeAssert)('String', name);
        (0, _dsNodeService.typeAssert)('{...}', properties);
        const res = obj.items.create({ id, properties });
        return res;
      },
      argDoc: [['id', 'String'], ['properties', '{...}']]
    }
  });

  return obj;
}

function main() {
  service = createService('deepstream:6020', true, defaultCredentialsUrl);
  service.start();
}
if (require.main === module) main();