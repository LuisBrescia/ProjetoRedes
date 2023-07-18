import $ from 'jquery/dist/jquery.min.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const unidade = urlParams.get('unidade');
document.getElementById('material').innerHTML = unidade;

$(document).ready(function () {
    $('#fechaAtividade').click(function () {
        window.location.href = '../index.html';
    });

    // window.onbeforeunload = function () {
    //     return "Você tem certeza de que deseja sair? Seus dados não salvos serão perdidos.";
    // };
    // $(window).on('unload', function () {
    //     if (!confirmedExit) {
    //         alert("Você cancelou a saída da página. Seus dados não foram perdidos.");
    //     }
    // });
    // var confirmedExit = false;
    // $(document).on('click', 'a', function () {
    //     confirmedExit = true;
    // });
});
