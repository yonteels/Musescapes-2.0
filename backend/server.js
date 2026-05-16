require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')


const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        )
        res.json({ message: 'User created!', user: result.rows[0] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Email already exists or something went wrong' })
    }
})

app.post('/login', async (req, res) =>{
    const {identifier , password} = req.body
    const result = await pool.query(
        'SELECT * FROM users WHERE username = $1 OR email = $1',[identifier]
    )
    if (result.rows.length === 0){
        res.status(500).json({error: 'The Password or Username is incorrect'})
    } else{
        const passwordMatch = await bcrypt.compare(password, result.rows[0].password_hash)
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' })
        } else {res.json({message:'You have been logged in!', user: result.rows[0]}
        )}
    }
})

app.listen(5000, () => console.log('Server running on port 5000'))