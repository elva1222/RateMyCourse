const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new Database("./school.db");

console.log("SQLite connected!");

// 初始化資料庫
db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    teacher TEXT NOT NULL,
    department TEXT,
    category TEXT NOT NULL, -- 必修, 選修, 通識
    credit INTEGER,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    rating INTEGER,      -- 推薦度
    workload INTEGER,    -- 作業量
    difficulty INTEGER,  -- 難度 (原有的，對應要求)
    exam INTEGER,        -- 考試壓力
    gain INTEGER,        -- 收穫
    fun INTEGER,         -- 有趣程度
    comment TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(course_id) REFERENCES courses(id)
  )
`);

const row = db.prepare("SELECT COUNT(*) AS count FROM courses").get();
if (row.count === 0) {
  const stmt = db.prepare(`
    INSERT INTO courses (name, teacher, department, category, credit, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const courses = [
    ["資料結構", "王小明", "資訊工程學系", "必修", 3, "介紹 linked list、stack、queue、tree 等資料結構。"],
    ["Python 程式設計", "李小華", "資訊管理學系", "選修", 3, "學習 Python 基礎語法、函式、檔案處理與資料分析。"],
    ["網頁前端框架", "陳天財", "通識", "通識", 2, "學習現代網頁框架 Vue.js 與 React。"],
    ["資料庫系統", "陳志豪", "資訊管理學系", "必修", 3, "介紹 SQL、ER Model、正規化與資料庫設計。"],
    ["網頁程式設計", "林雅婷", "資訊管理學系", "選修", 3, "學習 HTML、CSS、JavaScript 與前後端整合。"],
    ["人工智慧導論", "張大雲", "資工系", "選修", 3, "AI 基礎與機器學習實作。"]
  ];

  for (const course of courses) {
    stmt.run(...course);
  }
}

app.get("/", (req, res) => {
  res.send("RateMyCourse API is running");
});

app.get("/api/courses", (req, res) => {
  const search = req.query.search || "";
  const category = req.query.category || "";
  const sort = req.query.sort || "newest";

  let query = `
    SELECT 
      courses.*,
      ROUND(AVG(reviews.rating), 1) AS avg_rating,
      ROUND(AVG(reviews.workload), 1) AS avg_workload,
      ROUND(AVG(reviews.difficulty), 1) AS avg_difficulty,
      COUNT(reviews.id) AS review_count
    FROM courses
    LEFT JOIN reviews ON courses.id = reviews.course_id
    WHERE (courses.name LIKE ? OR courses.teacher LIKE ?)
  `;

  const params = [`%${search}%`, `%${search}%` ];

  if (category) {
    query += ` AND courses.category = ?`;
    params.push(category);
  }

  query += ` GROUP BY courses.id`;

  // 排序邏輯
  if (sort === "rating_desc") query += ` ORDER BY avg_rating DESC`;
  else if (sort === "workload_asc") query += ` ORDER BY avg_workload ASC`;
  else if (sort === "difficulty_asc") query += ` ORDER BY avg_difficulty ASC`;
  else query += ` ORDER BY courses.id DESC`;

  try {
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/courses", (req, res) => {
  const { name, teacher, department, category, credit, description } = req.body;
  if (!name || !teacher || !category) return res.status(400).json({ error: "Missing required fields" });

  try {
    const info = db.prepare(`
      INSERT INTO courses (name, teacher, department, category, credit, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, teacher, department, category, credit, description);
    res.json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/courses/:id", (req, res) => {
  const id = req.params.id;

  try {
    const course = db.prepare(`
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
    `).get(id);

    if (!course) return res.status(404).json({ error: "Course not found" });

    const reviews = db.prepare("SELECT * FROM reviews WHERE course_id = ? ORDER BY id DESC").all(id);
    res.json({ ...course, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/courses/:id/reviews", (req, res) => {
  const courseId = req.params.id;
  const { rating, difficulty, workload, exam, gain, fun, comment } = req.body;

  try {
    const info = db.prepare(`
      INSERT INTO reviews (course_id, rating, difficulty, workload, exam, gain, fun, comment)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(courseId, rating, difficulty, workload, exam, gain, fun, comment);

    res.json({
      id: info.lastInsertRowid,
      course_id: courseId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});