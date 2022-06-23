#!/bin/bash

echo $1
echo $2
#credentials=$(curl 169.254.170.2$AWS_CONTAINER_CREDENTIALS_RELATIVE_URI)
export AWS_ACCESS_KEY_ID=$(echo $2 | jq -r .Records[0].awsKeys.AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo $2 | jq -r .Records[0].awsKeys.SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo $credentials | jq -r .Records[0].awsKeys.AWS_SESSION_TOKEN)
echo ${AWS_ACCESS_KEY_ID}

/var/lang/bin/python3.9 /var/runtime/bootstrap.py $1 $2