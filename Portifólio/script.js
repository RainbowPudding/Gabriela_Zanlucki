let maiorZ = 10;   // controla a ordem do empilhamento
    if (maiorZ >= 99990) {
    maiorZ = 10000;
    }
let janelasAbertas = new Set();  // armazena as janelas abertas

function abrirJanela(nome) {
    const janela = document.getElementById(`janela${nome.charAt(0).toUpperCase() + nome.slice(1)}`); // pega o nome da janela e coloca a primeira letra em maiúsculo
    
    if (janela) {

        if (janelasAbertas.has(nome)) {
            focarJanela(nome);      
            // para ficar com um overlay transparente no icone, imitando quando um aplicativo esta aberto no windows
            return;
        }
        
        janela.style.display = 'block';
        janela.style.zIndex = ++maiorZ;
        

        janelasAbertas.add(nome);
        
        // aqui para calcular a posição das janelas e abrir elas uma ao lado da outra
        const larguraJanela = 620;
        const alturaJanela = 520;  
        const margemEsquerda = 100;
        const margemTopo = 80;
        const janelasPorLinha = Math.floor((window.innerWidth - margemEsquerda) / larguraJanela);
        

        const indice = janelasAbertas.size - 1; 
        const coluna = indice % janelasPorLinha;
        const linha = Math.floor(indice / janelasPorLinha);
        
        const posicaoX = margemEsquerda + (coluna * larguraJanela);
        const posicaoY = margemTopo + (linha * alturaJanela);
        
        janela.style.left = posicaoX + 'px';
        janela.style.top = posicaoY + 'px';
        

        atualizarBarraTarefas(); // chama a função quando a janela abre, ela armazena na barra de tarefas
        tornarArrastavel(janela);
        tornarRedimensionavel(janela);
        focarJanela(nome);
    }
}

// botõeszinhos da barra de título da janela

function fecharJanela(nome) {
    const janela = document.getElementById(`janela${nome.charAt(0).toUpperCase() + nome.slice(1)}`);
    if (janela) {
        janela.style.display = 'none';
        janelasAbertas.delete(nome);
        atualizarBarraTarefas();
    }
}

function aumentarJanela(nome) {
    const janela = document.getElementById(`janela${nome.charAt(0).toUpperCase() + nome.slice(1)}`);
    if (janela) {
        janela.classList.toggle('maximizado');
    }
}

function minimizarJanela(nome) {
    const janela = document.getElementById(`janela${nome.charAt(0).toUpperCase() + nome.slice(1)}`);
    if (janela) {
        janela.style.display = 'none';
        janelasAbertas.add(nome);
        atualizarBarraTarefas();
    }
}

function restaurarJanela(nome) {
    const janela = document.getElementById(`janela${nome.charAt(0).toUpperCase() + nome.slice(1)}`);
    if (janela) {
        janela.style.display = 'block';
        janela.classList.remove('maximizado');

        janela.style = '';


    }
}



// para mudar as janelas que estão abertas

function atualizarBarraTarefas() {
    const botoesBarra = document.getElementById('botoesBarra');
    if (!botoesBarra) return;

    botoesBarra.innerHTML = '';

    janelasAbertas.forEach(nomeJanela => {
        const janela = document.getElementById(`janela${nomeJanela.charAt(0).toUpperCase() + nomeJanela.slice(1)}`);
        

        if (janela) {
            const botao = document.createElement('div');
            botao.className = 'botaoBarra';
            botao.setAttribute('data-nome', nomeJanela);

            const titulo = document.createElement('div');
            titulo.className = 'titulo-barra';
            titulo.innerHTML = obterTituloJanela(nomeJanela);
            titulo.onclick = () => {
                if (janela.style.display === 'none') {
                    janela.style.display = 'block';
                    restaurarJanela(nomeJanela);
                    focarJanela(nomeJanela);
                }
            };

            const botaoFechar = document.createElement('div');
            botaoFechar.className = 'fecharBarra';
            botaoFechar.textContent = '×';
            botaoFechar.onclick = (e) => {
                e.stopPropagation();
                fecharJanela(nomeJanela);
            };

            botao.appendChild(titulo);
            botao.appendChild(botaoFechar);
            botoesBarra.appendChild(botao);
        }
    });
}

function obterTituloJanela(nome) {
    const titulos = {
        'sobre': `<img src="imagens/sobremim.png" alt="Sobre Mim" width="20" height="20"> Sobre Mim`,
        'formacao': `<img src="imagens/formacao.png" alt="Formação" width="20" height="20"> Formação`,
        'portfolio': `<img src="imagens/portfolio.png" alt="Portfólio" width="20" height="20"> Portfólio`,
        'contato': `<img src="imagens/contato.png" alt="Contato" width="20" height="20"> Contato`
    };
    return titulos[nome] || nome;
}

