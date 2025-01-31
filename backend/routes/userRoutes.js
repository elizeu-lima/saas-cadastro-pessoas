const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Cadastrar usuário
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send({ message: 'Usuário cadastrado com sucesso' });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Login de usuário
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ message: 'Credenciais inválidas' });
        }
        const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
        res.status(200).send({ token });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Deletar usuário
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Usuário deletado com sucesso' });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;