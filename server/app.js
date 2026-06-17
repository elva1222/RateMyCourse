const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./school.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      teacher TEXT NOT NULL,
      department TEXT,
      credit INTEGER,
      description TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      rating INTEGER,
      difficulty INTEGER,
      workload INTEGER,
      comment TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(course_id) REFERENCES courses(id)
    )
  `);

  db.get("SELECT COUNT(*) AS count FROM courses", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare(`
        INSERT INTO courses (name, teacher, department, credit, description)
        VALUES (?, ?, ?, ?, ?)
      `);

      stmt.run("資料結構", "王小明", "資訊工程學系", 3, "介紹 linked list、stack、queue、tree 等資料結構。");
      stmt.run("Python 程式設計", "李小華", "資訊管理學系", 3, "學習 Python 基礎語法、函式、檔案處理與資料分析。");
      stmt.run("資料庫系統", "陳志豪", "資訊管理學系", 3, "介紹 SQL、ER Model、正規化與資料庫設計。");
      stmt.run("網頁程式設計", "林雅婷", "資訊管理學系", 3, "學習 HTML、CSS、JavaScript 與前後端整合。");
      stmt.run("軟體工程", "張俊傑", "資訊管理學系", 3, "介紹需求分析、UML、設計模式與軟體開發流程。");

      stmt.finalize();
    }
  });
});

app.get("/", (req, res) => {
  res.send("RateMyCourse API is running");
});

app.get("/api/courses", (req, res) => {
  const search = req.query.search || "";

  db.all(
    `
    SELECT 
      courses.*,
      ROUND(AVG(reviews.rating), 1) AS avg_rating,
      COUNT(reviews.id) AS review_count
    FROM courses
    LEFT JOIN reviews ON courses.id = reviews.course_id
    WHERE courses.name LIKE ? OR courses.teacher LIKE ?
    GROUP BY courses.id
    ORDER BY courses.id DESC
    `,
    [`%${search}%`, `%${search}%`],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.get("/api/courses/:id", (req, res) => {
  const id = req.params.id;

  db.get(
    `
    SELECT 
      courses.*,
      ROUND(AVG(reviews.rating), 1) AS avg_rating,
      COUNT(reviews.id) AS review_count
    FROM courses
    LEFT JOIN reviews ON courses.id = reviews.course_id
    WHERE courses.id = ?
    GROUP BY courses.id
    `,
    [id],
    (err, course) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!course) return res.status(404).json({ error: "Course not found" });

      db.all(
        "SELECT * FROM reviews WHERE course_id = ? ORDER BY id DESC",
        [id],
        (err, reviews) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ ...course, reviews });
        }
      );
    }
  );
});

app.post("/api/courses/:id/reviews", (req, res) => {
  const courseId = req.params.id;
  const { rating, difficulty, workload, comment } = req.body;

  db.run(
    `
    INSERT INTO reviews (course_id, rating, difficulty, workload, comment)
    VALUES (?, ?, ?, ?, ?)
    `,
    [courseId, rating, difficulty, workload, comment],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        id: this.lastID,
        course_id: courseId,
        rating,
        difficulty,
        workload,
        comment,
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});