// coloca a janela atual como ativa

function focarJanela(nome) {
    const janela = document.getElementById(`janela${nome.charAt(0).toUpperCase() + nome.slice(1)}`);
    if (janela) {
        janela.style.zIndex = ++maiorZ;

        if (janela.style.display !== 'block') {
            janela.style.display = 'block';
        }
        
        document.querySelectorAll('.botaoBarra').forEach(btn => {
            btn.classList.remove('ativo');
        });
        const botoes = document.querySelectorAll('.botaoBarra');
        botoes.forEach(botao => {
            if (botao.getAttribute('data-nome') === nome) {
                botao.classList.add('ativo');
            }
        });
    }
}

// ao clicar no menu iniciar, ele abre o pop up com os atalhos

function alternarMenuIniciar() {
    const menu = document.getElementById('menuIniciar');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// fecha o menu dos atalhos caso clique para fora

function fecharMenuIniciar() {
    const menu = document.getElementById('menuIniciar');
    menu.style.display = 'none';
}

// para arrastar a janela

function tornarArrastavel(elemento) {
    const barraTitulo = elemento.querySelector('.barraTitulo');
    let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

    barraTitulo.onmousedown = iniciarArrastar;

    function iniciarArrastar(e) {
        if (e.target.tagName === 'BUTTON') return;
        
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.onmouseup = pararArrastar;
        document.onmousemove = arrastar;
        elemento.style.zIndex = ++maiorZ;
    }

    function arrastar(e) {
        e.preventDefault();
        posX = mouseX - e.clientX;
        posY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        elemento.style.top = (elemento.offsetTop - posY) + "px";
        elemento.style.left = (elemento.offsetLeft - posX) + "px";
    }

    function pararArrastar() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// para redimensionar as janelas pelo canto inferior direito

function tornarRedimensionavel(elemento) {
    const redimensionar = elemento.querySelector('.redimensionar');
    let isResizing = false;

    redimensionar.onmousedown = iniciarRedimensionar;

    function iniciarRedimensionar(e) {
        e.preventDefault();
        isResizing = true;
        document.onmouseup = pararRedimensionar;
        document.onmousemove = redimensionarJanela;
        elemento.style.zIndex = ++maiorZ;
    }

    function redimensionarJanela(e) {
        if (!isResizing) return;
        e.preventDefault();
        
        const rect = elemento.getBoundingClientRect();
        const width = e.clientX - rect.left;
        const height = e.clientY - rect.top;
        
        if (width > 300) elemento.style.width = width + 'px';
        if (height > 200) elemento.style.height = height + 'px';
    }

    function pararRedimensionar() {
        isResizing = false;
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


// pega o horário atual e atualiza a cada seg
function atualizarRelogio() {
    const relogio = document.getElementById('relogio');
    if (!relogio) return;

    const agora = new Date();
    const horas = agora.getHours().toString().padStart(2, '0');
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    relogio.textContent = `${horas}:${minutos}`;
}

document.addEventListener('DOMContentLoaded', function () {
    atualizarRelogio();
    setInterval(atualizarRelogio, 1000);
});


document.addEventListener('click', function(event) {
    const menu = document.getElementById('menuIniciar');
    const botaoIniciar = document.querySelector('.botaoIniciar');
    
    if (!menu.contains(event.target) && !botaoIniciar.contains(event.target)) {
        menu.style.display = 'none';
    }
});


// aqui o evento para funcionar o formulário das mensagens, encaminhando pelo e-mail através da biblioteca do emailjs

document.addEventListener('DOMContentLoaded', () => {
  const formContato = document.getElementById('formContato');
  formContato.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-enviar');
    const txtOrig = btn.innerHTML;
    btn.innerHTML = 'Enviando...';
    btn.disabled = true;

    emailjs.sendForm('service_jtl5uzl','template_2ec60qt', this)
      .then(() => {
        btn.innerHTML = '✅ Mensagem Enviada!';
        this.reset();
        setTimeout(() => {
          alert('Obrigada pelo contato!');
          btn.innerHTML = txtOrig;
          btn.disabled = false;
        }, 2000);
      })
      .catch(() => {
        alert('❌ Erro ao enviar. Tente novamente mais tarde.');
        btn.innerHTML = txtOrig;
        btn.disabled = false;
      });
  });
});


// animação para o campo selecionado saltar um pouco

function adicionarAnimacoesCampos() {
    const campos = document.querySelectorAll('.form input, .form select, .form textarea');
    
    campos.forEach(campo => {

        campo.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });


        campo.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        

        campo.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.style.borderColor = '#417ab3';
            } else {
                this.style.borderColor = '#e74c3c';
            }
        });
    });
}


document.addEventListener('DOMContentLoaded', function() {
    adicionarAnimacoesCampos();
});