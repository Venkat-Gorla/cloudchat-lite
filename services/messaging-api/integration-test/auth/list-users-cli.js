import { handler } from "../../handlers/list-users.js";

const token = process.env.DUMMY_ACCESS_TOKEN;

if (!token) {
  console.error("Missing env: DUMMY_ACCESS_TOKEN");
  process.exit(1);
}

const event = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

handler(event)
  .then((res) => {
    console.log("Status:", res.statusCode);
    console.log("Users:");
    console.log(JSON.stringify(JSON.parse(res.body), null, 2));
  })
  .catch((err) => {
    console.error("Test failed:", err);
  });
