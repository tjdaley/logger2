/**
 * Created by tomdaley on 9/4/16.
 */

"use strict";

const bunyan     = require("bunyan");
let PrettyStream = require('bunyan-prettystream');

let stdOutStream = {};
let fileStream   = {};
let _log         = undefined;

module.exports =
    {
        getLogger: function (packageName, packageVersion)
        {
            const myPackage = {name: packageName, version: packageVersion};

            if (_log === undefined)
            {
                if ((process.env["NODE_ENV"] || 'development') == 'production')
                {
                    stdOutStream = {
                        level : 'info',
                        stream: process.stdout,
                        pv    : myPackage.version
                    };
                }
                else
                {
                    let prettyStdOut = new PrettyStream();
                    prettyStdOut.pipe(process.stdout);

                    stdOutStream = {
                        level : 'debug',
                        stream: prettyStdOut,
                        type  : 'raw'
                    }
                }

                fileStream =
                    {
                        level : 'trace',
                        type  : 'rotating-file',
                        path  : '/var/log/' + myPackage.name + '.log',
                        period: '1d',
                        count : 3,
                        pv    : myPackage.version
                    };

                _log = bunyan.createLogger(
                    {
                        name       : myPackage.name,
                        /** @property process.env.LOG_SOURCE {string} - Whether we should log source information.
                         * Logging source is slow, but helpfl in development. */
                        src        : ((process.env["LOG_SOURCE"] || "N") == "Y"),
                        streams    : [stdOutStream, fileStream],
                        serializers: {
                            err: bunyan.stdSerializers.err
                        }
                    });
            }

            return _log;
        }
    };