import $ from 'jquery/dist/jquery.min.js'
// import '@popperjs/core/dist/umd/popper.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

$(document).ready(function () {
    var unidade = localStorage.getItem('unidade') || 1;
    $('[name="unidade"]').val(unidade)


    // * Função que define a unidade a ser estudada
    $('[name="unidade"]').change(function () {
        unidade = $(this).val()
        console.log(unidade)
        localStorage.setItem('unidade', unidade);
        carregaConteudo(unidade);
    })

    carregaConteudo(unidade);
})

function carregaConteudo(unidade) {
    $('#conteudo').load('/unidade'+ unidade +'.html #unidade'+ unidade +'_conteudo');
    $('#topico').load('/unidade'+ unidade +'.html #unidade'+ unidade +'_topicos');
    // $('#interativo').load('/unidade'+ unidade +'.html #unidade'+ unidade +'_interativo');
}