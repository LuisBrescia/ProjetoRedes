let editavel = false;
let verthoriz = false;
var qtdePalavras = 0;
var qtdeConteudos = 0;
var novoCaractere;
var respostasString = [];
var conteudosString = [];
var palavraEl;
const recuarEl = document.getElementById('recuar');
const avancarEl =  document.getElementById('avancar');
const numeditavelEl = document.getElementById('numeditavel');
const bodyEl = document.querySelector("body");
const PALAVRASEl = document.getElementById('PALAVRAS');
const CONTEUDOSEl = document.getElementById('CONTEUDOS');
const interruptorEl = document.getElementById('interruptor')
const inputpEl = document.getElementById('palavra');
const inputcEl = document.getElementById('conteudo');

//funcao para verificar se há mais de duas letras em uma DIV//
function verifica_campo(letra, id){
let palavraEl = document.querySelectorAll(classe_atual(id));

	/* se palavraEl tem mais de 2 letras, apagar a outra e colocar a nova; esse if é pra verificar se o campo não ta
	undefined, se for true tem letra já*/
	if(palavraEl[letra].innerHTML){

		//adicionando a palavra a um vetor de caracteres
		novoCaractere = palavraEl[letra].innerHTML.split('');
		//removendo o caractere antigo e colocando o novo digitado
		palavraEl[letra].innerHTML = novoCaractere.shift();
	}
}

//funcao para comparar as respostas com as digitadas tanto apos o primeiro quanto ultimo caracteres serem inseridos//
function verifica_resposta(id){
var respostas = respostasString[id - 1].split('');
let palavraEl = document.querySelectorAll(classe_atual(id));
	
		for(var i = 0; i < palavraEl.length; i++){
		if(palavraEl[i].innerHTML == respostas[i]){
			palavraEl[i].style.cssText += 'color: green;'+'border-radius:3px;'+'border: solid 1px green;' + 'background: #C9FFC7;';
		}
		else{
			palavraEl[i].style.cssText += 'color: red;'+'border-radius:3px;'+'color: red;' + 'border: solid 1.25px red;' + 'background: #FFCCCB;';	
		}
	}
}


//funcao para retornar a classe atual da palavra//
function classe_atual(id){
	var classe = '.p' + id.toString();
	return classe;
}

//funcao para posicionar uma palavra na tela//
function posTela(numeditavel) {
	var palavraEl = document.querySelectorAll(classe_atual(numeditavel.innerHTML));

	if(interruptor(false)){
		for(var i = 0; i < palavraEl.length; i++){
			if(verthoriz){
			palavraEl[i].style.left = (window.event.clientX)+ 'px';
			palavraEl[i].style.top = (window.event.clientY + i * 22) + 'px';
			}
			else{
			palavraEl[i].style.left = (window.event.clientX + i * 29)+ 'px';
			palavraEl[i].style.top = (window.event.clientY) + 'px';	
			}
		}
	}
}

//funcao que funciona como interruptor para o botao editavel//
function interruptor(botaoChamando){

	if(botaoChamando){
		editavel = !editavel;
		interruptorEl.innerHTML = 'Editavel: ' + editavel;
	} 
	return editavel;
}

//funcao que adiciona +1 da palavra a ser editada//
function avancar(numeditavel){
	numeditavel = parseInt(numeditavel.innerHTML);

	if(numeditavel >= respostasString.length){
		numeditavel = 1;
	}
	else{
		numeditavel++;
	}
	numeditavelEl.innerHTML = numeditavel;
}

//funcao que subtrai -1 da palavra a ser editada//
function recuar(numeditavel){
	numeditavel = parseInt(numeditavel.innerHTML);

	if(numeditavel <= 1){
		numeditavel = respostasString.length;
	}
	else{
		numeditavel--;
	}
	numeditavelEl.innerHTML = numeditavel;
}

//funcao que define se a palavra a ser editada ficara na horizontal ou vertical//
function verticalhorizontal(obj){

	verthoriz = !verthoriz;
	if(verthoriz){
		obj.innerHTML = 'Vertical';
	}
	else{
		obj.innerHTML = 'Horizontal';	
	}
	return verthoriz;
}

