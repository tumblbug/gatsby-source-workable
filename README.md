# gatsby-source-workable
> Loads job openings from Workable into Gatsby.js  hi.

## Installation

```bash
npm install gatsby-source-workable
```

## Usage

To use this source you need to supply a Workable API key and your Workable subdomain. You can create a Workable API key by logging into Workable and going to `Integrations > Access Token`. You can see your subdomain by logging into your Workable backend and checking the URL, e.g. `mycompany.workable.com`.

Next, edit `gatsby-config.js` to use the plugin:
```javascript
{
    ...
    plugins: [
    ...
    {
      resolve: 'gatsby-source-workable',
      options: {
        subdomain: 'mycompany',
        apiKey: 'abc-123',
        fetchJobDetails: true // optional
      },
    },
  ]
}
```

By default, `gatsby-source-workable` will only retrieve job openings that are published. To change this behavior, you can also supply an optional `queryParams` parameter inside of `options`. Possible query parameters are detailed in [Workable's API Documentation](https://workable.readme.io/docs/jobs).

If you need more detailed information for each job opening you can also enable `fetchJobDetails` in `options`. This will make one additional API call per opening, providing all the information detailed [here](https://workable.readme.io/docs/jobsshortcode).

## Querying

You can query the nodes created by the plugin as follows:
```graphql
{
    allWorkableJob {
        edges {
            node {
                ...
            }
        }
    }
}
```
Detailed field descriptions are also available on [Workable's API Documentation](https://workable.readme.io/docs/jobs).
