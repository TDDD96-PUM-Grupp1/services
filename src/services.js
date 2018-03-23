import { createRpcService, typeAssert } from 'ds-node-service';

const fs = require('fs');

const serviceName = 'services';
const instanceNames = [];

let nouns = [];
let adjectives = [];

/*
 * Load in all the dictionary words for the randomizer
 */
function initWords() {
  // Load in nouns
  fs.readFile('InstanceWordsNouns.txt', (err, data) => {
    if (err) throw err;
    nouns = `${data}`.split('\n');
    for (let i = nouns.length - 1; i >= 0; i -= 1) {
      // Sometimes there are empty strings in the list. Remove them
      if (nouns[i] === '') {
        nouns.splice(i, 1);
      }
    }
  });

  // Load in adjectives
  fs.readFile('InstanceWordsAdjectives.txt', (err, data) => {
    if (err) throw err;
    adjectives = `${data}`.split('\n');
    for (let i = adjectives.length - 1; i >= 0; i -= 1) {
      // Sometimes there are empty strings in the list. Remove them
      if (adjectives[i] === '') {
        adjectives.splice(i, 1);
      }
    }
  });
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

  instanceNames.push({ id: uiId, name });
  return true;
}

/*
 * Remove an instance when a UI disconnects.
 * eslint-disable no-unused-vars
 */function removeInstanceName(uiId) { for (let i = 0; i < instanceNames.length; i += 1) { if (instanceNames[i].id === uiId) instanceNames.splice(i, 1); }
}

/*
 * Creates all the rpc calls needed for the services.
 */
function createService(address, runForever) {
  const obj = createRpcService({
    serviceName,
    address,
    runForever,
  });

  obj.registerApi({
    // Creates an instance with the given name.
    createInstance: {
      method: ({ name }) => {
        typeAssert('String', name);
        if (!addInstanceName(obj.client.getUid(), name)) {
          console.log('Name already exists');
          return { error: 'Instance already exists' };
          // Error stuff
        }
        return {};
      },
    },

    // Returns all the instances as a list of objects.
    getInstances: {
      method: () => instanceNames,
    },
  });

  return obj;
}

function main() {
  initWords();
  const service = createService('0.0.0.0:60020', true);
  service.start();
}

if (require.main === module) main();
