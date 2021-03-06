'use strict';

const {Server} = require('clouddoorserver');
const Client = require('clouddoorclient');
const fs = require('fs');
const chai = require('chai');
const {ServerConnector} = require('../../lib/connectors/serverConnector');
chai.should();

describe('GIVEN a server and a client', () => {

  const serverUrl = 'http://localhost:3000';
  let server;
  let client;
  let connector;

  before(async () => {
    server = new Server({port: 3000});
    await server.start();
    client = new Client({urlBase: serverUrl});
    await client.start();
    connector = new ServerConnector(serverUrl);
  });

  after(() => {
    server.stop();
    client.stop();
  });

  it('WHEN requesting from the server a list of clients, THEN a list is successfully returned', async () => {
    const clients = await connector.listClients({pollUntilNClientsAvailable: 1});
    clients.length.should.equal(1);
    clients[0].id.should.not.be.undefined;
    clients[0].os.version.should.not.be.undefined;
  });

  it('WHEN requesting from the server a list of files under a subdirectory, THEN a list of files under that directory is returned', async () => {
    const clients = await connector.listClients({pollUntilNClientsAvailable: 1});
    const drives = await connector.listFiles(clients[0].id, '/');
    const files = await connector.listFiles(clients[0].id, drives[0].path);
    files.should.not.equal(drives);
  });

  it('WHEN requesting from the server a file, THEN the file content is returned', async () => {
    const clients = await connector.listClients({pollUntilNClientsAvailable: 1});
    const fileContent = await connector.downloadFile(clients[0].id, __filename);
    const testFileContent = fs.readFileSync(__filename, 'utf8');
    fileContent.should.equal(testFileContent);
  });

});