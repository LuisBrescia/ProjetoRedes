import $ from 'jquery/dist/jquery.min.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const unidade = urlParams.get('unidade');
document.getElementById('material').innerHTML = unidade;

$(document).ready(function () {
    $('#fechaAtividade').click(function () {
        window.location.href = '../index.html';
    });
});
