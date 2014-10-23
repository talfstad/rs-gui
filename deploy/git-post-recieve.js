#!/usr/bin/env node

// Grab just the name of the current directory (not the path)
// and append a timestamp to make it unique.

var exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    tempDirName = process.cwd().split("/").pop() + "-" + new Date().getTime(),
    gitOutput = "",
    branch = null,

/*
 * Makes a temporary directory in /tmp/ with the
 * filename just generated
 */
makeTempDir = function (callback) {

  console.log("|---- Making temporary directory in /tmp/" + tempDirName);
  exec("mkdir /tmp/" + tempDirName, function (err, stdout, stderr) {

    if (err !== null) {
      console.log("\n|---- Post receive failed, error to follow:");
      console.log(err.message);
    } else {
      callback();
    }

  });

},

/*
 * Checks out the work tree to the
 * temporary directory just created
 */
checkoutWorkTree = function (callback) {

  console.log("\n|---- Directory created, checking out working tree...");
  exec("git --work-tree=\"/tmp/" + tempDirName +"\" checkout -f " + branch, function (err, stdout, stderr) {

    if (err !== null) {
      console.log("Post receive failed, error to follow:");
      console.log(err.message);
    } else {
      process.chdir('/tmp/' + tempDirName);
      console.log("\n|-------- Changing directory to install dir: " + process.cwd());
      callback();
    }

  });

  
},

/*
 * Install bower's bower.json file
 */
installBowerDependencies = function (callback) {
  exec("bower install", function(err, stdout, stderr){
    if(err !== null) {
      console.log("bower install failed, error to follow: ");
      console.log(err.message);
    } else {
      console.log("Successfully installed Bower dependencies");
      callback();
    }
  });
},

/*
 * Install Grunt's dependencies
 */
installGruntDependencies = function(callback) {
  exec("npm install", function(err, stdout, stderr) {
    if(err !== null) {
      console.log("grunt build failed. Error to follow: ");
      console.log(err.message);
    } else {
      console.log("Successfully installed grunt dependencies");
      callback();
    }
  });
},

/*
 * Runs the jakefile in the root
 * of the work tree
 */
runGruntfile = function (callback) {

  console.log("\n|---- Building ----");
  
  var grunt = spawn("grunt", ["deploy:dev"]);

  grunt.stdout.on('data', function (data) {
    process.stdout.write(data);
  });

  grunt.stderr.on('data', function (data) {
    process.stdout.write(data);
  });

  grunt.on('exit', function (code) {
    if (code === 0) {
      console.log("\n|---- Gruntfile ran successfully");
      callback();
    } else {
      throw new Error("grunt exited with error code " + code);
    }
  });

},

/*
 * Removes the temporary directory
 */
removeTempDir = function () {

  console.log("\n|---- Cleaning up temporary directory");
  exec("rm -rf /tmp/" + tempDirName, function (err, stdout, stderr) {

    if (err !== null) {
      console.log("Post receive succeeded but cleanup failed, error to follow:");
      console.log(err.message);
    } else {
      console.log("\n|---- Post receive finished, exiting.\n");
    }

  });

};

// Start reading stdin
process.stdin.resume();


// Store read in chunks
process.stdin.on('data', function (chunk) {
  gitOutput += chunk;
});


// Finished readin in git args, start process
process.stdin.on('end', function () {
  branch = gitOutput.split(" ").pop().split("/").pop();

  console.log("\n|---- Branch received: " + branch);

  // Run functions
  makeTempDir(function () {
    checkoutWorkTree(function () {
      installBowerDependencies(function () {
        installGruntDependencies(function() { 
          runGruntfile(function() {
            removeTempDir();
          });
        });
      });
    });
  });

});