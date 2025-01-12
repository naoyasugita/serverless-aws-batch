// This file replaces the lambda function code and can be used to schedule the batch task.
// Requires the following environment variables:
//  - EVENT_LOGGING_ENABLED
//  - JOB_DEFINITION_ARN
//  - FUNCTION_NAME
//  - JOB_QUEUE_ARN

'use strict';
const process = require("process");
const AWS = require("aws-sdk");
const batch = new AWS.Batch();

function zeroPad(n) {
    return n <= 9 ? "0" + n : n;
}

function getFormattedNow() {
    let currentDate = new Date();
    return currentDate.getFullYear()
        + "-" + zeroPad(currentDate.getMonth() + 1)
        + "-" + zeroPad(currentDate.getDate())
        + "-" + zeroPad(currentDate.getHours())
        + "-" + zeroPad(currentDate.getMinutes())
        + "-" + zeroPad(currentDate.getSeconds());
}

module.exports.schedule = (event, context, callback) => {

    if (process.env.EVENT_LOGGING_ENABLED === 'true') {
        console.log(`Received event: ${JSON.stringify(event, null, 2)}`);
    }

    const jobDefinition = process.env.JOB_DEFINITION_ARN;
    const jobName = `${process.env.FUNCTION_NAME}-${getFormattedNow()}`;
    const jobQueue = process.env.JOB_QUEUE_ARN;

    const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const awsScecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const awsSessionToken = process.env.AWS_SESSION_TOKEN;
    const lambdaRuntimeApi = process.env.AWS_LAMBDA_RUNTIME_API
    const lambdaRuntimeDir = process.env.LAMBDA_RUNTIME_DIR
    const handler = process.env._HANDLER
    const amznTraceId = process.env._X_AMZN_TRACE_ID
    const awsRegion = process.env.AWS_REGION
    const awsLambdaFunctionName = process.env.AWS_LAMBDA_FUNCTION_NAME
    const awsLambdaFunctionMemorySize = process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE
    const awsLambdaFunctionVersion = process.env.AWS_LAMBDA_FUNCTION_VERSION
    const awsLambdaInitializationType = process.env.AWS_LAMBDA_INITIALIZATION_TYPE
    const lambdaTaskRoot = process.env.LAMBDA_TASK_ROOT

    
    event['Records'][0]['awsKeys'] = {
        AWS_ACCESS_KEY_ID: awsAccessKeyId,
        AWS_SECRET_ACCESS_KEY: awsScecretAccessKey,
        AWS_SESSION_TOKEN: awsSessionToken,
        AWS_LAMBDA_RUNTIME_API: lambdaRuntimeApi,
        LAMBDA_RUNTIME_DIR: lambdaRuntimeDir,
        _HANDLER: handler,
        _X_AMZN_TRACE_ID: amznTraceId,
        AWS_REGION: awsRegion,
        AWS_LAMBDA_FUNCTION_NAME: awsLambdaFunctionName,
        AWS_LAMBDA_FUNCTION_MEMORY_SIZE: awsLambdaFunctionMemorySize,
        AWS_LAMBDA_FUNCTION_VERSION: awsLambdaFunctionVersion,
        AWS_LAMBDA_INITIALIZATION_TYPE: awsLambdaInitializationType,
        LAMBDA_TASK_ROOT: lambdaTaskRoot
    };

    console.log(`Submitting job: ${jobName} with jobDefinition: ${jobDefinition} to queue: ${jobQueue}`);

    let params = {
        jobDefinition: jobDefinition,
        jobName: jobName,
        jobQueue: jobQueue,
        parameters: {
            event: JSON.stringify(event)
        }
    };

    batch.submitJob(params, function(err, data) {
        let response;

        if (err) {
            console.log(`Error submitting job: ${err}`, err.stack);
            response = {
                statusCode: 500,
                body: JSON.stringify({
                    'error': err
                })
            }
        }
        else {
            console.log(`Submitted job: ${JSON.stringify(data, null, 2)}`);
            response = {
                statusCode: 200,
                body: JSON.stringify({
                    data
                })
            }
        }

        callback(null, response);
    });
};