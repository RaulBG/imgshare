$('#btn-like').click(function (e) {
    e.preventDefault()
    var image_id = $(this).data('id')
    $.post('/images/' + image_id + '/like').done(data => {
        $('.likes-count').text(data.likes)
    })
})
$('#btn-delete').click(function (e) {
    e.preventDefault()
    var $this = $(this)
    var confirmar = confirm('Are you sure?')
    if (confirmar) {
        var image_id = $this.data('id')
        $.ajax({
            url: '/images/' + image_id,
            type: 'DELETE',
        }).done(function (response) {
            $this.removeClass('btn-danger').addClass('btn-success')
            $this.html('<span>Deleted</span>')
        })
    }
})
$('.show').hide()
$('#btn-toggle-comment').click(function (e) {
    e.preventDefault()
    $('.show').slideToggle()
})