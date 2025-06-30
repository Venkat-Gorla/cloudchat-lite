import api from "./client";

const LAMBDA_USERS_URL = "https://your-users-lambda-url.aws-region.on.aws/";

function getUserDirectory() {
  return api.get(LAMBDA_USERS_URL);
}