//funcao para adicionar palavra//
function adiciona_palavra(palavra){
	//atualiza_dados();
	palavraEl = palavra.value;
	palavra.value ='';

	respostasString[qtdePalavras] = palavraEl;
	qtdePalavras++;
	
	let pEl = document.createElement('p');	
	pEl.setAttribute('id', 'paragrafo'+qtdePalavras);
	let sectionEl = document.createElement("section");

	let num_id = pEl.id.split('');
	num_id = parseInt(num_id[9]);

	sectionEl.setAttribute('id', 'PALAVRA'+qtdePalavras);
		for(var i = 0; i < palavraEl.length; i++){
			if(i < palavraEl.length -1){
				sectionEl.innerHTML += '<div class="p'+ qtdePalavras +'" contenteditable="true" onkeyup="verifica_campo('+i+', '+qtdePalavras+')"></div>';
			}
			else{
				sectionEl.innerHTML += '<div class="p'+ qtdePalavras +'" contenteditable="true" onkeyup="verifica_campo('+i+', '+qtdePalavras+')" onfocusout="verifica_resposta('+qtdePalavras+')"></div>';
			}
		}
		bodyEl.appendChild(sectionEl);
		PALAVRASEl.appendChild(pEl);
		pEl.innerHTML = qtdePalavras + ' - ' + palavraEl + '<button onclick="remove_palavra('+num_id+')">-</button>';
}

//funcao para remover palavra//
function remove_palavra(id){

	let sectionEl = document.getElementById('PALAVRA'+id);
	let paragrafoEl = document.getElementById('paragrafo'+id);


	for(var i = id; i <= qtdePalavras; i++){
		let paragrafoAnt = document.getElementById('paragrafo'+ i);
		let sectionElAnt = document.getElementById('PALAVRA'+ i);
		paragrafoAnt.innerHTML = (i - 1) + ' - ' + respostasString[i - 1] + '<button onclick="remove_palavra('+ (i-1) +')">-</button>';		
		paragrafoAnt.id = 'paragrafo'+ (i - 1);
		sectionElAnt.id = 'PALAVRA'+ (i - 1);
	}

	sectionEl.remove();
	respostasString.splice((id - 1), 1);
	PALAVRASEl.removeChild(paragrafoEl);
	qtdePalavras--;
}



//funcao para adicionar conteudo da palavra//
function adiciona_conteudo(conteudo){
	//atualiza_dados();
	conteudoEl = conteudo.value;
	conteudo.value ='';

	conteudosString[qtdeConteudos] = conteudoEl;
	qtdeConteudos++;
	
	let pEl = document.createElement('p');	
	pEl.setAttribute('id', 'cont'+qtdeConteudos);
	let sectionEl = document.createElement("section");

	let num_id = pEl.id.split('');
	num_id = parseInt(num_id[4]);

	sectionEl.setAttribute('id', 'CONTEUDO'+qtdeConteudos);
	CONTEUDOSEl.appendChild(pEl);
	pEl.innerHTML = qtdeConteudos + ' - ' + conteudoEl + '<button onclick="remove_conteudo('+num_id+')">-</button>';
}

//funcao para remover conteudo//
function remove_conteudo(id){
	let conteudoEl = document.getElementById('cont'+id);
	
	for(var i = id; i <= qtdeConteudos; i++){
		let conteudoAnt = document.getElementById('cont'+ i);
		conteudoAnt.innerHTML = (i - 1) + ' - ' + conteudosString[i - 1] + '<button onclick="remove_conteudo('+ (i-1) +')">-</button>';		
		conteudoAnt.id = 'cont'+ (i - 1);
	}

	//sectionEl.remove();
	conteudosString.splice((id - 1), 1);
	CONTEUDOSEl.removeChild(conteudoEl);
	qtdeConteudos--;
}


//funcao para verificar se o enter foi pressionado e assim chamar determinada funcao//
inputpEl.addEventListener('keypress', function verifica_enter(botao) {
    if(botao.keyCode === 13){
        adiciona_palavra(inputpEl);
    }
})
inputcEl.addEventListener('keypress', function verifica_enter(botao) {
    if(botao.keyCode === 13){
        adiciona_conteudo(inputcEl);
    }
})
/*pra criar a pagina que o aluno vai ver, que não seja editavel, criar um modal fullscreen em que o <a href="embed">
aponte para o site com tudo 'hide' no css*/