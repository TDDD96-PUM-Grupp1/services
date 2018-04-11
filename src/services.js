import { createRpcService, typeAssert } from 'ds-node-service';
import settings from './config';

const serviceName = settings.communication.service_name;
const instances = [];
// This will get used for checking if a ui is still up.
// eslint-disable-next-line
const pingrate = 1;
const timeoutCount = 3;
/*
 * Adds one to the playercount in the given instance.
 * @param instanceName Name of the instance that got a new player.
 *
 */
function addPlayerToInstance(instanceName) {
  for (let i = 0; i < instances.length; i += 1) {
    if (instances[i].name === instanceName) {
      instances[i].currentlyPlaying += 1;
      return;
    }
  }
}

/*
 * Removes one from the playercount in the given instance.
 * @param instanceName Name of the instance that lost a player.
 */

function removePlayerFromInstance(instanceName) {
  for (let i = 0; i < instances.length; i += 1) {
    if (instances[i].name === instanceName) {
      instances[i].currentlyPlaying -= 1;
      return;
    }
  }
}

/*
 * Checks if a given instance name can be created.
 * @param name the name that should be checked.
 * @returns true if there is not instance with the given name.
 */
function checkInstanceName(name) {
  for (let i = 0; i < instances.length; i += 1) {
    if (instances[i].name === name) {
      return false;
    }
  }
  return true;
}

/*
 * Returns the instance with the given id * @param id The id of the wanted instance
 */
function getInstanceById(id) {
  for (let i = 0; i < instances.length; i += 1) {
    if (instances[i].id === id) {
      return instances[i];
    }
  }
  return undefined;
}

function getInstanceByName(name) {
  for (let i = 0; i < instances.length; i += 1) {
    if (instances[i].name === name) {
      return instances[i];
    }
  }
  return undefined;
}

/*
 * Add an instance if it doesn't exist.
 * @returns false if the given instance name already exists.
 */
function addInstance(uiId, name) {
  if (!checkInstanceName(name)) return false;

  instances.push({
    id: uiId,
    name,
    currentlyPlaying: 0,
    ping: timeoutCount,
  });
  return true;
}

/*
 * Remove an instance when a UI disconnects.
 */
function removeInstanceById(id) {
  for (let i = 0; i < instances.length; i += 1) {
    if (instances[i].id === id) {
      instances.splice(i, 1);
    }
  }
}

/*
 * Creates all the rpc calls needed for the services.
 * @param address the ip of the deepstream server.
 * @param runForever true if the service should run forever.
 */
function createService(address, runForever, credentials) {
  const obj = createRpcService({
    serviceName,
    address,
    runForever,
    credentials,
  });

  obj.registerApi({
    // Creates an instance with the given name.
    createInstance: {
      method: ({ id, name }) => {
        typeAssert('String', id);
        typeAssert('String', name);
        if (!addInstance(id, name)) {
          console.log('Name already exists');
          return { error: 'Instance already exists' };
        }
        obj.client.event.emit(`${serviceName}/instanceCreated`, { name });
        obj.client.event.subscribe(`${serviceName}/instancePing`, instancePinged);
        return {};
      },
    },
    // Returns all the instances as a list of objects.
    getInstances: {
      method: () => instances,
    },
  });
  obj.client.event.subscribe(`${serviceName}/playerAdded`, data => {
    addPlayerToInstance(data.instanceName);
  });

  obj.client.event.subscribe(`${serviceName}/playerRemoved`, data => {
    removePlayerFromInstance(data.instanceName);
  });
  return obj;
}

function instancePinged(data)
{
  let instance = getInstanceByName(data.name);
  if(instance === undefined)
    return;
  instance.ping = timeoutCount;
}

/*
 * Checks the presence of the UIs.
 * @param service The service client that is able to send and receive deepstream data.
 */
function ping(service) {
  for(let i = 0; i < instances.length; i += 1)
  {
    instances[i].ping -= 1;
    if(instances[i].ping == 0)
    {
      service.client.event.emit(`${serviceName}/instanceRemoved`, {name: instances[i].name});
      removeInstanceById(instances[i].id);
    }
  }
}

function main() {
  if (process.env.RUN_LOCAL) {
    console.log('Using local Deepstream server.');
    settings.communication.host_ip = 'localhost:60020';
  }
  const service = createService(settings.communication.host_ip, true, settings.communication.auth);
  service.start();
  setInterval(ping, 1000 / pingrate, service);
}

if (require.main === module) main();
