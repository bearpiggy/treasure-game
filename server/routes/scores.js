const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, (req, res) => {
  const { score } = req.body;
  if (typeof score !== 'number') {
    return res.status(400).json({ error: 'Score must be a number' });
  }
  db.prepare('INSERT INTO scores (user_id, score) VALUES (?, ?)').run(req.user.id, score);
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  const rows = db
    .prepare('SELECT score, played_at FROM scores WHERE user_id = ? ORDER BY played_at DESC')
    .all(req.user.id);
  res.json(rows);
});

module.exports = router;
