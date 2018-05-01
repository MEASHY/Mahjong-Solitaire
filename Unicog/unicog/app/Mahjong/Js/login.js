function useGeneric (value) {
    console.log("We are changing things")
    if (value) {
        document.getElementById('researcher').value = ''
        document.getElementById('researcher').disabled = true
    }
    else {
        document.getElementById('researcher').disabled = false
    }
}

$( document ).ready(function() {
   

    window.validateLogin = function () {
        console.log("validating now!")
        //Validate Reseaarcher
        if (!$(".useGenericID").val() === 'on') {
            if (!$.isNumeric($('#researcher').val()) ) {
                $('#loginAlert').text('The Researcher and Player IDs must be numeric values')
                $('#loginAlert').show()
                return false
            }
        }
        //Validate Player
        if (!$.isNumeric($('#player').val()) ) {
            $('#loginAlert').text('The Researcher and Player IDs must be numeric values')
            $('#loginAlert').show()
            return false
        }
    }
});


