import $ from 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import * as bootstrap from 'bootstrap';

var unidade = localStorage.getItem('unidade') || 1;
var tema = localStorage.getItem('tema') || 'light';

$('[name="unidade"]').val(unidade)
if (tema == 'dark') {
    $('#mudaTema').toggleClass('bi-moon-stars-fill bi-circle-half');
    alteraTema(tema);
} else {
    $('#mudaTema').toggleClass('bi-sun-fill bi-circle-half');
}

$(document).ready(function () {
    // * Função que define a unidade a ser estudada
    $('[name="unidade"]').change(function () {
        unidade = $(this).val()
        console.log("Alterado para unidade",unidade)
        localStorage.setItem('unidade', unidade);

        carregaConteudo(unidade).then(function () {
            console.log('Conteúdo carregado com sucesso!');
        }).catch(function (error) {
            console.error('Erro ao carregar o conteúdo:', error);
        });
    })

    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)

    $('#enviaQuestionario').click(function () {
        $('.toast-body').text('Carregando...');
        toastBootstrap.show()
    })

    $('#mudaTema').click(function () {
        $(this).toggleClass('bi-sun-fill bi-moon-stars-fill');
        tema = (tema == 'dark') ? 'light' : 'dark';
        alteraTema(tema);
        localStorage.setItem('tema', tema);
        console.log(tema)
    })

    carregaConteudo(unidade).then(function () {
        console.log('Conteúdo carregado com sucesso!');
    }).catch(function (error) {
        console.error('Erro ao carregar o conteúdo:', error);
    });
})
// * Alterna entre dark e light mode
function alteraTema(tema) {
    $('nav, aside, .modal-content, #liveToast, .toast-header, .card, textarea, button').attr('data-bs-theme', tema);
    $('button').toggleClass('btn-1 btn-2');
    $('nav').toggleClass('bg-white bg-dark');
    $('body, .card, .modal-content').toggleClass('bg-dark bg-white text-white text-dark');
    $('#liveToast').toggleClass('bg-escuro bg-light text-white text-dark');
    $('.modal-header button, .toast-header button').toggleClass('btn-1 btn-2 btn-close-white');
    $('.modal-header, .modal-footer').toggleClass('border-secondary');
}
// * Carrega tópicos, cards, e conteúdo de uma unidade
function carregaConteudo(unidade) {
    return new Promise(function (resolve, reject) {
        $('#topico').load('/dados_unidade/unidade' + unidade + '.html #unidade_topicos', function () {
            $('#interativo').load('/dados_unidade/unidade' + unidade + '.html #unidade_interativo', function () {
                $('#conteudo').load('/dados_unidade/unidade' + unidade + '.html #unidade_conteudo', function () {

                    if (tema == 'dark') {
                        console.log('tema dark')
                        $('.card').toggleClass('bg-dark bg-white text-white text-dark');
                        $('.card').attr('data-bs-theme', 'dark');
                    }

                    $('.conteudo, .card').removeClass('d-none');
                    $('.card').click(function () {
                        console.log("titulo", $(this).find('.card-title').text());
                        $('.modal-title').text($(this).find('.card-title').text() + ' Unidade ' + unidade);
                        // $('.modal-body h1').text('Deseja iniciar ' + $(this).find('.card-title').text() + '?');
                        $('.modal-body label:nth-child(1)').text('Tempo estimado: ' + Math.floor(Math.random() * 60) + ' minutos');
                        $('.modal-body label:nth-child(2)').text($(this).find('.card-text').text());
                        $('.modal-footer button').text('Iniciar ' + $(this).find('.card-title').text());
                        $('.modal-footer button').attr('interativo', $(this).attr('id'));
                    });

                    $('#buttonModal').click(function () {
                        localStorage.setItem('numero_questao', 1);
                        localStorage.setItem('questionario_respostas', JSON.stringify(new Array(10).fill('')));
                        localStorage.setItem('questionario_corrigido', JSON.stringify(new Array(10).fill('')));
                        localStorage.setItem('vetor_questoes', JSON.stringify([]));
                        window.location.href = `HTML/${$(this).attr('interativo')}.html?unidade=${unidade}`;
                    });

                    resolve();
                });
            });
        });
    });
}