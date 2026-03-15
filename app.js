const express    = require('express');
const { engine } = require('express-handlebars');
const path       = require('path');
const fs         = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;
const DB   = path.join(__dirname, 'phonebook.json');

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir:  path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    cancelButton(url) {
      return `<a href="${url}" class="btn btn-cancel">Отказаться</a>`;
    },
    concat(...args) {
      return args.slice(0, -1).join('');
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

function readDB()      { return JSON.parse(fs.readFileSync(DB, 'utf8')); }
function writeDB(data) { fs.writeFileSync(DB, JSON.stringify(data, null, 2)); }

// GET /
app.get('/', (req, res) => {
  res.render('index', { contacts: readDB() });
});

// GET /Add
app.get('/Add', (req, res) => {
  res.render('add', { contacts: readDB() });
});

// GET /Update?id=N
app.get('/Update', (req, res) => {
  const id      = parseInt(req.query.id);
  const contacts = readDB();
  const entry   = contacts.find(c => c.id === id);
  if (!entry) return res.redirect('/');
  res.render('update', { contacts, entry });
});

// POST /Add
app.post('/Add', (req, res) => {
  const { name, phone } = req.body;
  const contacts = readDB();
  const newId    = contacts.length ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
  contacts.push({ id: newId, name: name.trim(), phone: phone.trim() });
  writeDB(contacts);
  res.redirect('/');
});

// POST /Update
app.post('/Update', (req, res) => {
  const { id, name, phone } = req.body;
  const contacts = readDB();
  const idx      = contacts.findIndex(c => c.id === parseInt(id));
  if (idx !== -1) {
    contacts[idx].name  = name.trim();
    contacts[idx].phone = phone.trim();
    writeDB(contacts);
  }
  res.redirect('/');
});

// POST /Delete
app.post('/Delete', (req, res) => {
  const id      = parseInt(req.body.id);
  writeDB(readDB().filter(c => c.id !== id));
  res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));