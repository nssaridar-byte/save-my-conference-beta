import { sign, verify } from "jsonwebtoken";

const secret = "secret";
const user = {
  id: "test-id",
  email: "test@example.com",
  name: "Test User",
  // Large object simulation
  speeches: Array(10).fill({ id: "speech-id", content: "some long content ".repeat(100) }),
  conferences: Array(5).fill({ id: "conf-id", title: "Conference Title" })
};

// OLD WAY
const oldPayload = { id: user.id, user: user, name: user.name };
const oldToken = sign(oldPayload, secret);
console.log("Old Token Size:", oldToken.length, "chars");

// NEW WAY
const newPayload = { id: user.id, email: user.email, name: user.name };
const newToken = sign(newPayload, secret);
console.log("New Token Size:", newToken.length, "chars");

const decoded = verify(newToken, secret) as any;
console.log("Decoded Payload:", decoded);

if (decoded.id && decoded.email && decoded.name && !decoded.user) {
  console.log("Verification Passed: Payload is optimized and correct.");
} else {
  console.log("Verification Failed: Payload contains unnecessary data or is missing fields.");
}
