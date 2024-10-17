


## deploy

aws configure
aws s3 mb s3://finaktiva-api
sam package --output-template-file packaged.yaml --s3-bucket finaktiva-api
sam deploy --template-file databases.yaml --stack-name DatabasesStack --capabilities CAPABILITY_IAM
node deploy.js

## local test
sam build
sam local invoke CreateEventFunction

## Varios
tree -I 'node_modules|dist|.git' --prune

