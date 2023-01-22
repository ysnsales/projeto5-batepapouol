let nome;
let mensagens = [];
let chat = document.querySelector('.chat');

//Logar
function entrarNaSala() {
   nome = prompt('Digite o seu nome');
   if (nome!== ''){
   const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', {name: nome});

   promise.then(conectarAoChat);
   promise.catch(conectarAoChatErro);
   }

   else {
    alert('Nome inválido');
    entrarNaSala()
   }
}

function conectarAoChat () {
    buscarMensagens();
    //criar uma função que veririfica se o usuário continua logado
    setInterval(verificaStatus, 5000);
    //manter o chat atualizado
    setInterval(buscarMensagens, 3000);
  
}

function conectarAoChatErro (erro){
    //se o nome escolhido estiver sendo utilizado por algum usuário, o prompt ao entrar na sala deve ser exibido novamente
    if (erro.response.status === 400) {
        alert('Este nome já está sendo utilizado. Por favor, escolha outro.');
        entrarNaSala();}
}

function verificaStatus() {
    //verifica se o usuário continua logado na sala
    const statusUsuário = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name: nome});
    //avisar se o usuário for desconetado
    statusUsuário.catch(desconectado);
}

function desconectado(){
    alert('Você foi desconectado. Por favor, realize o login novamente');
}


//Mensagens chat
function buscarMensagens(){
    let promise2 = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise2.then(mostrarMensagens);
    //promise2.catch(mostrarMensagensErro);

}

function mostrarMensagens (resposta2){
    mensagens = resposta2.data;
    
    chat.innerText ="";
    
    for (let i = 0; i < mensagens.length; i++){
        let from = resposta2.data[i].from;
        let to = resposta2.data[i].to;
        let text = resposta2.data[i].text;
        let type = resposta2.data[i].type;
        let time = resposta2.data[i].time;

        if (type === "status"){
            chat.innerHTML += `
            <li class="${type}" data-test="message">
            <span class="hora">(${time})</span> &nbsp <strong> ${from} </strong> &nbsp ${text}
            </li>
            `;
        }else if (type === "message") {
            chat.innerHTML += ` <li class="${type}" data-test="message">
            <span class="hora">(${time})</span> &nbsp <strong> ${from} </strong> &nbsp para<strong> &nbsp ${to}: &nbsp </strong>${text}
        </li>
        `;
        }
    }
    //mostrar ultima mensagem
    const chatLast = document.querySelector('.chat li:last-child');
    chatLast.scrollIntoView();
        
}



entrarNaSala();