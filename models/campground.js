const mongoose = require("mongoose");

// Cria um esquema para definir um objeto acampamento no banco de dados
const campSchema = new mongoose.Schema({
	name: String,
	imgURL: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    } 
});

// Cria um objeto capaz de manipular a coleção criada no db a partir do esquema e o exporta
module.exports = mongoose.model("Camp", campSchema);