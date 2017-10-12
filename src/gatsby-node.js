const crypto = require('crypto')
const axios = require('axios')

const getJobs = (apiKey, subdomain, queryParams = { state: 'published' }) =>
  axios.get(`https://${subdomain}.workable.com/spi/v3/jobs`, {
    params: queryParams,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })

exports.sourceNodes = async ({ boundActionCreators }, { subdomain, apiKey, queryParams }) => {
  const { createNode } = boundActionCreators

  const result = await getJobs(apiKey, subdomain, queryParams)
  const jobs = result.data.jobs

  jobs.forEach(job => {
    const jsonString = JSON.stringify(job)
    const gatsbyNode = {
      ...job,
      children: [],
      parent: '__SOURCE__',
      internal: {
        type: 'WorkableJob',
        content: jsonString,
        contentDigest: crypto.createHash('md5').update(jsonString).digest('hex'),
      },
    }
    createNode(gatsbyNode)
    return
  })
}
