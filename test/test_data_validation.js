const fs = require('fs');
require('path');
require('dotenv');
const {Enigma, utils, eeConstants} = require('enigma-js/node');

var EnigmaContract;
if (typeof process.env.SGX_MODE === 'undefined' || (process.env.SGX_MODE != 'SW' && process.env.SGX_MODE != 'HW')) {
  console.log(`Error reading ".env" file, aborting....`);
  process.exit();
} else if (process.env.SGX_MODE == 'SW') {
  EnigmaContract = require('../build/enigma_contracts/EnigmaSimulation.json');
} else {
  EnigmaContract = require('../build/enigma_contracts/Enigma.json');
}
const EnigmaTokenContract = require('../build/enigma_contracts/EnigmaToken.json');


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let enigma = null;
let contractAddr;

contract('DataValidation', accounts => {
  before(function () {
    enigma = new Enigma(
      web3,
      EnigmaContract.networks['4447'].address,
      EnigmaTokenContract.networks['4447'].address,
      'http://localhost:3346',
      {
        gas: 4712388,
        gasPrice: 100000000000,
        from: accounts[0],
      },
    );
    enigma.admin();

    contractAddr = fs.readFileSync('test/data_validation.txt', 'utf-8');
  });

  let task;

  // ADDING FIRST DATASET
  it('should execute compute task to add the first dataset', async () => {
    let taskFn = 'add_dataset(string,string)';
    let taskArgs = [
      ['+12345678', 'string'],
      ['boris@enigma.co', 'string'],
    ];
    let taskGasLimit = 500000;
    let taskGasPx = utils.toGrains(1);
    task = await new Promise((resolve, reject) => {
      enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, accounts[0], contractAddr)
        .on(eeConstants.SEND_TASK_INPUT_RESULT, (result) => resolve(result))
        .on(eeConstants.ERROR, (error) => reject(error));
    });
  });

  it('should get the pending task', async () => {
    task = await enigma.getTaskRecordStatus(task);
    expect(task.ethStatus).to.equal(1);
  });

  it('should get the confirmed task', async () => {
    do {
      await sleep(1000);
      task = await enigma.getTaskRecordStatus(task);
      process.stdout.write('Waiting. Current Task Status is ' + task.ethStatus + '\r');
    } while (task.ethStatus !== 2);
    expect(task.ethStatus).to.equal(2);
    process.stdout.write('Completed. Final Task Status is ' + task.ethStatus + '\n');
  }, 10000);

  it('should get the result and verify the status is correct', async () => {
    task = await new Promise((resolve, reject) => {
      enigma.getTaskResult(task)
        .on(eeConstants.GET_TASK_RESULT_RESULT, (result) => resolve(result))
        .on(eeConstants.ERROR, (error) => reject(error));
    });
    expect(task.engStatus).to.equal('SUCCESS');
    task = await enigma.decryptTaskResult(task);
    // noinspection ES6ModulesDependencies
    expect(web3.eth.abi.decodeParameters([{
      type: 'bool',
      name: 'status',
    }], task.decryptedOutput).status).to.equal(false);
  });

  // ADDING SECOND DATASET EQUAL TO THE FIRST ONE
  it('should execute compute task to add the first dataset', async () => {
    let taskFn = 'add_dataset(string,string)';
    let taskArgs = [
      ['+12345678', 'string'],
      ['boris@enigma.co', 'string'],
    ];
    let taskGasLimit = 500000;
    let taskGasPx = utils.toGrains(1);
    task = await new Promise((resolve, reject) => {
      enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, accounts[0], contractAddr)
        .on(eeConstants.SEND_TASK_INPUT_RESULT, (result) => resolve(result))
        .on(eeConstants.ERROR, (error) => reject(error));
    });
  });

  it('should get the pending task', async () => {
    task = await enigma.getTaskRecordStatus(task);
    expect(task.ethStatus).to.equal(1);
  });

  it('should get the confirmed task', async () => {
    do {
      await sleep(1000);
      task = await enigma.getTaskRecordStatus(task);
      process.stdout.write('Waiting. Current Task Status is ' + task.ethStatus + '\r');
    } while (task.ethStatus !== 2);
    expect(task.ethStatus).to.equal(2);
    process.stdout.write('Completed. Final Task Status is ' + task.ethStatus + '\n');
  }, 10000);

  it('should get the result and verify the status is correct', async () => {
    task = await new Promise((resolve, reject) => {
      enigma.getTaskResult(task)
        .on(eeConstants.GET_TASK_RESULT_RESULT, (result) => resolve(result))
        .on(eeConstants.ERROR, (error) => reject(error));
    });
    expect(task.engStatus).to.equal('SUCCESS');
    task = await enigma.decryptTaskResult(task);
    // noinspection ES6ModulesDependencies
    expect(web3.eth.abi.decodeParameters([{
      type: 'bool',
      name: 'status',
    }], task.decryptedOutput).status).to.equal(true);
  });

  // ADDING THIRD DATASET NOT EQUAL (PHONE) TO THE SECOND (PREVIOUS) ONE
  it('should execute compute task to add the first dataset', async () => {
    let taskFn = 'add_dataset(string,string)';
    let taskArgs = [
      ['+87654321', 'string'],
      ['boris@enigma.co', 'string'],
    ];
    let taskGasLimit = 500000;
    let taskGasPx = utils.toGrains(1);
    task = await new Promise((resolve, reject) => {
      enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, accounts[0], contractAddr)
        .on(eeConstants.SEND_TASK_INPUT_RESULT, (result) => resolve(result))
        .on(eeConstants.ERROR, (error) => reject(error));
    });
  });

  it('should get the pending task', async () => {
    task = await enigma.getTaskRecordStatus(task);
    expect(task.ethStatus).to.equal(1);
  });

  it('should get the confirmed task', async () => {
    do {
      await sleep(1000);
      task = await enigma.getTaskRecordStatus(task);
      process.stdout.write('Waiting. Current Task Status is ' + task.ethStatus + '\r');
    } while (task.ethStatus !== 2);
    expect(task.ethStatus).to.equal(2);
    process.stdout.write('Completed. Final Task Status is ' + task.ethStatus + '\n');
  }, 10000);

  it('should get the result and verify the status is correct', async () => {
    task = await new Promise((resolve, reject) => {
      enigma.getTaskResult(task)
        .on(eeConstants.GET_TASK_RESULT_RESULT, (result) => resolve(result))
        .on(eeConstants.ERROR, (error) => reject(error));
    });
    expect(task.engStatus).to.equal('SUCCESS');
    task = await enigma.decryptTaskResult(task);
    // noinspection ES6ModulesDependencies
    expect(web3.eth.abi.decodeParameters([{
      type: 'bool',
      name: 'status',
    }], task.decryptedOutput).status).to.equal(false);
  });

  // ADDING FOURTH DATASET NOT EQUAL (EMAIL) TO THE THIRD (PREVIOUS) ONE
  it('should execute compute task to add the first dataset', async () => {
    let taskFn = 'add_dataset(string,string)';
    let taskArgs = [
      ['+87654321', 'string'],
      ['boris@gmail.com', 'string'],
    ];
    let taskGasLimit = 500000;
    let taskGasPx = utils.toGrains(1);
    task = await new Promise((resolve, reject) => {
      enigma.computeTask(taskFn, taskArgs, taskGasLimit, taskGasPx, accounts[0], contractAddr)
        .on(eeConstants.SEND_TASK_INPUT_RESULT, (result) => resolve(result))
        .on(eeConstants.ERROR, (error) => reject(error));
    });
  });

  it('should get the pending task', async () => {
    task = await enigma.getTaskRecordStatus(task);
    expect(task.ethStatus).to.equal(1);
  });

  it('should get the confirmed task', async () => {
    do {
      await sleep(1000);
      task = await enigma.getTaskRecordStatus(task);
      process.stdout.write('Waiting. Current Task Status is ' + task.ethStatus + '\r');
    } while (task.ethStatus !== 2);
    expect(task.ethStatus).to.equal(2);
    process.stdout.write('Completed. Final Task Status is ' + task.ethStatus + '\n');
  }, 10000);

  it('should get the result and verify the status is correct', async () => {
    task = await new Promise((resolve, reject) => {
      enigma.getTaskResult(task)
        .on(eeConstants.GET_TASK_RESULT_RESULT, (result) => resolve(result))
        .on(eeConstants.ERROR, (error) => reject(error));
    });
    expect(task.engStatus).to.equal('SUCCESS');
    task = await enigma.decryptTaskResult(task);
    // noinspection ES6ModulesDependencies
    expect(web3.eth.abi.decodeParameters([{
      type: 'bool',
      name: 'status',
    }], task.decryptedOutput).status).to.equal(false);
  });
});
