var util = require('util');
var spawn = require('child_process').spawn;

var DOMAIN_NAME = "extension.commandline.node";

var domainManager = null;

function spawnProcess(dir, cmd) {
  return (process.platform.toLowerCase().indexOf("win") >= 0) 
    ? spawn("cmd.exe", ["/c", cmd], {cwd: dir})
    : spawn(cmd, [], { cwd: dir});
}

function emit(eventName, data) {
  if (data) {
    domainManager.emitEvent(DOMAIN_NAME, eventName, data);
  } else {
    domainManager.emitEvent(DOMAIN_NAME, eventName);
  }
}

function runCmdHandler(dir, cmd) {
  var process = spawnProcess(dir, cmd);

  process.stdout.on('data', function (data) {
    emit("progress", data.toString('utf-8'));
  });

  process.stderr.on('data', function (data) {
    emit("error", data.toString('utf-8'));
  });

  process.on('exit', function (code) {
    emit("finished");
  });
}

function init(manager) {
    domainManager = manager;
    if (!domainManager.hasDomain(DOMAIN_NAME)) {
        domainManager.registerDomain(DOMAIN_NAME, {major: 1, minor: 0});
    }
    domainManager.registerCommand(
        DOMAIN_NAME,
        "runCmd",
        runCmdHandler,
        true,
        "Runs a command line",
        [
          {
            name: "dir",
            type: "string",
            description: "Directory to run the command in"
          },
          {
            name: "cmd",
            type: "string",
            description: "Command to run"
          }
        ],
        []
    );
    domainManager.registerEvent(DOMAIN_NAME, "progress", ["data"]);
    domainManager.registerEvent(DOMAIN_NAME, "error", ["data"]);
    domainManager.registerEvent(DOMAIN_NAME, "finished");
}

exports.init = init;