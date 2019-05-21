// Requere e salva os pacotes utilizados no projeto em variáveis
const express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local");

// Importa as models utilizadas no projeto
const Camp = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user");

// Conecta o banco de dados à app
mongoose.connect("mongodb://localhost/YelpCamp", { useNewUrlParser: true });
// Permite a app lidar com as URL's
app.use(bodyParser.urlencoded({ extended: true }));
// Define a engine de renderização como arquivos ejs nas pasta view
app.set("view engine", "ejs");

// Configuração Passport
app.use(require("express-session")({
	secret: "segredo",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Teste criação de acampamento com comentario
// Camp.create(
// 	{
// 		name: "AaAAaaaAAAaaa",
// 		imgURL: "https://farm1.staticflickr.com/53/179783786_ebb3beeb4c.jpg",
// 		desc: "ASHDIFAISDFJAISDJF"
// 	}, (err, acamp) => {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			Comment.create(
// 				{
// 					author: "Zézinho",
// 					text: "Super TOOOOOOOOOOOP"
// 				}, (err, comment) => {
// 					if (err) {
// 						console.log(err);
// 					} else {
// 						acamp.comments.push(comment);
// 						acamp.save();
// 					}
// 				}
// 			)
// 		}
// 	});

// ------------------------------------------------- Routes -----------------------------------------------------
// ---------------------------------------------- Camps Routes --------------------------------------------------

// Path Route
// Quando a URL path for solicitada
app.get("/", (req, res) => {
	// Renderiza pagina inicial
	res.render("landing");
});

// Index Route
// Quando a URL /campgrounds for solicitada
app.get("/campgrounds", (req, res) => {
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
app.get("/campgrounds/new", (req, res) => {
	// Renderiza a página de formulário
	res.render("campgrounds/new.ejs");
});

// Create Route
// Quando uma requisição POST for feita à URL /campgrounds, no caso, vinda de um form 
app.post("/campgrounds", (req, res) => {
	// Guarda os dados recebidos da requisição
	let name = req.body.name,
		imgURL = req.body.image,
		desc = req.body.desc,
		newCampground = { name: name, imgURL: imgURL, description: desc };
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
app.get("/campgrounds/:id", (req, res) => {

	Camp.findById(req.params.id).populate("comments").exec((err, campEscolhido) => {
		// Verifica se houve erro
		if (err) {
			console.log("ERRO NA EXIBIÇÃO DO CAMP ESCOLHIDO!")
			console.log(err)
			// Se não houve erro, renderiza a página de exibição do camp escolhido
		} else {
			// Renderiza a página de informações do camp selecionado
			res.render("campgrounds/show", { campground: campEscolhido });
		}
	});
});

// --------------------------------------------- Comments Routes ------------------------------------------------

// New Route
app.get("/campgrounds/:id/comments/new", (req, res) => {
	Camp.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(`ERRO AO ENCONTRAR ACAMPAMENTO: ${err}`);
		} else {
			res.render("comments/new", { campground: campground });
		}
	});
});

// Create Route
app.post("/campgrounds/:id/comments", (req, res) => {
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
					console.log(`Comentário criado: ${comment} no camp ${campground}`);
					campground.comments.push(comment);
					campground.save();
					console.log(campground.comments)
					res.redirect(`/campgrounds/${req.params.id}`);
				};
			});
		};
	});
});

// --------------------------------------------- Auth Routes ------------------------------------------------

// Register form
app.get("/register", (req, res) => {
	res.render("register");
});






























// Quando qualquer URL não reconhecida for solicitada 
app.get("*", (req, res) => {
	// TODO renderiza página de erro (404)
	res.send("Essa página não existe.")
});

// Dá uma porta local para o servidor Node rodar
app.listen(3000, () => console.log("Server iniciado."));