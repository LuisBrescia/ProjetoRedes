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
        console.log(unidade)
        localStorage.setItem('unidade', unidade);

        carregaConteudo(unidade).then(function () {

            if (tema == 'dark') {
                console.log('tema dark')
                $('.card').toggleClass('bg-dark bg-white text-white text-dark');
                $('.card').attr('data-bs-theme', 'dark');
            }

            $('.card').removeClass('d-none');

            $('.card').click(function () {
                console.log("algo");
                console.log("titulo", $(this).find('.card-title').text());
                $('.modal-title').text($(this).find('.card-title').text() + ' Unidade ' + unidade);
                $('.modal-body h1').text('Deseja iniciar o ' + $(this).find('.card-title').text() + '?');
                $('.modal-body label:nth-child(1)').text('Tempo estimado: ' + Math.floor(Math.random() * 60) + ' minutos');
                $('.modal-body label:nth-child(2)').text($(this).find('.card-text').text());
                $('.modal-footer button').text('Iniciar ' + $(this).find('.card-title').text());
            });
        });
    })

    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    $('#enviaQuestionario').click(function () {
        $('.toast-body').text('Indisponível no momento...');
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

        if (tema == 'dark') {
            console.log('tema dark')
            $('.card').toggleClass('bg-dark bg-white text-white text-dark');
            $('.card').attr('data-bs-theme', 'dark');
        }

        $('.card').removeClass('d-none');
    
        $('.card').click(function () {
            console.log("algo");
            console.log("titulo", $(this).find('.card-title').text());
            $('.modal-title').text($(this).find('.card-title').text() + ' Unidade ' + unidade);
            $('.modal-body h1').text('Deseja iniciar o ' + $(this).find('.card-title').text() + '?');
            $('.modal-body label:nth-child(1)').text('Tempo estimado: ' + Math.floor(Math.random() * 60) + ' minutos');
            $('.modal-body label:nth-child(2)').text($(this).find('.card-text').text());
            $('.modal-footer button').text('Iniciar ' + $(this).find('.card-title').text());
        });
    });
})

function alteraTema(tema) {
    $('nav, aside, .modal-content, #liveToast, .toast-header, .card').attr('data-bs-theme', tema);
    $('nav button, .modal-footer button').toggleClass('btn-1 btn-2');
    $('nav').toggleClass('bg-white bg-dark');
    $('.toast-header').toggleClass('text-black bg-light bg-escuro text-white');
    $('body, .card, .modal-content, #liveToast').toggleClass('bg-dark bg-white text-white text-dark');
    $('.modal-header button, .toast-header button').toggleClass('btn-close-white');
}

function carregaConteudo(unidade) {
    return new Promise(function (resolve, reject) {
        $('#topico').load('/unidade' + unidade + '.html #unidade' + unidade + '_topicos', function () {
            $('#interativo').load('/unidade' + unidade + '.html #unidade' + unidade + '_interativo', function () {
                $('#conteudo').load('/unidade' + unidade + '.html #unidade' + unidade + '_conteudo', function () {
                    resolve(); // Resolve a promessa após carregar todos os elementos
                });
            });
        });
    });
}