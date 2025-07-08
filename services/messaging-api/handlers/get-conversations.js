// Lambda function to get user conversations, this version has no pagination
// - it will validate and extract the username from the input access token
// - Add pagination support (with LastEvaluatedKey)
// - vegorla: limit the number of conversations in the response

import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import {
  AWS_REGION,
  MESSAGES_TABLE_NAME,
  MESSAGES_GSI_NAME,
  CORS_HEADERS,
} from "../constants.js";
import { authenticateRequest } from "../utils/auth-lib.js";

const ddb = new DynamoDBClient({ region: AWS_REGION });

export async function getConversationsForUser(event) {
  if (!MESSAGES_TABLE_NAME) {
    throw new Error("MESSAGES_TABLE_NAME environment variable is not set");
  }
  if (!MESSAGES_GSI_NAME) {
    throw new Error("MESSAGES_GSI_NAME environment variable is not set");
  }

  const { success, tokenData, errorHttpResponse } = await authenticateRequest(
    event.headers
  );
  if (!success) return errorHttpResponse;

  const username = tokenData.username;

  try {
    const results = await fetchConversationsForUser(ddb, username);
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(results),
    };
  } catch (err) {
    console.error("Error fetching conversations:", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err.message }),
    };
  }
}

export const fetchConversationsForUser = async (ddbClient, username) => {
  const res = await ddbClient.send(
    new QueryCommand({
      TableName: MESSAGES_TABLE_NAME,
      IndexName: MESSAGES_GSI_NAME,
      KeyConditionExpression: "UserId = :u",
      ExpressionAttributeValues: marshall({ ":u": `USER#${username}` }),
    })
  );

  return res.Items.map(unmarshall);
};
