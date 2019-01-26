$('#btn-like').click(function (e) {
    e.preventDefault()
    var image_id = $(this).data('id')
    $.post('/images/' + image_id + '/like').done(data => {
        $('.likes-count').text(data.likes)
    })
})