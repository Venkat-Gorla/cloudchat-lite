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

(async () => {
  const [, , username] = process.argv;
  if (!username) {
    console.error("Usage: node ddb-messages-query.js <username>");
    process.exit(1);
  }

  console.log(`\nFetching conversations for user: ${username}\n`);
  const convos = await fetchConversationsForUser(username);
  if (convos.length === 0) {
    console.log(`No conversations found for user ${username}.`);
    return;
  }

  await printConversations(convos);
})();

async function printConversations(convos) {
  for (const convo of convos) {
    console.log("Convo:", convo.ConversationIndex);
    console.log(" Participants:", convo.Participants);
    const messages = await fetchMessagesForConversation(
      convo.ConversationIndex
    );
    messages.forEach((m) => {
      console.log(` - [${m.Sender}] ${m.Message}`);
    });
  }
}
