const express = require("express"),
    router = express.Router({ mergeParams: true }),
    middlewares = require("../middleware");

// Importa as models utilizadas no projeto
const Camp = require("../models/campground"),
    Comment = require("../models/comment");

// --------------------------------------------- Comments Routes ------------------------------------------------

// New Route
// Exibe o formulário de criação de comentário caso o usuário esteja logado
router.get("/new", middlewares.isLogged, (req, res) => {
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
router.post("/", middlewares.isLogged, (req, res) => {
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
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${req.params.id}`);
                };
            });
        };
    });
});

// Edit Route
router.get("/:comment_id/edit", middlewares.isTheCommentOwner, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            console.log(`ERRO AO EXIBIR EDIÇÃO DE COMENTÁRIO: ${err}`);
            res.redirect("back");
        } else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    });
});

// Update Route
router.put("/:comment_id", middlewares.isTheCommentOwner, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            console.log(`ERRO AO EDITAR COMENTÁRIO: ${err}`);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy Route
router.delete("/:comment_id", middlewares.isTheCommentOwner, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            console.log(`ERRO AO DELETAR COMENTÁRIO: ${err}`);
            res.redirect("back");
        } else {
            res.redirect("back");
        }
    });
});

module.exports = router;
