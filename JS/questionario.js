// * Este será o código que carregará as perguntas do questionário

import $ from 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// import * as bootstrap from 'bootstrap';
import axios from 'axios';

var url_string = window.location.href;
var url = new URL(url_string);
var numero_questionario = url.searchParams.get("unidade") || 1;
var numero_questao = localStorage.getItem('numero_questao') || 1;

var questionario_respostas = []; // * Armazena as respostas do questionário

const apiKey = 'SUA_CHAVE_DE_API'; // * Chave de API da OpenAi
const prompt = 'Olá GPT'; // * Aqui será onde conversaremos com o gpt-3

$(document).ready(function () {
    $('#questao_numero').text(numero_questao);
    $('#questao_enunciado').load(`../dados_questionario/questionario${numero_questionario}.html [data-value='${numero_questao}']`);
    $('#seletorQuestoes button').removeClass('active');
    $(`#seletorQuestoes [data-value='${numero_questao}']`).addClass('active');

    $('#seletorQuestoes button').click(function () {

        if (numero_questao == $(this).data('value')) { // * Se o botão clicado for o mesmo que já está ativo, retorna a função
            console.log('mesma questão');
            return;
        }

        statusQuestao(numero_questao);

        // * Carrega número, enunciado, e resposta da questão, caso já tenha sido respondida
        $('#questao_numero').text($(this).data('value'));
        $('#questao_enunciado').load(`../dados_questionario/questionario${numero_questionario}.html [data-value="${$(this).data('value')}"]`);
        $('#questao_resposta').val(questionario_respostas[$('#questao_numero').text() - 1]);

        $('#seletorQuestoes button').removeClass('active');
        $(this).addClass('active');

        localStorage.setItem('numero_questao', $(this).data('value'));

        numero_questao = $(this).data('value');
    });

    // Caso o conteúdo da text area seja alterado 
    $('#questao_resposta').change(function () {

        console.log('resposta alterada');

        statusQuestao(numero_questao);

        // Se existir 10 valores diferentes de '', remover classe disabled do botão de envio
        if (questionario_respostas.filter(function (el) { return el.trim() != ''; }).length == 9) {
            $('#enviaQuestionario').removeClass('disabled');
            $('#enviaQuestionario').addClass('btn-default');
        } else {
            $('#enviaQuestionario').addClass('disabled');
            $('#enviaQuestionario').removeClass('btn-default');
        }

        // Caso a questão já tenha sido respondida, aplicarei uma propriedade css ao botão em que o valor é o mesmo de numero_questao

        questionario_respostas[$('#questao_numero').text() - 1] = $('#questao_resposta').val();
        localStorage.setItem('questionario_respostas', questionario_respostas);
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

// * Carrega tópicos, cards, e conteúdo de uma unidade
function carregaQuestoes(numero_questionario) {
    // return new Promise(function (resolve, reject) {
    //     $('#questionario_perguntas').load(`../dados_questionario/questionario ${numero_questionario}.html #questionario${numero_questionario}_topicos`, function () {
    //         resolve();
    //     });
    // });
    $('#questionario_perguntas').load(`../dados_questionario/questionario${numero_questionario}.html #questionario_perguntas`);
}
// * Função que define a cor do botão de acordo com o status da resposta
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
        $(`#seletorQuestoes [data-value='${numero_questao}']`).css({
            'filter': 'hue-rotate(145deg)',
            'color': '#fff',
            'background': 'linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%)'
        });
    }
}
