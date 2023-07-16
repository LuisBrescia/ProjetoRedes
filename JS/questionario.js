// * Este será o código que carregará as perguntas do questionário

import $ from 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import * as bootstrap from 'bootstrap';

console.log('questionario.js')

// Vou pegar a unidade que está no parametro da URL
var url_string = window.location.href;
var url = new URL(url_string);
var numero_questionario = url.searchParams.get("unidade") || 1;
var numero_questao = localStorage.getItem('numero_questao') || 1;

$(document).ready(function () {
    $('#questao_numero').text(numero_questao);
    $('#questao_enunciado').load(`../dados_questionario/questionario${numero_questionario}.html [data-value='${numero_questao}']`);
    $('#seletorQuestoes button').removeClass('active');
    $(`#seletorQuestoes [data-value='${numero_questao}']`).addClass('active');

    $('#enviaQuestionario').click(function () {
        $('.toast-body').text('API KEY Inválida');
        toastBootstrap.show()
    });

    $('#seletorQuestoes button').click(function () {
        console.log($(this).data('value'))
        $('#questao_numero').text($(this).data('value'));
        $('#questao_enunciado').load(`../dados_questionario/questionario${numero_questionario}.html [data-value="${$(this).data('value')}"]`);
        $('#seletorQuestoes button').removeClass('active');
        $(this).addClass('active');
        localStorage.setItem('numero_questao', $(this).data('value'));
    });
})

// * Carrega tópicos, cards, e conteúdo de uma unidade
function carregaQuestoes(numero_questionario) {
    // return new Promise(function (resolve, reject) {
    //     $('#questionario_perguntas').load(`../dados_questionario/questionario ${numero_questionario}.html #questionario${numero_questionario}_topicos`, function () {
    //         resolve();
    //     });
    // });
    $('#questionario_perguntas').load(`../dados_questionario/questionario${numero_questionario}.html #questionario_perguntas`);
}