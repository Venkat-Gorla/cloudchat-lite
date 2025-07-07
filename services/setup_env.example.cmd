:: setup_env.example.cmd -- COMMITTED as a template

@echo off

:: Cognito auth login Lambda
set COGNITO_CLIENT_ID=
set COGNITO_USER_POOL_ID=

:: DynamoDB table and index for messages
set MESSAGES_TABLE_NAME=
set MESSAGES_GSI_NAME=
