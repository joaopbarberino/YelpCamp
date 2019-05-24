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
            req.flash("denied", "Não foi possível encontrar os acampamentos!");
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
        price = req.body.price,
        author = {
            id: req.user._id,
            username: req.user.username
        }
    newCampground = { name: name, imgURL: imgURL, description: desc, price: price, author: author };
    // Cria um objeto no banco de dados com os dados recebidos
    Camp.create(newCampground, (err, camp) => {
        // Verifica se houve erro
        if (err) {
            req.flash("error", "Erro ao criar acampamento!");
            console.log(`ERRO AO SALVAR CAMP: ${err}`);
            // Se não houve erro, redireciona o usuário a página de campgrounds
        } else {
            req.flash("success", "Acampamento criado com sucesso!");
            res.redirect("/campgrounds")
        }
    });
});

// Show Route
// Quando uma requisição é feita a url /campgrounds/ <id do camp selecionado>
router.get("/:id", (req, res) => {
    Camp.findById(req.params.id).populate("comments").exec((err, campEscolhido) => {
        // Verifica se houve erro
        if (err) {
            req.flash("error", "Não foi possível exibir o acampamento escolhido!");
            console.log(`ERRO NA EXIBIÇÃO DO CAMP ESCOLHIDO: ${err}`);
            res.redirect("/campgrounds")
           
            // Se não houve erro, renderiza a página de exibição do camp escolhido
        } else {
            // Renderiza a página de informações do camp selecionado
            res.render("campgrounds/show", { campground: campEscolhido });
        }
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
            req.flash("error", "Não foi possível editar o acampamento!");
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            req.flash("success", "Acampamento editado com sucesso!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy Route
router.delete("/:id", middlewares.isTheCampOwner, (req, res) => {
    Camp.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            req.flash("error", "Não foi possível deletar o acampamento!");
            console.log(`ERRO AO DELETAR CAMP ${err}`);
            res.redirect("/campgrounds");
        } else {
            Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, (err) => {
                if (err) {
                    req.flash("error", "Não foi possível deletar os comentários do acampamento deletado!");
                    console.log(`ERRO AO DELETAR COMENTARIO DE CAMPO DELETADO: ${err}`);
                    res.redirect("/campgrounds");
                } else {
                    req.flash("success", "Acampamento e comentários deletados com sucesso!");
                    res.redirect("/campgrounds");
                }
            });
        }
    });
});

module.exports = router;