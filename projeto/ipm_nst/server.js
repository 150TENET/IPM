import express from 'express'
import fs from 'fs'

const app = express()
const PORT = 3000

// Configuração de CORS para garantir que o Vue (porta 5173) consegue falar com o Express (porta 3000)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// Load databases
const countrydbPath = new URL('./countrydb.json', import.meta.url)
const milestonesdbPath = new URL('./milestonesdb.json', import.meta.url)
const dbPath = new URL('./db/db.json', import.meta.url)

const countrydb = JSON.parse(fs.readFileSync(countrydbPath, 'utf-8'))
const milestonesdb = JSON.parse(fs.readFileSync(milestonesdbPath, 'utf-8'))

// Salvaguarda contra ficheiros gigantes: se o db.json passar do limite, o Node avisa em vez de crashar silenciosamente
let db = {}
try {
  const dbBuffer = fs.readFileSync(dbPath)
  db = JSON.parse(dbBuffer.toString())
} catch {
  console.error('Erro crítico ao ler o db.json: O ficheiro é demasiado grande para a memória do Node.js!')
}

// 1. NOVO ENDPOINT: Rota dinâmica para o Kohesio (Resolve o Erro 404 do Frontend)
// Captura qualquer chamada do tipo /AT-kohesio ou /BE-kohesio e extrai do db.json
app.get('/:countryCode-kohesio', (req, res) => {
  const code = req.params.countryCode.toUpperCase()
  const chaveKohesio = `${code}-kohesio`

  if (db[chaveKohesio]) {
    res.json(db[chaveKohesio])
  } else {
    res.json([]) // Devolve array vazio se o país não existir no db.json
  }
})

// Countries endpoint
app.get('/countries', (req, res) => {
  const code = req.query.code
  if (code) {
    const country = countrydb.countries.find(c => c.code === code)
    res.json(country ? [country] : [])
  } else {
    res.json(countrydb.countries)
  }
})

// Milestones endpoint
app.get('/milestones', (req, res) => {
  const country = req.query.Country
  if (country) {
    const filtered = milestonesdb.milestones.filter(m => m.Country === country)
    res.json(filtered)
  } else {
    res.json(milestonesdb.milestones)
  }
})

// Indicators endpoint
app.get('/indicators', (req, res) => {
  res.json(db.indicators || [])
})

// Payments endpoint
app.get('/payments', (req, res) => {
  const code = req.query.countryCode
  if (code) {
    const filtered = (db.payments || []).filter(p => p.countryCode === code)
    res.json(filtered)
  } else {
    res.json(db.payments || [])
  }
})

// Beneficiaries endpoint
app.get('/beneficiaries', (req, res) => {
  const code = req.query.countryCode
  if (code) {
    const filtered = (db.beneficiaries || []).filter(b => b.countryCode === code)
    res.json(filtered)
  } else {
    res.json(db.beneficiaries || [])
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
