import Database from "better-sqlite3";
import cors from "cors";
import express from "express";

const db = Database("./db/data.db", { verbose: console.log });
const app = express();
app.use(cors());
app.use(express.json());

const port = 5678;

const getAplicantById = db.prepare(`SELECT * FROM aplicants WHERE id = @id;`);

const getInterviewerById = db.prepare(
  `SELECT * FROM interviewers WHERE id = ?;`
);

const getInterviewsForAplicant = db.prepare(`
SELECT aplicants.* FROM aplicants
JOIN interviews ON aplicants.id = interviews.aplicantId
WHERE interviews.aplicantId = @aplicantId;
`);

const getInterviewsForInterviewer = db.prepare(`
SELECT interviewers.* FROM interviewers
JOIN interviews ON interviewers.id = interviews.interviewerId
WHERE interviews.interviewerId = @interviewerId;
`);

app.get("/aplicants/:id", (req, res) => {
  const aplicant = getAplicantById.get(req.params);

  if (aplicant) {
    aplicant.interviews = getInterviewsForAplicant.all({
      aplicantId: aplicant.id,
    });
    // aplicant.interviewers = getInterviewsForAplicant.all({
    //   aplicantId: aplicant.id
    // })
    res.send(aplicant);
  } else {
    res.status(404).send({ error: "Aplicant not found" });
  }
});

const createAplicant = db.prepare(`
INSERT INTO aplicants (name, email) VALUES (@name, @email);
`);

app.post("/aplicants", (req, res) => {
  let aplicant = createAplicant.run(req.params);
  res.send(aplicant);
});

app.get("/interviewers/:id", (req, res) => {
  const interviewer = getInterviewerById.get(req.params);

  if (interviewer) {
    interviewer.interviews = getInterviewsForInterviewer.all({
      interviewerId: interviewer.id,
    });
    res.send(interviewer);
  } else {
    res.status(404).send({ error: "Interviewer not found" });
  }
});

const createInterviewer = db.prepare(`
INSERT INTO interviewers (name, email) VALUES (@name, @email);
`);

app.post("/interviewers", (req, res) => {
  let interviewer = createInterviewer.run(req.params);
  res.send(interviewer);
});

const createInterviews = db.prepare(`
INSERT INTO interviews (aplicantId, interviewerId, date, score) VALUES (@aplicantId, @interviewerId, @date, @score);
`);

app.post("/interviews", (req, res) => {
  let interview = createInterviews.run(req.params);
  res.send(interview);
});

app.listen(port, () => {
  console.log(`App running on: http://localhost:${port}`);
});
