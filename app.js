// Requere e salva os pacotes utilizados no projeto em variáveis
const express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	flash = require("connect-flash");

// Importa as models utilizadas no projeto
const Camp = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user");

// Importa as rotas
const commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

// Conecta o banco de dados à app
mongoose.connect("mongodb://localhost/YelpCamp", { useNewUrlParser: true });
// Permite a app lidar com as URL's
app.use(bodyParser.urlencoded({ extended: true }));
// Define a engine de renderização como arquivos ejs nas pasta view
app.set("view engine", "ejs");
// Diz à app onde encontrar arquivos custom de js e css
app.use(express.static(__dirname + "/public"));
// Permite criar novos tipos de rotas, como update, delete, etc
app.use(methodOverride("_method"));
//
app.use(flash());


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

// Passar os dados do usuário e das flash-messages para todas as rotas
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.denied = req.flash("denied");
	next();
});


// ------------------------------------------------- Routes -----------------------------------------------------
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// Quando qualquer URL não reconhecida for solicitada 
app.get("*", (req, res) => {
	// TODO renderiza página de erro (404)
	res.send("Essa página não existe.")
});

// Dá uma porta local para o servidor Node rodar
app.listen(3000, () => console.log("Server iniciado."));