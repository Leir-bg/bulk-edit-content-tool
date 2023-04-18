const express = require('express')
const fs = require('fs').promises
const path = require('path')

const updateRoute = express.Router()

const processFile = async (flpath, val, temp_val, new_val) => {
    try{
        const default_data = await fs.readFile(path.join(flpath, val))
        let update_data = default_data.toString()
        let regex
        const fileCount = Array.isArray(temp_val) ? temp_val.length : 1

        if(fileCount > 1){
            for(let i = 0; i < temp_val.length; i++){
                regex = new RegExp(`${temp_val[i]}\\b`, 'g')
                update_data = update_data.replace(regex, new_val[i])
            }
        }else{
            regex = new RegExp(`${temp_val}\\b`, 'g')
            update_data = update_data.replace(regex, new_val)
        }

        return update_data
    }catch(e){
        console.error(e)
        throw e
    }
}

updateRoute.post('/updateFiles', async (req, res, next) => {
    try{
        const {
            flpath,
            file_names
        } = req.body
    
        let fileCount = Array.isArray(file_names) ? file_names.length : 0

        if(fileCount > 0){
            for(let i = 0; i < fileCount; i++){
                const filePath = path.join(flpath, file_names[i])
                let dynamicTempVal = req.body[`${file_names[i]}_temp_val`]
                let dynamicNewVal = req.body[`${file_names[i]}_new_val`]
                let processed

                if(!Array.isArray(dynamicTempVal)){
                    dynamicTempVal = [dynamicTempVal]
                }
                if(!Array.isArray(dynamicNewVal)){
                    dynamicNewVal = [dynamicNewVal]
                }

                for(let ii = 0; ii < dynamicTempVal.length; ii++){
                    processed = await processFile(flpath, file_names[i], dynamicTempVal[ii], dynamicNewVal[ii])
                    await fs.writeFile(filePath, processed)
                }
            }
        }else{
            const temp_val = req.body[`${file_names}_temp_val`]
            const new_val = req.body[`${file_names}_new_val`]
            const processed = await processFile(flpath, file_names, temp_val, new_val)
            await fs.writeFile(path.join(flpath, file_names), processed)
        }
        
        console.log('Updated files!')
        res.status(200).redirect('/')
    }catch(e){
        console.error(e)
        res.status(500).send('Error occurred while updating the files.')
    }
})

module.exports = updateRoute