# gatsby-source-workable
> Loads job openings from Workable into Gatsby.js

## Installation

```bash
npm install gatsby-source-workable
```

## Usage

To use this source you need to supply a Workable API key and your Workable subdomain. You can create a Workable API key by logging into Workable and going to `Integrations > Access Token`. Your subdomain will be the subdomain `.workable.com` in your browser.

Next, edit `gatsby-config.js` to use the plugin:
```
{
    ...
    plugins: [
    ...
    {
      resolve: 'gatsby-source-workable',
      options: {
        subdomain: 'my-subdomain',
        apiKey: 'abc-123',
      },
    },
  ]
}
```

By default, `gatsby-source-workable` will only retrieve job openings that are published. To change this behavior, you can also supply an optional `queryParams` parameter inside of `options`. Possible values are detailed in the on [Workable's API Documentation](https://workable.readme.io/docs/jobs).

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
