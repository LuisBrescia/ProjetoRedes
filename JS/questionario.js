// * Este será o código que carregará as perguntas do questionário

import $ from 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import axios from 'axios'

var url_string = window.location.href;
var url = new URL(url_string);
var numero_questionario = url.searchParams.get('unidade') || 1;
var numero_questao = localStorage.getItem('numero_questao') || 1;

// : O problema é que está salvando como uma string gigante, e não como um array
var questionario_respostas = JSON.parse(localStorage.getItem('questionario_respostas')) || new Array(10).fill(''); // * Armazena as respostas do questionário

const apiKey = localStorage.getItem('API_KEY') || ''; // * API KEY da OpenAi
const prompt = 'Olá GPT'; // * Aqui será onde conversaremos com o gpt-3

$(document).ready(function () {

    $('#questao_numero').text(numero_questao);
    $('#questao_enunciado').load(`../dados_questionario/questionario${numero_questionario}.html [data-value='${numero_questao}']`);
    $('#seletorQuestoes button').removeClass('active');
    $(`#seletorQuestoes [data-value='${numero_questao}']`).addClass('active');
    $('#questao_resposta').val(questionario_respostas[$('#questao_numero').text() - 1]);
    $('#API_KEY').val(apiKey);

    // : Ao carregar a página criarei um looping no vetor de respostas, se a resposta em questão não estiver vazia, então a questão será marcada de verde

    for (let i = 0; i < questionario_respostas.length; i++) {
        if (questionario_respostas[i].trim() != '') {
            $(`#seletorQuestoes [data-value='${i + 1}']`).css({
                'filter': 'hue-rotate(270deg)',
                'color': '#fff',
                'background': 'linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%)'
            });
        }
    }

    if (questionario_respostas.filter(function (el) { return el.trim() != ''; }).length >= 9) {
        $('#enviaQuestionarioANTIGO').removeClass('disabled');
        $('#enviaQuestionarioANTIGO').addClass('btn-default');
    } else {
        $('#enviaQuestionarioANTIGO').addClass('disabled');
        $('#enviaQuestionarioANTIGO').removeClass('btn-default');
    }

    $('#seletorQuestoes button').click(function () {

        if (numero_questao == $(this).data('value')) { // * Se o botão clicado for o mesmo que já está ativo, retorna a função
            console.log('mesma questão');
            return;
        }

        // * Carrega número, enunciado, e resposta da questão
        $('#questao_numero').text($(this).data('value'));
        $('#questao_enunciado').load(`../dados_questionario/questionario${numero_questionario}.html [data-value="${$(this).data('value')}"]`);
        $('#questao_resposta').val(questionario_respostas[$('#questao_numero').text() - 1]);

        $('#seletorQuestoes button').removeClass('active');
        $(this).addClass('active');

        localStorage.setItem('numero_questao', $(this).data('value'));

        numero_questao = $(this).data('value');
    });

    $('#questao_resposta').change(function () {
        console.log('resposta alterada');
        statusQuestao(numero_questao);

        // * Caso todas as questões tenham sido respondidas, o botão de enviar será habilitado
        if (questionario_respostas.filter(function (el) { return el.trim() != ''; }).length >= 9) {
            $('#enviaQuestionarioANTIGO').removeClass('disabled');
            $('#enviaQuestionarioANTIGO').addClass('btn-default');
        } else {
            $('#enviaQuestionarioANTIGO').addClass('disabled');
            $('#enviaQuestionarioANTIGO').removeClass('btn-default');
        }
        questionario_respostas[$('#questao_numero').text() - 1] = $('#questao_resposta').val();
        localStorage.setItem('questionario_respostas', JSON.stringify(questionario_respostas));
    });

    $('#API_KEY').change(function () {
        console.log('API KEY alterada');
        localStorage.setItem('API_KEY', $(this).val());
    });

    $('#enviaQuestionario').click(function () {

        // : Como imagino que vai funcionar 

        // Mandarei cada pergunta e sua respectiva resposta para a API da OpenAi
        // A API avaliará a resposta e retornará uma nota de 0 a 10, e irar colocar elas em um vetor

        // * Chamando a API
        axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: prompt,
            max_tokens: 100,
            temperature: 0.7,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        }).then(response => {
            const completion = response.data.choices[0].text;
            console.log(completion);
        }).catch(error => {
            console.error('Erro na chamada da API:', error);
            $('.toast-body').text('API KEY Inválida');
            toastBootstrap.show()
        });
    });
})

// * Caso tenha um conteúdo naquela text area, a questão será marcada de verde
function statusQuestao(numero_questao) {
    if ($('#questao_resposta').val().trim() != '') {
        console.log('Questão ' + (numero_questao) + ' respondida');
        $(`#seletorQuestoes [data-value='${numero_questao}']`).css({
            'filter': 'hue-rotate(270deg)',
            'color': '#fff',
            'background': 'linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%)'
        });
    } else {
        console.log('Questão ' + (numero_questao) + ' sem resposta');
        $(`#seletorQuestoes [data-value='${numero_questao}']`).removeAttr('style');
    }
}
