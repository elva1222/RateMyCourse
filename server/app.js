const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// SQLite 初始化
const db = new Database(path.join(__dirname, "school.db"));

// 建立表格
db.exec(\`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    teacher TEXT NOT NULL,
    department TEXT,
    category TEXT,
    credit INTEGER,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    rating INTEGER,
    difficulty INTEGER,
    workload INTEGER,
    exam INTEGER,
    gain INTEGER,
    fun INTEGER,
    comment TEXT,
    FOREIGN KEY(course_id) REFERENCES courses(id)
  );
\`);

// API
// =====================

// 健康檢查
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 所有課程
app.get("/api/courses", (req, res) => {
  const search = req.query.search || "";
  const category = req.query.category || "";
  const sort = req.query.sort || "newest";

  let query = \`
    SELECT
      courses.*,
      ROUND(AVG(reviews.rating), 1) AS avg_rating,
      ROUND(AVG(reviews.workload), 1) AS avg_workload,
      ROUND(AVG(reviews.difficulty), 1) AS avg_difficulty,
      ROUND(AVG(reviews.exam), 1) AS avg_exam,
      ROUND(AVG(reviews.gain), 1) AS avg_gain,
      ROUND(AVG(reviews.fun), 1) AS avg_fun,
      COUNT(reviews.id) AS review_count
    FROM courses
    LEFT JOIN reviews ON courses.id = reviews.course_id
    WHERE (courses.name LIKE ? OR courses.teacher LIKE ?)
  \`;

  const params = [\`%\${search}%\`, \`%\${search}%\`];
  if (category) {
    query += \` AND courses.category = ?\`;
    params.push(category);
  }

  query += \` GROUP BY courses.id\`;

  if (sort === "rating_desc") query += " ORDER BY avg_rating DESC";
  else if (sort === "workload_asc") query += " ORDER BY avg_workload ASC";
  else if (sort === "difficulty_asc") query += " ORDER BY avg_difficulty DESC"; // 通過率從高到低
  else query += " ORDER BY courses.id DESC";

  try {
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 新增課程
app.post("/api/courses", (req, res) => {
  const { name, teacher, department, category, credit, description } = req.body;
  if (!name || !teacher || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const info = db.prepare(\`
      INSERT INTO courses (name, teacher, department, category, credit, description)
      VALUES (?, ?, ?, ?, ?, ?)
    \`).run(name, teacher, department, category, credit, description);
    res.json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 單一課程
app.get("/api/courses/:id", (req, res) => {
  const id = req.params.id;
  try {
    const course = db.prepare(\`
      SELECT
        courses.*,
        ROUND(AVG(reviews.rating), 1) AS avg_rating,
        ROUND(AVG(reviews.workload), 1) AS avg_workload,
        ROUND(AVG(reviews.difficulty), 1) AS avg_difficulty,
        ROUND(AVG(reviews.exam), 1) AS avg_exam,
        ROUND(AVG(reviews.gain), 1) AS avg_gain,
        ROUND(AVG(reviews.fun), 1) AS avg_fun,
        COUNT(reviews.id) AS review_count
      FROM courses
      LEFT JOIN reviews ON courses.id = reviews.course_id
      WHERE courses.id = ?
      GROUP BY courses.id
    \`).get(id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const reviews = db.prepare("SELECT * FROM reviews WHERE course_id = ? ORDER BY id DESC").all(id);
    res.json({ ...course, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 新增評價
app.post("/api/courses/:id/reviews", (req, res) => {
  const courseId = req.params.id;
  const { rating, difficulty, workload, exam, gain, fun, comment } = req.body;
  try {
    const info = db.prepare(\`
      INSERT INTO reviews (course_id, rating, difficulty, workload, exam, gain, fun, comment)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    \`).run(courseId, rating, difficulty, workload, exam, gain, fun, comment);
    res.json({ id: info.lastInsertRowid, course_id: courseId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SPA Support
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
