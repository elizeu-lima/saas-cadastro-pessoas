const express = require('express');
const Person = require('../models/Person');
const router = express.Router();

// Listar todas as pessoas
router.get('/', async (req, res) => {
    try {
        const people = await Person.find();
        res.status(200).send(people);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Cadastrar pessoa
router.post('/', async (req, res) => {
    try {
        const person = new Person(req.body);
        await person.save();
        res.status(201).send(person);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Editar pessoa
router.put('/:id', async (req, res) => {
    try {
        const updatedPerson = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(updatedPerson);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Deletar pessoa
router.delete('/:id', async (req, res) => {
    try {
        await Person.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Pessoa deletada com sucesso' });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Filtro de pessoas (exemplo por nome)
router.get('/filter', async (req, res) => {
    const { name } = req.query;
    try {
        const people = await Person.find({ name: { $regex: name, $options: 'i' } });
        res.status(200).send(people);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
