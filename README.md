


## deploy

aws configure
aws s3 mb s3://finaktiva-api
sam package --output-template-file packaged.yaml --s3-bucket finaktiva-api
node deploy_dbs.js
node deploy.js

## local test
sam build
sam local invoke CreateEventFunction

## Varios
tree -I 'node_modules|dist|.git' --prune

