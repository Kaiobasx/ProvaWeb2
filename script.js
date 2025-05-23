function cadastrarUsuario() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    if (!nome || !email || !usuario || !senha || !confirmarSenha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        alert('Este email já está cadastrado.');
        return;
    }

    const novoUsuario = { nome, email, usuario, senha };
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Usuário cadastrado com sucesso!');
    window.location.href = 'clogin.html';
}



function verificacaoLogin() {
    const usuario = document.getElementById('Usuario').value.trim();
    const senha = document.getElementById('Senha').value.trim();
    const mensagemErro = document.getElementById('mensagemErro');

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioValido = usuarios.find(u => u.usuario === usuario && u.senha === senha);

    if (usuarioValido) {
        alert('Login realizado com sucesso!');
        mensagemErro.textContent = '';
        window.location.href = 'aindex.html';
    } else {
        alert('Usuário ou senha inválidos!');
        mensagemErro.textContent = 'Usuário ou senha incorretos!';
        mensagemErro.style.color = 'red';
    }
}

function buscarEndereco() {
    const cep = document.getElementById("cep").value;
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert("CEP não encontrado.");
            } else {

                document.getElementById("logradouro").value = data.logradouro;
                document.getElementById("bairro").value = data.bairro;
                document.getElementById("cidade").value = data.localidade;
                document.getElementById("estado").value = data.uf;
            }
        })
        .catch(error => console.error("Erro ao buscar dados do CEP:", error));
}
function cadastrarVoluntario() {
    const nome = document.getElementById('v-nome').value.trim();
    const email = document.getElementById('v-email').value.trim();
    const telefone = document.getElementById('v-telefone').value.trim();
    const interesse = document.getElementById('v-interesse').value.trim();
    const erroEl = document.getElementById('mensagemErroVol');

    if (!nome || !email) {
        erroEl.textContent = 'Preencha ao menos nome e email.';
        erroEl.style.color = 'red';
        return;
    }
    erroEl.textContent = '';

    const vols = JSON.parse(localStorage.getItem('voluntarios')) || [];
    if (vols.some(v => v.email === email)) {
        erroEl.textContent = 'Este email já está cadastrado como voluntário.';
        erroEl.style.color = 'red';
        return;
    }

    vols.push({ nome, email, telefone, interesse });
    localStorage.setItem('voluntarios', JSON.stringify(vols));

    alert('Obrigado por se voluntariar!');
    window.location.href = 'elista.html'; // redireciona para sua página renomeada
}

function renderListaVoluntarios() {
    const container = document.getElementById('lista-voluntarios');
    if (!container) return;            // sai se não encontrar o elemento

    const vols = JSON.parse(localStorage.getItem('voluntarios')) || [];
    if (vols.length === 0) {
        container.innerHTML = '<p>Nenhum voluntário cadastrado.</p>';
        return;
    }

    container.innerHTML = ''; // limpa o container
    vols.forEach(v => {
        const card = document.createElement('div');
        card.className = 'card';

        const imgSrc = `https://source.unsplash.com/160x160/?person`;
        card.innerHTML = `
        <img src="${imgSrc}" alt="Voluntário" style="border-radius:50%; margin-bottom:1rem;">
        <h3>${v.nome}</h3>
        <p><strong>Email:</strong> ${v.email}</p>
        ${v.telefone ? `<p><strong>Tel:</strong> ${v.telefone}</p>` : ''}
        ${v.interesse ? `<p><strong>Interesse:</strong> ${v.interesse}</p>` : ''}
      `;
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', renderListaVoluntarios);


(function monitorInatividade() {
    let timerId;

    function desconectarPorInatividade() {
        localStorage.removeItem('usuarios');
        localStorage.removeItem('voluntarios');
        window.location.href = 'clogin.html';
    }

    function resetarTimer() {
        clearTimeout(timerId);
        timerId = setTimeout(desconectarPorInatividade, 300000);
    }

    ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress', 'touchstart']
        .forEach(evt => window.addEventListener(evt, resetarTimer, true));

    resetarTimer();
})();
