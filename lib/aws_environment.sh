#!/bin/bash

echo $1
echo $2
#credentials=$(curl 169.254.170.2$AWS_CONTAINER_CREDENTIALS_RELATIVE_URI)
export AWS_ACCESS_KEY_ID=$(echo $2 | jq -r .Records[0].awsKeys.AWS_ACCESS_KEY_ID)
export AWS_SECRET_ACCESS_KEY=$(echo $2 | jq -r .Records[0].awsKeys.AWS_SECRET_ACCESS_KEY)
export AWS_SESSION_TOKEN=$(echo $credentials | jq -r .Records[0].awsKeys.AWS_SESSION_TOKEN)
export AWS_LAMBDA_RUNTIME_API=$(echo $credentials | jq -r .Records[0].awsKeys.AWS_LAMBDA_RUNTIME_API)
export LAMBDA_RUNTIME_DIR=$(echo $credentials | jq -r .Records[0].awsKeys.LAMBDA_RUNTIME_DIR)
export _HANDLER=$(echo $credentials | jq -r .Records[0].awsKeys._HANDLER)
export _X_AMZN_TRACE_ID=$(echo $credentials | jq -r .Records[0].awsKeys._X_AMZN_TRACE_ID)
export AWS_REGION=$(echo $credentials | jq -r .Records[0].awsKeys.AWS_REGION)
export AWS_LAMBDA_FUNCTION_NAME=$(echo $credentials | jq -r .Records[0].awsKeys.AWS_LAMBDA_FUNCTION_NAME)
export AWS_LAMBDA_FUNCTION_MEMORY_SIZE=$(echo $credentials | jq -r .Records[0].awsKeys.AWS_LAMBDA_FUNCTION_MEMORY_SIZE)
export AWS_LAMBDA_FUNCTION_VERSION=$(echo $credentials | jq -r .Records[0].awsKeys.AWS_LAMBDA_FUNCTION_VERSION)
export AWS_LAMBDA_INITIALIZATION_TYPE=$(echo $credentials | jq -r .Records[0].awsKeys.AWS_LAMBDA_INITIALIZATION_TYPE)
export LAMBDA_TASK_ROOT=$(echo $credentials | jq -r .Records[0].awsKeys.LAMBDA_TASK_ROOT)
echo ${AWS_ACCESS_KEY_ID}
echo "$(</var/runtime/bootstrap.py)"

/var/lang/bin/python3.9 /var/runtime/bootstrap.py $1 $2
