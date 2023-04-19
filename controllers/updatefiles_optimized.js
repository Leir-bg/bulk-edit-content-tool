const express = require('express')
const fs = require('fs').promises
const path = require('path')

const updateRoute = express.Router()

const processFile = async (flpath, val, temp_val, new_val) => {
    try{
        const default_data = await fs.readFile(path.join(flpath, val), 'utf-8')
        let update_data = default_data

        if(Array.isArray(temp_val)){
            for(let i = 0; i < temp_val.length; i++){
                update_data = update_data.replace(new RegExp(`${temp_val[i]}\\b`, 'g'), new_val[i])
            }
        }else{
            update_data = update_data.replace(new RegExp(`${temp_val}\\b`, 'g'), new_val)
        }

        return update_data
    }catch(e){
        console.error(e)
        throw e
    }
}

updateRoute.post('/updateFiles', async (req, res, next) => {
    const {flpath, file_names} = req.body
    const filesToUpdate = Array.isArray(file_names) ? file_names : [file_names]
    
    try{
        for(const fileName of filesToUpdate){
            const filePath = path.join(flpath, fileName)
            let dynamicTempVal = req.body[`${fileName}_temp_val`]
            let dynamicNewVal = req.body[`${fileName}_new_val`]

            if(!Array.isArray(dynamicTempVal)){
                dynamicTempVal = [dynamicTempVal]
                dynamicNewVal = [dynamicNewVal]
            }

            for(let i = 0; i < dynamicTempVal.length; i++){
                const processed = await processFile(flpath, fileName, dynamicTempVal[i], dynamicNewVal[i])
                await fs.writeFile(filePath, processed, 'utf-8')
            }
        }
        
        console.log('Updated files!')
        res.status(200).redirect('/')
    }catch(e){
        console.error(e)
        res.status(500).send('Error occurred while updating the files.')
    }
})

module.exports = updateRoute