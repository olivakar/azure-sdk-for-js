# Azure Model Parser client library for JavaScript

<!-- NOTE: This README file is a template. Read through it and replace the instructions (keeping an eye out for package names like "@azure/template") with the ones that pertain to your package. For a complete example based on the real Azure App Configuration SDK, see README-TEMPLATE.md in this directory. -->

This project is used as a template package for the Azure SDK for JavaScript. It is intended to help Azure SDK developers bootstrap new packages, and it provides an example of how to organize the code and documentation of a client library for an Azure service.

## Getting started

### Currently supported environments

- Node.js version 12.x or higher

### Install the `@azure/digital-twins-parser` package

Install the Digital Twins Model Parser client library for JavaScript with `npm`:

```bash
npm install @azure/digital-twins-parser
```

### Browser support

#### JavaScript Bundle

To use this client library in the browser, first you need to use a bundler. For details on how to do this, please refer to our [bundling documentation](https://aka.ms/AzureSDKBundling).

### Further examples

Top-level examples usually include things like creating and authenticating the main Client. If your service supports multiple means of authenticating (e.g. key-based and Azure Active Directory) you can give a separate example of each.

## Key concepts

### ConfigurationClient

Describe your primary client here. Talk about what operations it can do and when a developer would want to use it.

### Additional Examples

Create a section for each top-level service concept you want to explain.

## Examples

### First Example

<!-- Examples should showcase the primary, or "champion" scenarios of the client SDK. -->

```ts
import * as fs from 'fs';
import {ModelParser, ModelParsingOption} from '@azure/digital-twins-parser';

const pathToFile = 'my/path/to/file.json'

const rawDtdlDigest: string = fs.readFileSync(pathToFile, 'utf-8');
const modelParser = new ModelParser();
modelParser.options = ModelParsingOption.PermitAnyTopLevelElement;
try {
  const modelDict = await modelParser.parseAsync([rawDtdlDigest]);
} catch (e) {
  console.log(e.message);
  for (const err of e.errors) {
    console.log(err.primaryId);
    console.log(err.message);
  }
}
const dtmi = Object.keys(modelDict)[0];
console.log(modelDict);
Object.entries(modelDict).forEach(
  ([key, value]) => {
    console.log(key);
    console.log(typeof value);
  },
);
```

## Troubleshooting

### Logging

*TODO: This package currently does not support Azure Logging.*

Enabling logging may help uncover useful information about failures. In order to see a log of HTTP requests and responses, set the `AZURE_LOG_LEVEL` environment variable to `info`. Alternatively, logging can be enabled at runtime by calling `setLogLevel` in the `@azure/logger`:

```javascript
import { setLogLevel } from "@azure/logger";

setLogLevel("info");
```

For more detailed instructions on how to enable logs, you can look at the [@azure/logger package docs](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/core/logger).

## Next steps

Please take a look at the [samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/digitaltwins/digital-twins-parser/samples) directory for detailed examples that demonstrate how to use the client libraries.

## Contributing

If you'd like to contribute to this library, please read the [contributing guide](https://github.com/Azure/azure-sdk-for-js/blob/master/CONTRIBUTING.md) to learn more about how to build and test the code.

## Related projects

- [Microsoft Azure SDK for Javascript](https://github.com/Azure/azure-sdk-for-js)

TODO: Ask Azure SDK Team what these impressions are.
![Impressions](https://azure-sdk-impressions.azurewebsites.net/api/impressions/azure-sdk-for-js%2Fsdk%2Ftemplate%2Ftemplate%2FREADME.png)

[azure_cli]: https://docs.microsoft.com/cli/azure
[azure_sub]: https://azure.microsoft.com/free/
