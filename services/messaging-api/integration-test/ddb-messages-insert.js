import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { AWS_REGION, MESSAGES_TABLE_NAME } from "../constants.js";

const ddb = new DynamoDBClient({ region: AWS_REGION });

// schema changes: every message should have an id, unrelated to partition or sort key
// - participants array inside every metadata row
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
    const lastMessage = convo.messages[convo.messages.length - 1];
    const ts = now + convo.messages.length * 1000; // Last message timestamp

    requests.push(
      ...createMetadataItems(
        convo.participants,
        convo.conversationId,
        lastMessage.text,
        ts
      )
    );
  }

  const batch = { RequestItems: { [MESSAGES_TABLE_NAME]: requests } };
  await ddb.send(new BatchWriteItemCommand(batch));
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

const createMetadataItems = (participants, convoId, lastMsgText, timestamp) => {
  return participants.map((user) => ({
    PutRequest: {
      Item: marshall({
        ConversationId: `META#${user}`,
        MessageSortKey: convoId,
        UserId: `USER#${user}`,
        ConversationIndex: convoId,
        LastMessage: lastMsgText,
        LastTimestamp: timestamp,
        Type: "CONV_METADATA",
      }),
    },
  }));
};

(async () => {
  await writeTestData();
  console.log("Test data written.");
})();
