// integration-test.js

import {
  DynamoDBClient,
  BatchWriteItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

// vegorla: move to env constants and refactor functions
const REGION = "ap-south-1";
const TABLE_NAME = "cloudchat-messages";
const GSI_NAME = "UserConversationsIndex";
const ddb = new DynamoDBClient({ region: REGION });

const testData = [
  // Conversation 1: alice-bob
  {
    conversationId: "CONV#alice#bob",
    participants: ["alice", "bob"],
    messages: [
      { sender: "alice", text: "Hi Bob!" },
      { sender: "bob", text: "Hey Alice!" },
    ],
  },
  // Conversation 2: alice-carol
  {
    conversationId: "CONV#alice#carol",
    participants: ["alice", "carol"],
    messages: [
      { sender: "carol", text: "Hi Alice!" },
      { sender: "alice", text: "How are you Carol?" },
    ],
  },
  // Conversation 3: bob-dave
  {
    conversationId: "CONV#bob#dave",
    participants: ["bob", "dave"],
    messages: [
      { sender: "bob", text: "Hey Dave" },
      { sender: "dave", text: "Yo Bob" },
    ],
  },
];

const writeTestData = async () => {
  const now = Date.now();
  const requests = [];

  for (const convo of testData) {
    requests.push(
      ...createMessageItems(convo.conversationId, convo.messages, now)
    );
    const ts = now + convo.messages.length * 1000; // Last message timestamp

    for (const user of convo.participants) {
      requests.push({
        PutRequest: {
          Item: marshall({
            ConversationId: `META#${user}`,
            MessageSortKey: convo.conversationId,
            UserId: `USER#${user}`,
            ConversationIndex: convo.conversationId,
            LastMessage: convo.messages[convo.messages.length - 1].text,
            LastTimestamp: ts,
            Type: "CONV_METADATA",
          }),
        },
      });
    }
  }

  const batch = { RequestItems: { [TABLE_NAME]: requests } };
  await ddb.send(new BatchWriteItemCommand(batch));
  console.log("✅ Test data written.");
};

const createMessageItems = (conversationId, messages, startTimestamp) => {
  let ts = startTimestamp;
  return messages.map((msg) => {
    const item = marshall({
      ConversationId: conversationId,
      MessageSortKey: `MSG#${ts}`,
      Sender: msg.sender,
      Message: msg.text,
      Timestamp: ts,
      Type: "MESSAGE",
    });
    ts += 1000;
    return { PutRequest: { Item: item } };
  });
};

const fetchConversationsForUser = async (username) => {
  const res = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: GSI_NAME,
      KeyConditionExpression: "UserId = :u",
      ExpressionAttributeValues: marshall({ ":u": `USER#${username}` }),
    })
  );

  return res.Items.map(unmarshall);
};

const fetchMessagesForConversation = async (conversationId) => {
  const res = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
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
  await writeTestData();

  console.log("\n💬 Fetching conversations for user: alice\n");
  const convos = await fetchConversationsForUser("alice");
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
