

sam deploy --template-file databases.yaml

sam deploy --parameter-overrides ApiRateLimit=200


tree -I 'node_modules|dist|.git' --prune

