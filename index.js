const app = require("./server");

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
