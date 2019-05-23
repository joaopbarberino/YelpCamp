const express = require("express"),
    router = express.Router(),
    middlewares = require("../middleware");

// Importa as models utilizadas no projeto
const Camp = require("../models/campground"),
    Comment = require("../models/comment");

// ---------------------------------------------- Camps Routes --------------------------------------------------

// Index Route
// Quando a URL /campgrounds for solicitada
router.get("/", (req, res) => {
    // Pega todos os camps do banco de dados
    Camp.find({}, (err, camps) => {
        // Verifica se houve erro
        if (err) {
            console.log("ERRO AO COLETAR CAMPS!")
            console.log(err);
            // Se não houve erro, renderiza a página de campgrounds com os dados coletados
        } else {
            res.render("campgrounds/campgrounds", { campgrounds: camps });
        }
    });
});

// New Route
// Quando a URL /campgrounds/new for solicitada (adição de novo acampamento)
router.get("/new", middlewares.isLogged, (req, res) => {
    // Renderiza a página de formulário
    res.render("campgrounds/new.ejs");
});

// Create Route
// Quando uma requisição POST for feita à URL /campgrounds, no caso, vinda de um form 
router.post("/", middlewares.isLogged, (req, res) => {
    // Guarda os dados recebidos da requisição
    let name = req.body.name,
        imgURL = req.body.image,
        desc = req.body.desc,
        author = {
            id: req.user._id,
            username: req.user.username
        }
    newCampground = { name: name, imgURL: imgURL, description: desc, author: author };
    // Cria um objeto no banco de dados com os dados recebidos
    Camp.create(newCampground, (err, camp) => {
        // Verifica se houve erro
        if (err) {
            console.log("ERRO AO SALVAR CAMP!");
            console.log(err);
            // Se não houve erro, redireciona o usuário a página de campgrounds
        } else {
            console.log("Camp adicionado.");
            console.log(camp);
            res.redirect("/campgrounds")
        }
    });
});

// Show Route
// Quando uma requisição é feita a url /campgrounds/ <id do camp selecionado>
router.get("/:id", (req, res) => {
    Camp.findById(req.params.id).populate("comments").exec((err, campEscolhido) => {
        // Verifica se houve erro
        //if (err) {
            //console.log(`ERRO NA EXIBIÇÃO DO CAMP ESCOLHIDO: ${err}`);
           
            // Se não houve erro, renderiza a página de exibição do camp escolhido
        //} else {
            // Renderiza a página de informações do camp selecionado
            res.render("campgrounds/show", { campground: campEscolhido });
        //}
    });
});

// Edit Route
router.get("/:id/edit", middlewares.isTheCampOwner, (req, res) => {
    Camp.findById(req.params.id, (err, campEscolhido) => {
        res.render("campgrounds/edit", { campground: campEscolhido });
    });
});

// Update Route
router.put("/:id", middlewares.isTheCampOwner, (req, res) => {
    Camp.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy Route
router.delete("/:id", middlewares.isTheCampOwner, (req, res) => {
    Camp.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(`ERRO AO DELETAR CAMP ${err}`);
            res.redirect("/campgrounds");
        } else {
            Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, (err) => {
                if (err) {
                    console.log(`ERRO AO DELETAR COMENTARIO DE CAMPO DELETADO: ${err}`);
                    res.redirect("/campgrounds");
                } else {
                    res.redirect("/campgrounds");
                }
            });
        }
    });
});

module.exports = router;