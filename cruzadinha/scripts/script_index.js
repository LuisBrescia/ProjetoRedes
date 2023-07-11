let palavraEl = document.querySelectorAll(".p1");
var novoCaractere;
var respostas = ['i','n','t','e', 'r', 'n', 'e', 't', 'a', 't', 'e', 'n', 'u', 'a', 'c', 'a', 'o'];

//funcao para verificar se há mais de duas letras em uma DIV
function verifica_campo(id){

	palavraEl[id].innerHTML += ' ';
	novoCaractere = palavraEl[id].innerHTML.split('');
	
	//se palavraEl tem mais de 2 letras, apagar a outra e colocar a nova
	palavraEl[id].innerHTML = novoCaractere.shift();
}

//compara as respostas com as digitadas tanto apos o primeiro quanto ultimo caracteres serem inseridos

function verifica_resposta(id){
	for(var i = 0; i < palavraEl.length; i++){
		if(palavraEl[i].innerHTML == respostas[i]){
			palavraEl[i].style.cssText = 'color: green;' + 'border: solid 1px green;';
		}
	}
}