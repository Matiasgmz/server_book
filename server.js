const express = require('express')

const app = express()

let cors = require('cors')

const fs = require('fs');

const librairie = require('./librairie.json')

app.use(express.json())
app.use(cors())


// get 
app.get('/book', (req, res) => {
    res.status(200).json(librairie)
})

// get by id 
app.get('/book/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const theBook = librairie.find(librairie => librairie.id === id)
    res.status(200).json(theBook)

})

// get by name
app.get('/book/title/:title', (req, res) => {
    const title = req.params.title;
    const theBook = librairie.find((livre) => livre.titre === title);

    if (theBook) {
        res.status(200).json(theBook);
    } else {
        res.status(404).json({ error: 'Livre non trouvé' });
    }

})

// post 
app.post('/book', (req, res) => {
    const newBook = req.body;

    const maxId = librairie.reduce((max, book) => (book.id > max ? book.id : max), 0);

    newBook.id = maxId + 1;

    librairie.push(newBook);

    fs.writeFile('./librairie.json', JSON.stringify(librairie, null, 2), (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur lors de l'écriture dans le fichier JSON" });
        } else {
            res.status(200).json(librairie);
        }
    });
});


// put 
app.put('/book/:id', (req, res) => {
    const id = parseInt(req.params.id)
    let theBook = librairie.find(librairie => librairie.id === id)
    if (theBook) {
        theBook.titre = req.body.titre;
        theBook.auteur = req.body.auteur;
        theBook.prix = req.body.prix;
        theBook.description = req.body.description;

        fs.writeFile('./librairie.json', JSON.stringify(librairie, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de l\'écriture du fichier JSON' });
            } else {
                res.status(200).json(theBook);
            }
        });
    } else {
        res.status(404).json({ error: 'Livre non trouvé' });
    }
})

// delete
app.delete('/book/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let theBook = librairie.find((librairie) => librairie.id === id);

    if (theBook) {
        librairie.splice(librairie.indexOf(theBook), 1);

        fs.writeFile('./librairie.json', JSON.stringify(librairie, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erreur lors de l\'écriture du fichier JSON' });
            } else {
                res.status(200).json(librairie);
            }
        });
    } else {
        res.status(404).json({ error: 'Livre non trouvé' });
    }
});

app.listen(3000, () => {
    console.log("Serveur à l'ecoute")
})