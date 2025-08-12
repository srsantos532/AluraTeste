let listaDeAmigos = [];
const input = document.getElementById('amigo');
const ulAmigos = document.getElementById('listaAmigos');
const ulResultado = document.getElementById('resultado');
const mensagem = document.getElementById('mensagem');

//Impede a digitação de números
input.addEventListener('keydown', function (event) {
    if (event.key >= '0' && event.key <= '9') {
        event.preventDefault();
        exibirMensagem('O campo deve conter apenas letras.', 'erro');
    }
});

//Impede colar números
input.addEventListener('input', function () {
    const valorLimpo = this.value.replace(/[0-9]/g, '');
    if (this.value !== valorLimpo) {
        exibirMensagem('Não é permitido colar números.', 'erro');
        this.value = valorLimpo;
    }
});

//Reinicia o jogo ao focar o input depois de um sorteio
input.addEventListener('focus', function () {
    if (ulResultado.children.length > 0) {
        reiniciarJogo();
        exibirMensagem('Novo jogo iniciado. Digite os nomes novamente.', 'sucesso');
    }
});

//Aqui manipulei a mensagem pra aparecer erro ou sucesso na cor que eu quero na tela.
function exibirMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
}

function adicionarAmigo() {
    const nome = input.value.trim();

    if (nome === '') {
        exibirMensagem('Por favor, digite o nome do amigo.', 'erro');
        return;
    }

    if (listaDeAmigos.includes(nome)) {
        exibirMensagem('Este nome já foi adicionado!', 'erro');
        input.value = '';
        return;
    }

    //Aqui adiciono o amigo na lista.
    listaDeAmigos.push(nome);
    input.value = '';
    input.focus();
    mostrarListaTela();
    //exibirMensagem(Amigo ${nome} foi adicionado com sucesso!, 'sucesso');
}

//Aqui eu limpei a lista e depois enumerei a lista de amigos percorrendo o vetor.
function mostrarListaTela() {
    ulAmigos.innerHTML = '';

    listaDeAmigos.forEach((nome, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${nome}`;
        ulAmigos.appendChild(li);
    });
}

//Aqui embaralhei o vetor para o sorteio usando o algoritmo Fisher-Yates para embaralhar arrays.
function embaralhar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function sortearAmigo() {
    ulResultado.innerHTML = '';

    //Aqui testo para ver se a lista tem ao menos 2 nomes para poder sortear.
    if (listaDeAmigos.length < 2) {
        exibirMensagem('Adicione pelo menos dois amigos para sortear.', 'erro');
        return;
    }

    let tentativas = 0;
    const maxTentativas = 5;
    let sorteioValido = false;
    let sorteados = [];

    while (tentativas < maxTentativas && !sorteioValido) {
        sorteados = embaralhar(listaDeAmigos);
        sorteioValido = listaDeAmigos.every((nome, i) => nome !== sorteados[i]);
        tentativas++;
    }

    if (!sorteioValido) {
        exibirMensagem('Não foi possível sortear sem que alguém tirasse a si mesmo. Tente novamente.', 'erro');
        return;
    }

    for (let i = 0; i < listaDeAmigos.length; i++) {
        const li = document.createElement('li');
        li.textContent = `${listaDeAmigos[i]} → ${sorteados[i]}`;
        ulResultado.appendChild(li);
    }

    exibirMensagem('Sorteio concluído! Clique no campo de nome para reiniciar.', 'sucesso');
}

function reiniciarJogo() {
    listaDeAmigos = [];
    ulAmigos.innerHTML = '';
    ulResultado.innerHTML = '';
    input.value = '';
}