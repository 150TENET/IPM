import express from 'express'
import fs from 'fs'

const app = express()
const PORT = 3000

// Load databases
const countrydbPath = new URL('./countrydb.json', import.meta.url)
const milestonesdbPath = new URL('./milestonesdb.json', import.meta.url)
const dbPath = new URL('./db/db.json', import.meta.url)

const countrydb = JSON.parse(fs.readFileSync(countrydbPath, 'utf-8'))
const milestonesdb = JSON.parse(fs.readFileSync(milestonesdbPath, 'utf-8'))
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))

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
  res.json(db.indicators)
})

// Payments endpoint
app.get('/payments', (req, res) => {
  const code = req.query.countryCode
  if (code) {
    const filtered = db.payments.filter(p => p.countryCode === code)
    res.json(filtered)
  } else {
    res.json(db.payments)
  }
})

// Beneficiaries endpoint
app.get('/beneficiaries', (req, res) => {
  const code = req.query.countryCode
  if (code) {
    const filtered = db.beneficiaries.filter(b => b.countryCode === code)
    res.json(filtered)
  } else {
    res.json(db.beneficiaries)
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
