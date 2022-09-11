import Database from 'better-sqlite3'

const db = Database('./db/data.db', { verbose: console.log })

const aplicants = [
  {
    name: 'Teodora Gjini',
    email:"teodoragjini@yahoo.com"
  },
  {
    name: 'Edi Rama',
    email:"edirama@gmail.com"
  },
]

const interviewers = [
  {
    name: 'Mona Lisa',
    email:"mona@mail.com"
  },
  {
    name: 'Sali Berisha',
    email:"sali@yahoo.com"
  },
]

const interviews = [
    {
      aplicantId: 1,
      interviewerId: 1,
      date:"05/09/2022",
      score: 10
    },
    {
      aplicantId: 1,
      interviewerId: 2,
      date:"10/08/2022",
      score: 7
    },
    {
      aplicantId: 2,
      interviewerId: 2,
      date:"05/09/2022",
      score: 9
    },
  ]

const dropAplicantsTable = db.prepare(`DROP TABLE IF EXISTS aplicants;`)
dropAplicantsTable.run()

const createAplicantsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS aplicants (
  id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  PRIMARY KEY (id)
);
`)
createAplicantsTable.run()

const createAplicant = db.prepare(`
INSERT INTO aplicants (name, email) VALUES (@name, @email);
`)

for (let aplicant of aplicants) createAplicant.run(aplicant)

const dropInterviewersTable = db.prepare(`DROP TABLE IF EXISTS interviewers;`)
dropInterviewersTable.run()

const createInterviewersTable = db.prepare(`
CREATE TABLE IF NOT EXISTS interviewers (
  id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  PRIMARY KEY (id)
);
`)
createInterviewersTable.run()

const createInterviewer = db.prepare(`
INSERT INTO interviewers (name, email) VALUES (@name, @email);
`)
for (let interviewer of interviewers) createInterviewer.run(interviewer)

// What links them together?

const dropInterviewsTable = db.prepare(`
DROP TABLE IF EXISTS interviews;
`)

dropInterviewsTable.run()

const createInterviewsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS interviews (
  id INTEGER,
  interviewerId INTEGER,
  aplicantId INTEGER,
  date TEXT NOT NULL,
  score INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (interviewerId) REFERENCES interviews(id) ON DELETE CASCADE,
  FOREIGN KEY (aplicantId) REFERENCES aplicants(id) ON DELETE CASCADE
);
`)

createInterviewsTable.run()

const createInterview = db.prepare(`
INSERT INTO interviews (aplicantId, interviewerId, date, score) VALUES (@aplicantId, @interviewerId, @date, @score);
`)

for (let interview of interviews) createInterview.run(interview)