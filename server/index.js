import express from "express";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());
const API_KEY = "619f741d-eabe-4741-882a-404b0b023de6";
const SECRET =
  "573c2eb460d7bbafa9f65c954fc33164c2c127d6eaca26196e00c2835c49ebc9";

function generateToken() {
  const options = {
    expiresIn: "120m",
    algorithm: "HS256",
  };

  const payload = {
    apikey: API_KEY,
    permissions: ["allow_join"], // `ask_join` || `allow_mod`
    version: 2,
    roles: ["CRAWLER"],
  };

  const token = jwt.sign(payload, SECRET, options);
  return token;
}

async function deactivateRoom(roomId) {
    const YOUR_TOKEN = generateToken();
  
    const options = {
      method: "POST",
      headers: {
        Authorization: YOUR_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId }),
    };
  
    const url = "https://api.videosdk.live/v2/rooms/deactivate";
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

app.post("/create-room", async (req, res) => {
  const YOUR_TOKEN = generateToken();

  const options = {
    method: "POST",
    headers: {
      Authorization: YOUR_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      region: "sg001",
    }),
  };

  const url = "https://api.videosdk.live/v2/rooms";
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/deactivate-room", async (req, res) => {
    const roomId = req.body.roomId;
    if (!roomId) {
      return res.status(400).json({ error: "Room ID is required" });
    }
  
    try {
      const response = await deactivateRoom(roomId);
      res.json(response);
    } catch (error) {
      console.error("Error deactivating room:", error);
      res.status(500).json({ error: "Error deactivating room" });
    }
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
