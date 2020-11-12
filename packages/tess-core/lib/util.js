'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const scheduler = require('node-schedule');
const scripts = require('tess-functions')

const baseDir = path.join(`${__dirname}`, '../');

/**
 * Creates a new router with some default options.
 * @param {?Object} [opts] additional options to pass to express.Router()
 * @return {!Router} a new router object
 */
function createRouter(opts) {

    const options = {
        mergeParams: true
    };

    if (opts && opts.constructor === Object) {
        Object.assign(options, opts);
    }

    return new express.Router(options);
}

const filterService = async (services, filter) => {
    return services.filter((service) => {
        return service.serviceName === filter;
    }).shift();
}

const loadCron = async (services, path = `${baseDir}cron`) => {
    fs.readdirSync(path).map((fname) => {
        const cron = yaml.load(fs.readFileSync(`${path}/${fname}`, 'utf8'));
        const { tessModule, tasks } = cron;
        if (Array.isArray(tasks) && tasks.length){
            tasks.map(async (task) => {
                const { schedule } = task;
                const service = await filterService(services, tessModule);
                if (service){
                    const script = task['script'] && scripts[task['script']];
                    if (script){
                        scheduler.scheduleJob(schedule, function(){
                            script(service, task.parameters);
                            service.logger.log('info', `cron ${task['script']} executed`)
                        });
                        service.logger.log('info', `loading cron: ${task['script']} with schedule ${schedule}`)
                    }
                }
            });
        }
    });
}

module.exports = {
    router: createRouter,
    loadCron,
};
