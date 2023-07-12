import $ from 'jquery/dist/jquery.min.js'
// import '@popperjs/core/dist/umd/popper.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { Toast } from 'bootstrap';
import * as bootstrap from 'bootstrap';

$(document).ready(function () {
    var unidade = localStorage.getItem('unidade') || 1;
    var tema = localStorage.getItem('tema') || 'light';

    $('[name="unidade"]').val(unidade)
    if (tema == 'dark') {
        $('#mudaTema').toggleClass('bi-moon-stars-fill bi-circle-half');
        alteraTema(tema);
    } else {
        $('#mudaTema').toggleClass('bi-sun-fill bi-circle-half');
    }
    

    // * Função que define a unidade a ser estudada
    $('[name="unidade"]').change(function () {
        unidade = $(this).val()
        console.log(unidade)
        localStorage.setItem('unidade', unidade);
        carregaConteudo(unidade);
    })

    carregaConteudo(unidade);
    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    $('#enviaQuestionario').click(function () {
        $('.toast-body').text('Questionário indisponível no momento...');
        toastBootstrap.show()
    })

    $('#mudaTema').click(function () {
        $(this).toggleClass('bi-sun-fill bi-moon-stars-fill');
        tema = (tema == 'dark') ? 'light' : 'dark';
        alteraTema(tema);
        localStorage.setItem('tema', tema);
        console.log(tema)
    })
})

function alteraTema(tema) {
    $('body').toggleClass('bg-dark bg-white text-white text-dark');
    $('nav').attr('data-bs-theme', tema);
    $('nav').toggleClass('bg-white bg-dark');
    $('aside').attr('data-bs-theme', tema);
    $('.card').toggleClass('bg-dark bg-white text-white text-dark');
    $('nav button').toggleClass('btn-1 btn-2');
    $('.modal-footer button').toggleClass('btn-1 btn-2');
    $('.modal-header button').toggleClass('btn-close-white');
    $('.modal-content').toggleClass('bg-dark bg-white text-white text-dark');
    $('.modal-content').attr('data-bs-theme', tema);
    $('#liveToast').toggleClass('bg-dark bg-white text-white text-dark');
}

function carregaConteudo(unidade) {
    $('#conteudo').load('/unidade' + unidade + '.html #unidade' + unidade + '_conteudo');
    $('#topico').load('/unidade' + unidade + '.html #unidade' + unidade + '_topicos');
    // $('#interativo').load('/unidade'+ unidade +'.html #unidade'+ unidade +'_interativo');
}