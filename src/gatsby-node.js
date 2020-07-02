const crypto = require("crypto");
const axios = require("axios");
const LimitRate = require("axios-rate-limit");

exports.sourceNodes = async (
  { boundActionCreators: { createNode } },
  { subdomain, apiKey, queryParams = { state: "published" }, fetchJobDetails }
) => {
  function CreateRateLimitedAxios() {
    const axiosInstance = axios.create({
      baseURL: `https://${subdomain}.workable.com/spi/v3/`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return LimitRate(axiosInstance, {
      maxRequests: 10,
      perMilliseconds: 10000,
    });
  }

  const axiosClient = CreateRateLimitedAxios();

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
