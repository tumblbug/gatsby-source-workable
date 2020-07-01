const crypto = require("crypto");
const axios = require("axios");
const rateLimit = require("axios-rate-limit");

exports.sourceNodes = async (
  { boundActionCreators: { createNode } },
  { subdomain, apiKey, queryParams = { state: "published" }, fetchJobDetails }
) => {
  const axiosClient = rateLimit(
    axios.create({
      baseURL: `https://${subdomain}.workable.com/spi/v3/`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }),
    {
      maxRequests: 1,
      perMilliseconds: 1000,
    }
  );

  // Get list of all jobs
  const {
    data: { jobs },
  } = await axiosClient.get("/jobs", { params: queryParams });

  for (const job of jobs) {
    // Fetch job details if needed
    // const jobData = fetchJobDetails ? (
    //   axiosClient.getMaxRPS();
    //   await axiosClient.get(`/jobs/${job.shortcode}`)
    // ).data: job;

    let jobData;
    if (fetchJobDetails) {
      axiosClient.getMaxRPS();
      jobData = await axiosClient.get(`/jobs/${job.shortcode}`);
    } else {
      jobData = job;
    }

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
