import { createRpcService, typeAssert } from 'ds-node-service';

const serviceName = 'services';
const instanceNames = [];

function addPlayerToInstance(instanceName) {
  for (let i = 0; i < instanceNames.length; i += 1) {
    if (instanceNames[i].name === instanceName) {
      instanceNames[i].currentlyPlaying += 1;
    }
  }
}

/*
 * @returns true if there is not instance with the given name.
 */
function checkInstanceName(name) {
  for (let i = 0; i < instanceNames.length; i += 1) {
    if (instanceNames[i].name === name) {
      return false;
    }
  }
  return true;
}

/*
 * Add an instance if it doesn't exist.
 * @returns false if the given instance name already exists.
 */
function addInstanceName(uiId, name) {
  if (!checkInstanceName(name)) return false;

  instanceNames.push({ id: uiId, name, currentlyPlaying: 0 });
  return true;
}

/*
 * Remove an instance when a UI disconnects.
 */
// currently disabled since we need to work on presence callback.
/* eslint-disable no-unused-vars */
function removeInstanceName(uiId) {
  for (let i = 0; i < instanceNames.length; i += 1) {
    if (instanceNames[i].id === uiId) instanceNames.splice(i, 1);
  }
}
/* esling-enable no-unused-vars */

/*
 * Creates all the rpc calls needed for the services.
 */
function createService(address, runForever) {
  const obj = createRpcService({
    serviceName,
    address,
    runForever
  });

  obj.registerApi({
    // Creates an instance with the given name.
    createInstance: {
      method: ({ id, name }) => {
        typeAssert('String', id);
        typeAssert('String', name);
        if (!addInstanceName(id, name)) {
          console.log('Name already exists');
          return { error: 'Instance already exists' };
        }
        obj.client.event.emit(`${serviceName}/instanceCreated`, { name });
        return {};
      }
    },
    // Returns all the instances as a list of objects.
    getInstances: {
      method: () => instanceNames
    }
  });
  obj.client.event.subscribe(`${serviceName}/playerAdded`, data => {
    addPlayerToInstance(data.instanceName);
  });
  return obj;
}

function main() {
  const service = createService('0.0.0.0:60020', true);
  service.start();
}

if (require.main === module) main();
