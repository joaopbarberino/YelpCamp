const express = require("express"),
    router = express.Router({mergeParams: true});

// Importa as models utilizadas no projeto
const Camp = require("../models/campground"),
    Comment = require("../models/comment");

// --------------------------------------------- Comments Routes ------------------------------------------------

// New Route
// Exibe o formulário de criação de comentário caso o usuário esteja logado
router.get("/new", isLogged, (req, res) => {
    Camp.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(`ERRO AO ENCONTRAR ACAMPAMENTO: ${err}`);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

// Create Route
// Cria um comentário ligado ao usuário logado, caso haja um
router.post("/", isLogged, (req, res) => {
    Camp.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(`ERRO AO ENCONTRAR ACAMPAMENTO: ${err}`);
        } else {
            Comment.create({
                author: req.body.comment.author,
                text: req.body.comment.text
            }, (err, comment) => {
                if (err) {
                    console.log(`ERRO AO CRIAR COMENTÁRIO ${err}`);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    console.log(comment);
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${req.params.id}`);
                };
            });
        };
    });
});

function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/warning");
}

module.exports = router;
