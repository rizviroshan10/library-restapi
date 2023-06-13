const express = require('express')
const router = express.Router()
const Data = require('../models/Data')

function result(succ,msg,details){
    if(details){
        return{
            success: succ,
            message: msg,
            data: details
        }
    }else{
        return{
            success: succ,
            message: msg
        }
    }
}


router.get('/',async(req,res)=>{
    try {
        const data = await Data.aggregate([
            {
                $lookup: {
                    from: 'user',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $set : {
                    id: '$_id',
                    username: {$arrayElemAt: ['$userData.username',0] },
                    created_date: {$dateToString: {format: '%d-%m-%Y %H:%M:%S',date: '$created_date', timezone: '+07:00'}},
                    modified_date: {$dateToString: {format: '%d-%m-%Y %H:%M:%S',date: '$modified_date', timezone: '+07:00'}}
                }
            },
            {
                $project : {
                    userData: 0,
                    _id: 0
                }
            }
        ]);

        if(data.length > 0 ){
            res.status(200).json(result(1,'Retreive Data Success!', study))
        }else{
            res.status(200).json(result(0,'Tidak ada data!'))
        }
    }catch (error){
        res.status(500).json(result(0,error.message))
    }
       
   
})

router.post('/',async (req,res)=>{
    const inputData = new Data({
        content: req.body.content,
        nama_lapangan : req.body.nama_lapangan,
        foto : req.body.foto,
        user_id: req.body.user_id
    })

    try{
        const data = await inputData.save()
        res.status(200).json(result(1,'Insert data Success!'))
    }catch(error){
           res.status(500).json(result(0, error.message))
        }
})

router.put('/',async(req,res)=>{
    const data = {
        id: req.body.id,
        content : req.body.content,
        nama_lapangan : req.body.nama_lapangan,
        foto : req.body.foto,
        modified_date: Date.now()
    }
    try{
        const data = await Data.updateOne({
            _id: data.id
        },data)
        if(data.matchedCount>0){
            res.status(200).json(result(1,'Update data Success!'))
        }else{
            res.status(200).json(result(0,'Update data Failed!'))
        }
    }catch(error){
        res.status(500).json(result(0, error.message))
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const data = await Data.deleteOne({
            _id: req.params.id
        })

        if(data.deletedCount>0){
            res.status(200).json(result(1,'Delete data Success!'))
        }else{
            res.status(200).json(result(0,'Delete data Failed!'))
        }
    }catch(error){
        res.status(500).json(result(0, error.message))
    }
})

module.exports = router