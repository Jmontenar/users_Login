const catchError = require('../utils/catchError');
const Users = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const getAll = catchError(async(req, res) => {
    const results = await Users.findAll();//{attributes: exclude:[{"elatributo a ocultar"}]}
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await Users.create({ firstname, lastname, email, password: hashedPassword });
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Users.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await Users.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Users.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const login = catchError(async(req,res)=>{
    const {email, password} = req.body;
    const user = await Users.findOne({where: {email}});
if(!user) return res.status(401).json({message:"Invalid credential"});
    const isValid = await bycript.compare(password, user.password)
if(!isValid) return res.status(401).json({message:"Invalid credential"});
const accessToken = jwt.sign(
    { user }, // payload
    process.env.TOKEN_SECRET, // clave secreta
    { expiresIn: '5m' } // OPCIONAL: Tiempo en el que expira el token
) 
return res.json(user, accessToken)
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login
}