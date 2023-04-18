$(document).ready(function(){
    $('.addFields').click(function(e){
        e.preventDefault()

        const file = $(this).parents().siblings('legend')
        const html = `<div class="breakrow"></div><input type="text" placeholder="Value to replace here..." name="${file.text()}_temp_val"><input type="text" placeholder="Input text here..." name="${file.text()}_new_val">`

        $(this).before(html)
    })
})