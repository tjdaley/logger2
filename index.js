/**
 * Created by Tom on 2/11/2017.
 */

"use strict";

const process = require("process");
const log = require("@thomasjdaley/logger").getLogger();

let _params = {};

/*
 * EXAMPLE USAGE:
 *
 * params.json:
 *
 *		{"CONNECTIONSTRING": "HTTP://somesite.com:9000"}
 *
 * const params = require('@thomasjdaley/params');
 * params.load(require('./params.json');
 * console.log(params.get('CONNECTIONSTRING');
 * // Displays: HTTP://somesite.com:9000
 */

module.exports =
    {
        load: function (params)
        {
            let value;
            for (let param in params)
            {
                value          = process.env[param] || params[param];
                _params[param] = value;
            }
        },

        get: function (param)
        {
            let value = _params[param];

            if (!value)
            {
                log.error("Application looking for '%s' param but it's missing from the configuration file.", param);

                if (process.env[param])
                {
                    value = process.env[param];
                    log.error("Found '%s' as an environment variable (%s). Using that value.", param, value);
                }
            }

            return value;
        }
    };
	