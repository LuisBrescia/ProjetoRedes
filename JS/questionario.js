import $ from 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import OpenAI from "openai";

const apiKey = import.meta.env.VITE_API_KEY; // * API_KEY da OpenAI

var url_string = window.location.href;
var url = new URL(url_string);
var numero_questionario = url.searchParams.get('unidade') || 1;
var numero_questao = localStorage.getItem('numero_questao') || 1;

// : O problema é que está salvando como uma string gigante, e não como um array
var questionario_respostas = JSON.parse(localStorage.getItem('questionario_respostas')) || new Array(10).fill(''); // * Armazena as respostas do questionário
var vetor_questoes = JSON.parse(localStorage.getItem('vetor_questoes')) || []; // * Armazena as questões que serão carregadas
var perguntas_questionario = []; // * Armazena as perguntas do questionário
var vetor_prompts = []; // * Cada prompt é uma entrada para o chatbot

// * Cria um vetor com 10 valores aleatórios único de 1 até a quantidade de elementos no questionário
$.ajax({
    url: `../dados_questionario/questionario${numero_questionario}.html`,
    method: 'GET',
    dataType: 'html',
    success: function (data) {

        console.log(vetor_questoes);

        const $html = $(data); // * Transforma o HTML em um objeto jQuery

        $html.find('span').each(function () {
            perguntas_questionario.push($(this).text());
        });

        console.log(perguntas_questionario);

        if (vetor_questoes.length == 10) {
            console.log('Vetor de questões já carregado');
            return;
        }

        const total_perguntas = $html.find('span').length;

        if (total_perguntas < 10) {
            console.error('Não é possível gerar 10 valores únicos');
            return;
        }

        while (vetor_questoes.length < 10) {
            var r = Math.floor(Math.random() * total_perguntas) + 1;
            if (vetor_questoes.indexOf(r) === -1) vetor_questoes.push(r); // * Caso o valor não exista, ele é inserido no vetor
        }
        localStorage.setItem('vetor_questoes', JSON.stringify(vetor_questoes));
    },
    error: function (error) {
        console.error('Erro ao carregar o arquivo HTML:', error);
    }
});

$(document).ready(function () {

    $('#questao_numero').text(numero_questao);
    $('#questao_enunciado').load(`../dados_questionario/questionario${numero_questionario}.html [data-value='${numero_questao}']`);
    $('#seletorQuestoes button').removeClass('active');
    $(`#seletorQuestoes [data-value='${numero_questao}']`).addClass('active');
    $('#questao_resposta').val(questionario_respostas[$('#questao_numero').text() - 1]);
    // $('#API_KEY').val(apiKey);

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
        $('#enviaQuestionario').removeClass('disabled');
        $('#enviaQuestionario').addClass('btn-default');
    } else {
        $('#enviaQuestionario').addClass('disabled');
        $('#enviaQuestionario').removeClass('btn-default');
    }

    $('#seletorQuestoes button').click(function () {

        if (numero_questao == $(this).data('value')) { // * Se o botão clicado for o mesmo que já está ativo, retorna a função
            console.log('mesma questão');
            return;
        }

        console.log('vetor_questoes', vetor_questoes);
        // * Carrega número, enunciado, e resposta da questão
        $('#questao_numero').text($(this).data('value'));
        $('#questao_enunciado').load(`../dados_questionario/questionario${numero_questionario}.html [data-value="${vetor_questoes[$(this).data('value') - 1]}"]`);
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
            $('#enviaQuestionario').removeClass('disabled');
            $('#enviaQuestionario').addClass('btn-default');
        } else {
            $('#enviaQuestionario').addClass('disabled');
            $('#enviaQuestionario').removeClass('btn-default');
        }
        questionario_respostas[$('#questao_numero').text() - 1] = $('#questao_resposta').val();
        localStorage.setItem('questionario_respostas', JSON.stringify(questionario_respostas));
    });

    // $('#API_KEY').change(function () {
    //     console.log('API KEY alterada');
    //     localStorage.setItem('API_KEY', $(this).val());
    // });

    // * Botão de enviar o questionário
    $('#enviaQuestionario').click(async function () {

        for (let i = 0; i < questionario_respostas.length; i++) {
            vetor_prompts[i] =
                `PERGUNTA:\n\n` +
                `${perguntas_questionario[vetor_questoes[i] - 1]}\n\n` +
                `RESPOSTA:\n\n${questionario_respostas[i]}\n\n` +
                `Avalie com uma nota de 0 a 10 e corrija caso haja erros\n\n`;
            console.log(vetor_prompts[i]);
        }

        try {
            const openai = new OpenAI({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true
            });

            // const chatResponses = await Promise.all(
            //     vetor_prompts.map(async (prompt) => {
            //         const chatCompletion = await openai.chat.completions.create({
            //             model: "gpt-3.5-turbo",
            //             messages: [{ "role": "user", "content": prompt }],
            //         });
            //         return chatCompletion.choices[0].message;
            //     })
            // );
            // console.log(chatResponses);

            const chatCompletion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ "role": "user", "content": "Olá chat" }],
            });
            console.log(chatCompletion.choices[0].message);

        } catch (error) {
            console.error("Erro ao criar chat completion:", error);
        }

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