const crypto = require("crypto");
const axios = require("axios");
const rateLimit = require("axios-rate-limit");

exports.sourceNodes = async (
  { boundActionCreators: { createNode } },
  { subdomain, apiKey, queryParams = { state: "published" }, fetchJobDetails }
) => {
  const axiosInstance = axios.create({
    baseURL: `https://${subdomain}.workable.com/spi/v3/`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const axiosClient = rateLimit(axiosInstance, {
    maxRequests: 1,
    perMilliseconds: 10000,
  });

  // Get list of all jobs
  const {
    data: { jobs },
  } = axiosClient.get("/jobs", { params: queryParams });

  for (const job of jobs) {
    // Fetch job details if needed
    const jobData = fetchJobDetails
      ? (await axiosClient.get(`/jobs/${job.shortcode}`)).data
      : job;

    const jsonString = JSON.stringify(jobData);
    const gatsbyNode = {
      ...jobData,
      children: [],
      parent: "__SOURCE__",
      internal: {
        type: "WorkableJob",
        content: jsonString,
        contentDigest: crypto
          .createHash("md5")
          .update(jsonString)
          .digest("hex"),
      },
    };
    // Insert data into gatsby
    createNode(gatsbyNode);
  }
};
