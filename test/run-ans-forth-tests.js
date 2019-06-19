/* eslint-disable no-console */
// #! /usr/bin/env node

let Forth = require("../src/renderer/engine/forth");
let readFile = require( "fs");

let forth = new Forth();

function outputCallback(error, output) {
    console.log(output);
    if (error) {
        console.error(error);
    }
}

readFile(__dirname + "/../forth/forth.fth", "utf8", function (err, data) {
    readFile(__dirname + "/runtests.fth", "utf8", function (err, tests) {
        forth.run(data, outputCallback);
        forth.run(tests, outputCallback);
    });
});