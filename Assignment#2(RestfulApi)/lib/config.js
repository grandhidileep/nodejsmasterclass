/**
 * Create enviornment specific configuration and export as an object
 */

let enviornments = {};

//defining statging enviornment specific configurations
enviornments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'stagingHashSecret'
}

//defining production enviornment specific configurations
enviornments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'productionSpecificStrongHashSecret'
}


// export the configuration according the enviornment selected ,
// else default to staging

let currentEnv = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
let envToExport = typeof (enviornments[currentEnv]) == 'object' ? enviornments[currentEnv] : enviornments.staging;

//exporting the enviornment specific values.
module.exports = envToExport;