'use strict'
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Mongoose } = require('mongoose');
require('dotenv').config();
const server = express();
server.use(cors());
server.use(express.json());
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exam', { useNewUrlParser: true, useUnifiedTopology: true });
const PORT = process.env.PORT



const flowerSchema = mongoose.Schema({
    instructions: String,
    photo: String,
    name: String
    
    
})

const ownerSchema = mongoose.Schema({
    userEmail: String,
    flowers: [flowerSchema]
})

const ownerModel = mongoose.model('flower', ownerSchema)


function updateFlowerHandler(req, res) {
    const { idx } = req.params
    const { userEmail, flowerObj } = req.body

    ownerModel.findOne({ userEmail: userEmail }, (err, result) => {
        if (err) { console.log(err) }
        else {
            result.flowers[idx] = flowerObj
            result.save().then(() => {
                ownerModel.findOne({ userEmail: userEmail }, (err, result) => {
                    if (err) { console.log(err) }
                    else {
                        res.send(result.flowers)
                    }
                })

            })
        }
    })


}


function deleteFlowerHandler(req, res) {

    const { idx } = req.params
    const { userEmail } = req.query

    ownerModel.findOne({ userEmail: userEmail }, (err, result) => {
        if (err) { console.log(err) }
        else {
            result.flowers.splice(idx, 1)
            result.save().then(() => {
                ownerModel.findOne({ userEmail: userEmail }, (err, result) => {
                    if (err) { console.log(err) }
                    else {
                        res.send(result.flowers)
                    }
                })

            })
        }
    })




}




function getFavFlowersHandler(req, res) {
    const { userEmail } = req.query
    ownerModel.findOne({ userEmail: userEmail }, (err, result) => {
        if (err) { console.log(err) }
        else {
            res.send(result.flowers)
        }
    })
}



function addFlowerHandler(req, res) {
    const { userEmail, flowerObj } = req.body
    ownerModel.findOne({ userEmail: userEmail }, (err, result) => {
        if (err) { console.log(err) }
        else if (!result) {
            const newOwner = new ownerModel({
                userEmail: userEmail,
                flowers: flowerObj
            })
            newOwner.save()
        }
        else {
            result.flowers.unshift(flowerObj)
        }
        result.save()
    })
}




function getAllflowersHandler(req, res) {
    axios
        .get('https://flowers-api-13.herokuapp.com/getFlowers')
        .then(result => {
            res.send(result.data.flowerslist)
        })

}




// http://localhost:3003/allFlowers
// http://localhost:3003/addFlower
// http://localhost:3003/favFlowers
// http://localhost:3003/deleteFlower/:idx
// http://localhost:3003/updateFlower/:idx
server.get('/allFlowers', getAllflowersHandler)
server.post('/addFlower', addFlowerHandler)
server.get('/favFlowers', getFavFlowersHandler)
server.delete('/deleteFlower/:idx', deleteFlowerHandler)
server.put('/updateFlower/:idx', updateFlowerHandler)






server.listen(PORT, () => {
    console.log('listening to PORT', PORT)
})




