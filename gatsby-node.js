'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const crypto = require('crypto');
const axios = require('axios');

const getJobs = (apiKey, subdomain, queryParams = { state: 'published' }) => axios.get(`https://${subdomain}.workable.com/spi/v3/jobs`, {
  params: queryParams,
  headers: {
    Authorization: `Bearer ${apiKey}`
  }
});

exports.sourceNodes = (() => {
  var _ref = _asyncToGenerator(function* ({ boundActionCreators }, { subdomain, apiKey, queryParams }) {
    const createNode = boundActionCreators.createNode;


    const result = yield getJobs(apiKey, subdomain, queryParams);
    const jobs = result.data.jobs;

    jobs.forEach(function (job) {
      const jsonString = JSON.stringify(job);
      const gatsbyNode = _extends({}, job, {
        children: [],
        parent: '__SOURCE__',
        internal: {
          mediaType: 'application/json',
          type: 'WorkableJob',
          content: jsonString,
          contentDigest: crypto.createHash('md5').update(jsonString).digest('hex')
        }
      });
      createNode(gatsbyNode);
      return;
    });
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();