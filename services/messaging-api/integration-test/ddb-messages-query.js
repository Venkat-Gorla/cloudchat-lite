import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import {
  AWS_REGION,
  MESSAGES_TABLE_NAME,
  MESSAGES_GSI_NAME,
} from "../constants.js";

const ddb = new DynamoDBClient({ region: AWS_REGION });

const fetchConversationsForUser = async (username) => {
  const res = await ddb.send(
    new QueryCommand({
      TableName: MESSAGES_TABLE_NAME,
      IndexName: MESSAGES_GSI_NAME,
      KeyConditionExpression: "UserId = :u",
      ExpressionAttributeValues: marshall({ ":u": `USER#${username}` }),
    })
  );

  return res.Items.map(unmarshall);
};

const fetchMessagesForConversation = async (conversationId) => {
  const res = await ddb.send(
    new QueryCommand({
      TableName: MESSAGES_TABLE_NAME,
      KeyConditionExpression:
        "ConversationId = :c AND begins_with(MessageSortKey, :msg)",
      ExpressionAttributeValues: marshall({
        ":c": conversationId,
        ":msg": "MSG#",
      }),
    })
  );
  return res.Items.map(unmarshall);
};

// vegorla: change to command line parameter
(async () => {
  console.log("\nFetching conversations for user: alice\n");
  const convos = await fetchConversationsForUser("alice");
  if (convos.length === 0) {
    console.log("No conversations found for user alice.");
    return;
  }

  for (const convo of convos) {
    console.log("Convo:", convo.ConversationIndex);
    const messages = await fetchMessagesForConversation(
      convo.ConversationIndex
    );
    messages.forEach((m) => {
      console.log(` - [${m.Sender}] ${m.Message}`);
    });
  }
})();
