const crypto = require('crypto')
const axios = require('axios')

exports.sourceNodes = async ({ actions: { createNode } }, { subdomain, apiKey, queryParams = { state: 'published' }, fetchJobDetails }) => {
  const axiosClient = axios.create({
    baseURL: `https://${subdomain}.workable.com/spi/v3/`,
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  })

  // Get list of all jobs
  const { data: { jobs } } = await axiosClient.get('/jobs', { params: queryParams });

  for(const job of jobs) {
    // Fetch job details if needed
    const jobData = fetchJobDetails ? (await axiosClient.get(`/jobs/${job.shortcode}`)).data : job;

    const jsonString = JSON.stringify(jobData)
    const gatsbyNode = {
      ...jobData,
      children: [],
      parent: '__SOURCE__',
      internal: {
        type: 'WorkableJob',
        content: jsonString,
        contentDigest: crypto.createHash('md5').update(jsonString).digest('hex'),
      },
    }
    // Insert data into gatsby
    createNode(gatsbyNode)
  }
}
