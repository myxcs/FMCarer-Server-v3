import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODZhMjFmNGFkZDMyMTIxMmE0Y2E2ODUiLCJpYXQiOjE3NTE3ODU5NzIsImV4cCI6MTc1MTg3MjM3Mn0.gKgEQi4XuzlS5yS3nPPWnqZ9WRCx5H609PFQSWkUxtE";

const postData = {
  content: "test post from API",
  audience: "public",
  images: []
};

axios.post("http://localhost:3000/api/posts", postData, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  }
}).then(res => {
  console.log("✅ Post created:", res.data);
}).catch(err => {
  console.error("❌ Error:", err.response.data);
});
