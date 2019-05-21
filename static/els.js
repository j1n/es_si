$(document).ready(function() {
    $('.filter_hide').hide();

    $('.filter_show').on("click", showFilter);
});

function showFilter(){
    $('.filter_hide').show();
    $('.filter_show').hide();
}