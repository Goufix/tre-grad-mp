const ASSET_BASE_URL = new URL('.', document.currentScript.src).href.replace(/\/$/, '');

function appendStylesheet(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.append(link);
}

function appendScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.async = false;
  document.head.append(script);
}

function preserveDocumentTitle(text) {
  const titleElement = document.querySelector('title') || document.createElement('title');
  titleElement.textContent = text;
  document.head.append(titleElement);
}

function renderDocument() {
  document.documentElement.lang = 'pt-BR';
  preserveDocumentTitle("[TRE] Envio de MP's");

  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.href = 'https://2img.net/i.imgur.com/dkoznPx.png';
  document.head.append(favicon);

  appendStylesheet('https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css');
  appendStylesheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
  appendStylesheet('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  appendStylesheet(`${ASSET_BASE_URL}/styles.css`);

  document.body.innerHTML = `
    <div id="toast-post" class="toast-post" role="status" aria-live="polite">
      <p><em class="fa-solid fa-check-circle"></em> Enviado! Redirecionando</p>
    </div>
    <header><img src="https://2img.net/i.imgur.com/584xfvd.png" alt="Logo da Companhia dos Treinadores" /></header>
    <main>
      <section class="container" aria-labelledby="page-title">
        <h1 class="tittle" id="page-title">TRE - MP'S GRADUAÇÃO</h1>
        <div class="custom-dropdown">
          <button class="dropdown-toggle" type="button" aria-haspopup="listbox" aria-expanded="false">
            Selecione o material desejado <em class="fa-solid fa-chevron-down seta"></em>
          </button>
          <ul class="dropdown-menu" role="listbox">
            <li data-value="GRAD_BASICA" role="option"><img src="https://2img.net/i.imgur.com/dkoznPx.png" class="icon" alt="" />Graduação Básica</li>
            <li data-value="MAPA_SUBFORUM" role="option"><img src="https://2img.net/i.imgur.com/dkoznPx.png" class="icon" alt="" />Mapa do Subfórum</li>
            <li data-value="GRAD_INTER" role="option"><img src="https://2img.net/i.imgur.com/dkoznPx.png" class="icon" alt="" />Graduação Intermediária</li>
            <li data-value="GRAD_AVAN" role="option"><img src="https://2img.net/i.imgur.com/dkoznPx.png" class="icon" alt="" />Graduação Avançada</li>
          </ul>
          <input type="hidden" id="select_value" />
        </div>
      </section>

      <section class="card" id="envio_material">
        <form id="form_material" action="#" onsubmit="return fill_mp(event);">
          <div class="input-box">
            <label class="details_span" for="nick_membros_rl"><em class="fa-solid fa-users"></em> Nickname do(s) aluno(s)</label>
            <input id="nick_membros_rl" type="text" placeholder="Separe com '/' caso tenha mais de um" required />
          </div>
          <div class="button" id="enviar_rl_btn">
            <input type="submit" value="Enviar" />
            <div class="carregamento-post"></div>
          </div>
        </form>
      </section>
      <textarea id="fa-generated-message" aria-hidden="true"></textarea>
      <div id="toast" class="toast" role="alert"><span class="icon"><em class="fas fa-times"></em></span> Erro ao postar. Tente novamente.</div>
    </main>
    <footer id="creditos">
      <p><em class="fas fa-code"></em> Desenvolvido por <strong><a href="https://system.policercc.com.br/perfil/%2Cyouiz" target="_blank" rel="noopener noreferrer">,youiz</a></strong>, <strong><a href="https://system.policercc.com.br/perfil/Botpoised0n" target="_blank" rel="noopener noreferrer">Botpoised0n</a></strong> &amp; <strong><a href="https://system.policercc.com.br/perfil/Goufix" target="_blank" rel="noopener noreferrer">Goufix</a></strong></p>
      <p>© <span id="ano"></span> <strong>Companhia dos Treinadores</strong>. Todos os direitos reservados.</p>
    </footer>
  `;

  document.getElementById('ano').textContent = new Date().getFullYear();
  appendScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js');
  appendScript('https://forumeiros.github.io/assets/src/form-generator/form-replace.js');
  appendScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js');
}

renderDocument();



  document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".custom-dropdown");
    const toggle = document.querySelector(".dropdown-toggle");
    const menu = document.querySelector(".dropdown-menu");
    const inputHidden = document.querySelector("#select_value");

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      dropdown.classList.toggle("dropdown-open");
      toggle.setAttribute("aria-expanded", dropdown.classList.contains("dropdown-open"));
    });

    menu.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", function () {
        toggle.innerHTML = `${this.textContent} <i class="fa-solid fa-chevron-down seta"></i>`;
        inputHidden.value = this.getAttribute("data-value");
        dropdown.classList.remove("dropdown-open");
        toggle.setAttribute("aria-expanded", "false");
        document.getElementById("envio_material").style.display = "block";
      });
    });

    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("dropdown-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  function fill_mp(event) {
    event.preventDefault();
    const selectedOption = document.getElementById("select_value").value;
    const nicknames = document.getElementById("nick_membros_rl").value;

    if (!selectedOption) {
      alert("Selecione o material que deseja enviar!");
      return false;
    }

    if (!nicknames) {
      alert("Preencha o campo de nicknames!");
      return false;
    }

    const lista = nicknames.replaceAll(" ", "").replaceAll("/", " / ").split(" / ");
    const user = [];
    lista.forEach((nickname) => user.push(nickname));

    let title, message;

    switch (selectedOption) {
      case "GRAD_BASICA":
        title = "[TRE] Graduação Básica";
        message = `[table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; font-family: 'Poppins', sans-serif; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="4D0C0D"][tr style="border: none!important"][td style="border: none!important; padding: 6px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px" bgcolor="150102"][tr style="border: none!important"][td style="border: none!important"][img]https://i.imgur.com/dMstpiH.png[/img][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]GRADUAÇÃO BÁSICA[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: center; padding: 24px 32px"]
[center][size=14]Saudações, [b][color=#721112]{USERNAME}[/color][/b]![/size]
[table  style="width: 25%; border-radius: 10px; border: none!important; overflow: hidden; line-height: 1em; margin: 10px auto 22px auto;" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; overflow: hidden; padding: 1.5px"][/td][/tr][/table][/center]

[justify][size=14][color=#1a0000]Seja bem-vindo(a) à [b][color=#721112]Companhia dos Treinadores[/color][/b]! A companhia agradece a sua preferência. Para iniciar seu trabalho como treinador, é essencial que você leia todo o conteúdo desta apostila e, ao terminar, avise o graduador que está pronto para fazer o teste teórico. Não se esqueça de tirar suas dúvidas com ele também![/color][/size][/justify]
[/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]PREPARAÇÃO DO TREINAMENTO[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000]Como treinador de nível um, sua função é [b]aplicar os treinamentos básicos[/b], que se dividem em [b]Curso de Aprimoramento de Soldados (CAS)[/b] e [b]Curso de Formação de Sargentos (CFS)[/b], para [b]soldados [/b]e [b]sargentos[/b], respectivamente.

[b]→[/b] O CAS deve ser aplicado antes do soldado obter a Supervisão (SUP). Portanto, [b]antes de iniciar o curso, verifique no RCCSystem se o soldado é ativo[/b]. Os treinadores que descumprirem esta norma estarão sujeitos a punições variando de uma advertência verbal a uma advertência escrita seguida de 15 medalhas efetivas negativas.

[b]→[/b] Para aplicar um treinamento, chame o aluno gentilmente e leve-o ao local adequado. O [b]CAS individual[/b] deve ser feito no Centro de Instruções (tanto do batalhão quanto dos corredores); o [b]CFS[/b] ou o [b]CAS coletivo[/b] devem ser feitos numa das salas de treino da companhia.

[color=#4D0C0D][b]➥ Observação: O CFS e o CAS individual não poderão ser aplicados no cubículo do Batalhão Auxiliar. No entanto, o CAS coletivo, sim.[/b][/color]

[spoiler="COMO USAR O CORREDOR DA COMPANHIA"]
[table style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; font-family: 'Poppins', sans-serif; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="4D0C0D"][tr style="border-width: medium !important; border-style: none !important; border-color: currentcolor !important; border-image: initial !important;"][td style="border: none!important; padding: 6px"][table style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="150102"]
[tr style="border-width: medium !important; border-style: none !important; border-color: currentcolor !important; border-image: initial !important;"][td style="border: none!important"][img]https://2img.net/i.imgur.com/QsgA7TL.png[/img]

[table style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"]
[tr style="border-width: medium !important; border-style: none !important; border-color: currentcolor !important; border-image: initial !important;"][td style="border: none!important; padding: 15px 50px 15px 50px;"]MANUAL DE FUNCIONAMENTO DO CORREDOR DOS TREINADORES[/td][/tr][/table]

[table style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"]
[tr style="border-width: medium !important; border-style: none !important; border-color: currentcolor !important; border-image: initial !important;"][td style="border: none!important; padding: 10px"][table style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border-width: medium !important; border-style: none !important; border-color: currentcolor !important; border-image: initial !important;"][td style="border: none!important; text-align: justify"]
[center][b][color=#4D0C0D]CAPÍTULO I - DA ESTRUTURA E FUNCIONAMENTO DO CORREDOR DOS TREINADORES[/color][/b][/center]

[b][color=#4D0C0D]Art. 1° - [/color][/b] O Corredor dos Treinadores constitui-se como o setor central que reúne todas as salas operacionais vinculadas à Companhia dos Treinadores, destinadas à aplicação de cursos, treinamentos, reuniões administrativas e demais atividades internas da companhia.

[b][color=#4D0C0D]Parágrafo único - [/color][/b]Compõem o corredor as salas destinadas à aplicação do Curso de Formação de Sargentos, do Curso de Aprimoramento de Soldados, do Centro de Treinamento, dos Treinos Rápidos, da Central de Aplicações, da Sala de Reuniões e a sala reservada ao Conselho Penal dos Treinadores.

[b][color=#4D0C0D]Art. 2° - [/color][/b]As cinco primeiras salas localizadas à esquerda do corredor destinam-se, exclusivamente, às aplicações do Curso de Aprimoramento de Soldados e do Curso de Formação de Sargentos.

[b][color=#4D0C0D]§ 1° - [/color][/b]As salas descritas no caput identificam-se, respectivamente, pelos comandos "porta1", "porta2", "porta3", "porta4" e "porta5", obedecendo à ordem sequencial da esquerda para a direita.

[b][color=#4D0C0D]§ 2° -[/color][/b] Os comandos de abertura das respectivas salas serão informados automaticamente por meio dos tapetes vermelhos posicionados em frente às portas, os quais exibirão mensagens indicativas aos treinadores.

[b][color=#4D0C0D]§ 3° -[/color][/b] Conforme disposto no caput, as cinco primeiras salas localizadas à esquerda do corredor destinam-se exclusivamente às aplicações do Curso de Formação de Sargentos (CFS) e do Curso de Aprimoramento de Soldados (CAS). Por serem as salas mais utilizadas no início da trajetória dos treinadores na companhia, é importante compreender seu funcionamento. A seguir, apresentam-se algumas orientações para evitar dúvidas durante as aplicações.

[center] <img src="https://i.servimg.com/u/f15/20/65/30/78/643a6411.png" style="border-radius:15px;border:3px solid #6b0000;" alt="643a6411.png" /> [/center]

[b][color=#4D0C0D]Art. 3° -[/color][/b] É responsabilidade dos treinadores memorizar os comandos operacionais das salas de aplicação, a fim de garantir agilidade, organização e fluidez no funcionamento do Corredor dos Treinadores.

[b][color=#4D0C0D]Art. 4° - [/color][/b] As salas presentes no Corredor dos Treinadores deverão ser utilizadas exclusivamente para as finalidades às quais foram destinadas, sendo vedada sua ocupação indevida ou sua utilização para atividades alheias à Companhia dos Treinadores.

[b][color=#4D0C0D]§ 1° - [/color][/b] A Sala de Reuniões destina-se, exclusivamente, à realização de reuniões administrativas, orientações internas e alinhamentos da companhia.

[b][color=#4D0C0D]§ 2° - [/color][/b] A sala do Conselho Penal dos Treinadores possui acesso restrito aos membros autorizados a participar de julgamentos, análises disciplinares e demais procedimentos internos da companhia

[b][color=#4D0C0D]Art. 5° - [/color][/b] O Corredor dos Treinadores possui uma porta executiva destinada ao acesso e à saída dos alunos durante as aplicações realizadas pela Companhia dos Treinadores.

[b][color=#4D0C0D]Parágrafo único - [/color][/b] Ao lado da respectiva porta localiza-se o portão de permissão dos Treinadores, que, ao ser acionado pela permanência de um membro da companhia sobre ele, realiza automaticamente a abertura da porta executiva, permitindo o acesso dos alunos ao Corredor dos Treinadores, bem como seu retorno ao batalhão após o encerramento das aplicações.

[center][b][color=#4D0C0D]CAPÍTULO II - DOS RETORNOS AOS TREINAMENTOS[/color][/b][/center]

[b][color=#4D0C0D]Art. 1° - [/color][/b]Institui-se como mecanismo oficial de retorno rápido aos treinamentos da companhia dos Treinadores o quarto presente no grupo oficial [b][color=#4D0C0D]“[RCC] Treinadores”[/color][/b], destinado ao deslocamento imediato dos membros ao Corredor dos Treinadores.

[b][color=#4D0C0D]Parágrafo único - [/color][/b] O referido quarto possui sistema de teleporte automático diretamente para o Corredor dos Treinadores, a fim de garantir maior agilidade no retorno às atividades operacionais.
[center]
[color=#4D0C0D][b]DEMONSTRAÇÃO DO ACESSO AO RETORNO RÁPIDO[/b][/color][/center]

O procedimento ilustrado abaixo demonstra o método correto para acessar o quarto de retorno rápido por meio do grupo oficial [b][color=#4D0C0D]“[RCC] Treinadores”[/color][/b], basta apertar em [b][color=#4D0C0D]"Ir para o quarto do Grupo"[/color][/b] para se deslocar de imediato ao Corredor dos Treinadores em situações de desconexão, queda do hotel ou demais problemas técnicos durante aplicações.

[center] <img src="https://i.servimg.com/u/f15/20/65/30/78/screen12.png" style="border-radius:15px;border:3px solid #6b0000;" alt="screen12.png" /> [/center]

[b][color=#4D0C0D]Art. 2° - [/color][/b]O sistema de retorno rápido destina-se, prioritariamente, aos treinadores que enfrentarem problemas técnicos durante as aplicações, tais como queda de energia, desconexão do hotel, travamentos ou outras situações que ocasionem a saída involuntária do policial.

[b][color=#4D0C0D]Parágrafo único - [/color][/b]O treinador deverá utilizar o mecanismo de retorno com responsabilidade, priorizando o reingresso imediato à aplicação anteriormente assumida.[/td][/tr][/table][/td][/tr][/table][/td][/tr][/table]

[size=11][color=white]Design por [b].Brendon[/b] | Desenvolvido por [b]Runer[/b]
Todos os direitos reservados à [b]Companhia dos Treinadores[/b] <i class="fas fa-bolt"></i>[/color][/size][/td]
[/tr][/table]
[/spoiler][/color][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]CONDUÇÃO DO TREINAMENTO[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000][b]→[/b] Quando já estiver com o aluno no local adequado, [b]siga as instruções presentes no script da aula[/b], que pode ser encontrado no subfórum "[b][TRE] Treinadores de Nível 1[/b]". Copie linha por linha do manual e cole no Habbo para que o aluno leia o que você tem a falar. Busque manter um espaço de 6 segundos entre cada balão de fala para evitar que você seja mutado ou que o aluno não acompanhe.

[color=#4D0C0D][b]➥ Não é permitido pular qualquer informação do script, mesmo se o aluno alegar que já sabe.[/b][/color]

[b]→[/b] Caso necessite se ausentar após o início da aplicação de um treinamento, providencie outro aplicador apto para dar continuidade à aula, garantindo que não haja prejuízo ao andamento da instrução.

[b]→[/b] O CFS deverá ter, no mínimo, [b]7 minutos[/b] de aplicação; o CAS deverá ter, no mínimo, [b]4 minutos[/b].

[b]→[/b] O CFS será considerado válido mesmo que o aluno caia durante a aula, desde que tenha duração mínima de [b]4 minutos[/b]. Por sua vez, o CAS será considerado válido nessa situação, desde que tenha duração mínima de [b]2 minutos[/b].

[color=#4D0C0D][b]➥ Não é permitido que o mesmo treinador aplique consecutivamente um CAS/CFS para o policial reprovado anteriormente antes de 05 minutos.[/b][/color]

[spoiler="COMO ACESSAR OS SCRIPTS DOS TREINAMENTOS"][justify][b]I -[/b] Acesse a página inicial do fórum (policiarcc.com) ou [url=https://www.policiarcc.com/forum][b]clique aqui[/b][/url].
[b]II -[/b] Desça a página até encontrar o subfórum Treinadores da RCC e clique nele para entrar.
[b]III -[/b] Dentro do subfórum dos Treinadores, procure no início da página por [TRE] Treinadores de Nível 1 e clique para acessar.
[b]IV -[/b] Todo o conteúdo está no final da página, na seção "Tópicos". Cada tópico possui uma descrição do que se trata para melhor entendimento.[/justify][/spoiler][/color][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]POSTAGENS DE TREINAMENTOS[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000]Depois de aplicar o curso, é necessário registrá-lo. Siga os passos abaixo na ordem.

[color=#4D0C0D][b]1. Poste a aula no fórum:[/b][/color]
No final de [b]qualquer aula que ultrapasse o tempo mínimo[/b], preencha o formulário do tópico "[b][TRE.1] Central de Postagens[/b]", dentro do subfórum "[b][TRE] Treinadores de Nível 1[/b]". Use informações verídicas e confira se o seu nickname e o do aluno estão idênticos ao do Habbo. O prazo é de [b]20 minutos após a aplicação[/b], e o descumprimento sujeita você a punições.

[spoiler="COMO POSTAR OS TREINAMENTOS"][justify][center][url=https://www.youtube.com/watch?v=1GPImSYf2jQ][b]CLIQUE AQUI![/b][/url][/center]
[center][youtube]https://www.youtube.com/watch?v=1GPImSYf2jQ[/youtube][/center][/justify][/spoiler]

[color=#4D0C0D][b]2. Se o aluno foi aprovado, poste também no RCCSystem[/b][/color]
Acesse [color=#4D0C0D][b]RCC System ([url=https://system.policercc.com.br/home]system.policercc.com.br[/url]) » Barra central » Companhias » Treinadores[/b][/color].

[color=#4D0C0D][b]3. Cometeu um erro na postagem?[/b][/color]
Você tem até [b]48 horas para solicitar correção[/b]. Acesse "[b][TRE.1] Central de Postagens[/b]" e use o formulário de correção.

[spoiler="COMO RETIFICAR ERROS"][justify][center][url=https://www.youtube.com/watch?v=aQrSUQchNJg][b]CLIQUE AQUI![/b][/url][/center]
[center][youtube]https://www.youtube.com/watch?v=aQrSUQchNJg[/youtube][/center][/justify][/spoiler][/color][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]META SEMANAL[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000]Para manter a companhia ativa e cumprindo seu objetivo, todo treinador de nível 1 deve bater uma meta semanal.

[color=#4D0C0D][b]Como a meta é contada:[/b][/color]
A meta é atingir [b]100% de Treinamentos Básicos[/b] por semana. Quem quiser se destacar pode ultrapassar esse valor sempre que conseguir.

[b]→[/b] A cada soldado seu que receber o [b]CAS[/b], adiciona-se [b]50%[/b].
[b]→[/b] A cada sargento seu que receber o [b]CFS[/b], adiciona-se [b]50%[/b].

[color=#4D0C0D][b]➥ Atente-se ao limite de 3 alunos por aula, independentemente do tipo de treinamento.[/b][/color]

A contagem começa todo [b]domingo às 00h[/b] e termina no [b]sábado às 23h59[/b], no horário de Brasília.

[color=#4D0C0D][b]Resultado da semana:[/b][/color]
Dependendo da sua contribuição, você poderá ser bonificado ou punido.

[b]→[/b] Se você [b]atingir[/b] a meta, receberá [b]10 medalhas efetivas positivas[/b].
[b]→[/b] Se você [b]não atingir[/b] a meta, será punido com [b]10 medalhas efetivas negativas[/b].
[b]→[/b] Se ficar abaixo da meta por [b]duas semanas no mês ou duas semanas consecutivas[/b], será [b]expulso[/b] da companhia e punido com [b]100 medalhas efetivas negativas[/b].

[color=#4D0C0D][b]➥ Na sua primeira semana como membro, você não precisa atingir a meta. A partir da semana seguinte, passa a ser obrigatório.[/b][/color][/color][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]LICENÇA DE SERVIÇO[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000]A companhia dos Treinadores conta com policiais ativos que cumprem com suas metas mínimas e comparecem aos compromissos da companhia. Portanto, se você precisar [b]ausentar-se das suas atividades na companhia por mais que quatro (04) dias[/b], você poderá solicitar uma [b]licença[/b].

[b]→[/b] Para tirar uma licença, deverá pedir permissão a um [b]estagiário+ da companhia[/b]. Em seguida, poste nos requerimentos da companhia. É importante citar que a duração mínima da licença é de [b]07 (sete) dias e, a máxima, de 30 (trinta) dias[/b]. Dentro deste período, [b]você não precisa cumprir com sua meta semanal[/b].

[b]→[/b] Se precisar se ausentar por um período superior a [b]30 (trinta) dias[/b], procure por um membro da [b]liderança[/b] e peça permissão para tirar uma [b]reserva[/b], que estende esse período por mais [b]60 (sessenta) dias[/b].

[color=#4D0C0D][b]➥ Caso você fique offline no Habbo por 05 (cinco) dias, você será expulso da companhia e receberá 100 medalhas efetivas negativas.[/b][/color][/color][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]CONCLUSÃO[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000]Recomendamos que faça a leitura da [b]carta de orientação para o seu cargo[/b], de forma a ter um melhor entendimento sobre a companhia. Além disso, convidamos você a participar do nosso [b]grupo no WhatsApp[/b], onde poderá conversar com outros treinadores, descontrair, tirar dúvidas e saber de novidades.

[table style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="4D0C0D"][tr style="border: none!important"][td style="border: none!important; padding: 12px; text-align: center; width: 50%" bgcolor="721112"][url=https://chat.whatsapp.com/Hr6NuWwEX67CGfl7kMXTcs][img(40px,40px)]https://i.imgur.com/P1IOR4a.png[/img][/url]
[color=white][b]GRUPO DO WHATSAPP[/b][/color]
[size=11][color=white]Clique no ícone para entrar no grupo do WhatsApp[/color][/size][/td][td style="border: none!important; padding: 12px; text-align: center; width: 50%" bgcolor="4D0C0D"][url=https://www.policiarcc.com/t31456-tre-1-carta-de-orientacao][img(40px,40px)]https://i.servimg.com/u/f47/19/95/86/43/design13.png[/img][/url]
[color=white][b]CARTA DE ORIENTAÇÃO[/b][/color]
[size=11][color=white]Clique no ícone para acessar a carta de orientação do seu cargo[/color][/size][/td][/tr][/table][/color][/td][/tr][/table][/td][/tr][/table][/td][/tr][tr style="border: none!important"][td style="border: none!important; text-align: center; padding: 2px 20px 12px 20px;"][center][size=11][color=white]Design por [b]Brendon[/b] e reformulado por [b]SrHemoke[/b], com base no modelo de [b]Granno[/b] e [b]gzrufino.[/b]
Todos os direitos reservados à [b]Companhia dos Treinadores[/b] <i class="fas fa-bolt"></i>[/color][/size][/center][/td][/tr][/table][/td][/tr][/table]`;
        break;
      case "MAPA_SUBFORUM":
        title = "[TRE] Mapa do Subfórum";
        message = `[table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; font-family: 'Poppins', sans-serif; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="4D0C0D"][tr style="border: none!important"][td style="border: none!important; padding: 6px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px" bgcolor="150102"][tr style="border: none!important"][td style="border: none!important"][img]https://2img.net/i.imgur.com/QsgA7TL.png[/img][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]MAPA DE SUBFÓRUM[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: center; padding: 24px 32px"]
[center][size=14]Saudações, treinador [b][color=#721112]{USERNAME}[/color][/b]![/size]
[table  style="width: 25%; border-radius: 10px; border: none!important; overflow: hidden; line-height: 1em; margin: 10px auto 22px auto;" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; overflow: hidden; padding: 1.5px"][/td][/tr][/table][/center]

[justify][size=14][color=#1a0000]Seja bem-vindo ao subfórum da [b][color=#721112]Companhia dos Treinadores[/color][/b]! Preparamos este mapa para que você encontre rapidamente tudo o que precisa: basta escolher o tópico nos cartões abaixo e clicar para acessá-lo, [b]caso esteja adicionado[/b]. Se notar algum link desatualizado, [b][color=#721112]avise a liderança[/color][/b] para que possamos corrigir.[/color][/size][/justify]
[/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]SUBFÓRUM INICIAL[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 12px 14px"][url=https://www.policiarcc.com/t39250-tre-requerimentos-de-membros][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 12px; margin: 0 0 6px 0; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; border-left: 6px solid #721112!important; width: 7%; padding: 12px 4px 12px 14px; text-align: center; vertical-align: middle;"][color=#721112][size=22]<i class="fas fa-fw fa-file-signature"></i>[/size][/color][/td][td style="border: none!important; padding: 12px 18px 12px 8px; text-align: justify; vertical-align: middle;"][b][color=#721112]REQUERIMENTOS DE MEMBROS[/color][/b]
[color=#1a0000]Reúne todas as pendências administrativas dos membros e traz o formulário para postá-las e realizá-las.[/color][/td][td style="border: none!important; width: 8%; padding: 12px; text-align: center; vertical-align: middle;"][color=#721112][b][size=24]›[/size][/b][/color][/td][/tr][/table][/url][url=https://www.policiarcc.com/t39247-tre-ouvidoria][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 12px; margin: 0 0 6px 0; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; border-left: 6px solid #721112!important; width: 7%; padding: 12px 4px 12px 14px; text-align: center; vertical-align: middle;"][color=#721112][size=22]<i class="fas fa-fw fa-lightbulb"></i>[/size][/color][/td][td style="border: none!important; padding: 12px 18px 12px 8px; text-align: justify; vertical-align: middle;"][b][color=#721112]OUVIDORIA[/color][/b]
[color=#1a0000]Canal de inovação da companhia: envie projetos e sugestões para ajudar no desenvolvimento dela.[/color][/td][td style="border: none!important; width: 8%; padding: 12px; text-align: center; vertical-align: middle;"][color=#721112][b][size=24]›[/size][/b][/color][/td][/tr][/table][/url][url=https://www.policiarcc.com/t39252-tre-area-de-relacionamento][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 12px; margin: 0 0 6px 0; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; border-left: 6px solid #721112!important; width: 7%; padding: 12px 4px 12px 14px; text-align: center; vertical-align: middle;"][color=#721112][size=22]<i class="fas fa-fw fa-comments"></i>[/size][/color][/td][td style="border: none!important; padding: 12px 18px 12px 8px; text-align: justify; vertical-align: middle;"][b][color=#721112]ÁREA DE RELACIONAMENTO[/color][/b]
[color=#1a0000]Espaço de entretenimento e comunicação entre os membros. Vale conferir sempre, pois é onde saem vários anúncios.[/color][/td][td style="border: none!important; width: 8%; padding: 12px; text-align: center; vertical-align: middle;"][color=#721112][b][size=24]›[/size][/b][/color][/td][/tr][/table][/url][url=https://www.policiarcc.com/t39253-tre-diario-de-atividades][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 12px; margin: 0 0 6px 0; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; border-left: 6px solid #721112!important; width: 7%; padding: 12px 4px 12px 14px; text-align: center; vertical-align: middle;"][color=#721112][size=22]<i class="fas fa-fw fa-calendar-alt"></i>[/size][/color][/td][td style="border: none!important; padding: 12px 18px 12px 8px; text-align: justify; vertical-align: middle;"][b][color=#721112]DIÁRIO DE ATIVIDADES[/color][/b]
[color=#1a0000]Agenda com as reuniões e os eventos marcados pela liderança.[/color][/td][td style="border: none!important; width: 8%; padding: 12px; text-align: center; vertical-align: middle;"][color=#721112][b][size=24]›[/size][/b][/color][/td][/tr][/table][/url][url=https://www.policiarcc.com/f884-desempenhos][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 12px; margin: 0 0 6px 0; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; border-left: 6px solid #721112!important; width: 7%; padding: 12px 4px 12px 14px; text-align: center; vertical-align: middle;"][color=#721112][size=22]<i class="fas fa-fw fa-chart-line"></i>[/size][/color][/td][td style="border: none!important; padding: 12px 18px 12px 8px; text-align: justify; vertical-align: middle;"][b][color=#721112]CONSULTA DE DESEMPENHO[/color][/b]
[color=#1a0000]Links para as porcentagens semanais, quinzenais e mensais e para os rankings de cada cargo.[/color][/td][td style="border: none!important; width: 8%; padding: 12px; text-align: center; vertical-align: middle;"][color=#721112][b][size=24]›[/size][/b][/color][/td][/tr][/table][/url][url=https://www.policiarcc.com/t39246-tre-listagem-de-membros][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 12px; margin: 0 0 6px 0; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; border-left: 6px solid #721112!important; width: 7%; padding: 12px 4px 12px 14px; text-align: center; vertical-align: middle;"][color=#721112][size=22]<i class="fas fa-fw fa-users"></i>[/size][/color][/td][td style="border: none!important; padding: 12px 18px 12px 8px; text-align: justify; vertical-align: middle;"][b][color=#721112]LISTAGEM DE MEMBROS[/color][/b]
[color=#1a0000]Todos os militares da companhia, com datas de entrada e promoção e vínculos a grupos internos.[/color][/td][td style="border: none!important; width: 8%; padding: 12px; text-align: center; vertical-align: middle;"][color=#721112][b][size=24]›[/size][/b][/color][/td][/tr][/table][/url][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]DOCUMENTAÇÕES[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 12px 14px"][url=https://www.policiarcc.com/t39288-tre-correcoes-de-documentos-scripts][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 12px; margin: 0 0 6px 0; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; border-left: 6px solid #721112!important; width: 7%; padding: 12px 4px 12px 14px; text-align: center; vertical-align: middle;"][color=#721112][size=22]<i class="fas fa-fw fa-edit"></i>[/size][/color][/td][td style="border: none!important; padding: 12px 18px 12px 8px; text-align: justify; vertical-align: middle;"][b][color=#721112]CORREÇÕES DE DOCUMENTOS & SCRIPTS[/color][/b]
[color=#1a0000]Postagens de atualização e correção de documentos e scripts, para manter ortografia e estrutura em dia.[/color][/td][td style="border: none!important; width: 8%; padding: 12px; text-align: center; vertical-align: middle;"][color=#721112][b][size=24]›[/size][/b][/color][/td][/tr][/table][/url][url=https://www.policiarcc.com/t32604-tre-manual-de-instrucoes-rapidas][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 12px; margin: 0 0 6px 0; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; border-left: 6px solid #721112!important; width: 7%; padding: 12px 4px 12px 14px; text-align: center; vertical-align: middle;"][color=#721112][size=22]<i class="fas fa-fw fa-question-circle"></i>[/size][/color][/td][td style="border: none!important; padding: 12px 18px 12px 8px; text-align: justify; vertical-align: middle;"][b][color=#721112]MANUAL DE INSTRUÇÕES RÁPIDAS[/color][/b]
[color=#1a0000]Respostas para as dúvidas mais frequentes dos membros, com as informações mais importantes da companhia.[/color][/td][td style="border: none!important; width: 8%; padding: 12px; text-align: center; vertical-align: middle;"][color=#721112][b][size=24]›[/size][/b][/color][/td][/tr][/table][/url][url=https://www.policiarcc.com/t39248-tre-quadro-de-advertencias-bloqueados][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 12px; margin: 0 0 6px 0; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; border-left: 6px solid #721112!important; width: 7%; padding: 12px 4px 12px 14px; text-align: center; vertical-align: middle;"][color=#721112][size=22]<i class="fas fa-fw fa-user-slash"></i>[/size][/color][/td][td style="border: none!important; padding: 12px 18px 12px 8px; text-align: justify; vertical-align: middle;"][b][color=#721112]QUADRO DE ADVERTIDOS & BLOQUEADOS[/color][/b]
[color=#1a0000]Militares com advertência interna (início, fim e motivo) e policiais proibidos de ingressar na companhia.[/color][/td][td style="border: none!important; width: 8%; padding: 12px; text-align: center; vertical-align: middle;"][color=#721112][b][size=24]›[/size][/b][/color][/td][/tr][/table][/url][url=https://www.policiarcc.com/t39282-tre-codigo-penal-interno][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 12px; margin: 0 0 6px 0; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; border-left: 6px solid #721112!important; width: 7%; padding: 12px 4px 12px 14px; text-align: center; vertical-align: middle;"][color=#721112][size=22]<i class="fas fa-fw fa-gavel"></i>[/size][/color][/td][td style="border: none!important; padding: 12px 18px 12px 8px; text-align: justify; vertical-align: middle;"][b][color=#721112]CÓDIGO PENAL INTERNO[/color][/b]
[color=#1a0000]Rege as punições e descreve as infrações possíveis dentro da companhia. Leitura essencial, junto do regimento.[/color][/td][td style="border: none!important; width: 8%; padding: 12px; text-align: center; vertical-align: middle;"][color=#721112][b][size=24]›[/size][/b][/color][/td][/tr][/table][/url][url=https://www.policiarcc.com/t39256-tre-regimento-interno][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 12px; margin: 0 0 6px 0; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; border-left: 6px solid #721112!important; width: 7%; padding: 12px 4px 12px 14px; text-align: center; vertical-align: middle;"][color=#721112][size=22]<i class="fas fa-fw fa-book"></i>[/size][/color][/td][td style="border: none!important; padding: 12px 18px 12px 8px; text-align: justify; vertical-align: middle;"][b][color=#721112]REGIMENTO INTERNO[/color][/b]
[color=#1a0000]O principal documento, com as normativas gerais e as diretrizes do seu cargo.[/color][/td][td style="border: none!important; width: 8%; padding: 12px; text-align: center; vertical-align: middle;"][color=#721112][b][size=24]›[/size][/b][/color][/td][/tr][/table][/url][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]PROJETOS[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 12px 14px"][url=https://www.policiarcc.com/t39249-tre-inscricoes-departamentais][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 12px; margin: 0 0 6px 0; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; border-left: 6px solid #721112!important; width: 7%; padding: 12px 4px 12px 14px; text-align: center; vertical-align: middle;"][color=#721112][size=22]<i class="fas fa-fw fa-clipboard-list"></i>[/size][/color][/td][td style="border: none!important; padding: 12px 18px 12px 8px; text-align: justify; vertical-align: middle;"][b][color=#721112]INSCRIÇÕES DEPARTAMENTAIS[/color][/b]
[color=#1a0000]Formulários de inscrição para todos os subgrupos da companhia. Preencha caso tenha interesse.[/color][/td][td style="border: none!important; width: 8%; padding: 12px; text-align: center; vertical-align: middle;"][color=#721112][b][size=24]›[/size][/b][/color][/td][/tr][/table][/url][url=https://www.policiarcc.com/t39251-tre-transparencia-de-projetos][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 12px; margin: 0 0 6px 0; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; border-left: 6px solid #721112!important; width: 7%; padding: 12px 4px 12px 14px; text-align: center; vertical-align: middle;"][color=#721112][size=22]<i class="fas fa-fw fa-eye"></i>[/size][/color][/td][td style="border: none!important; padding: 12px 18px 12px 8px; text-align: justify; vertical-align: middle;"][b][color=#721112]TRANSPARÊNCIA DE PROJETOS[/color][/b]
[color=#1a0000]Propostas já aprovadas e ranking mensal de membros, que movimenta a competitividade e o fluxo de projetos.[/color][/td][td style="border: none!important; width: 8%; padding: 12px; text-align: center; vertical-align: middle;"][color=#721112][b][size=24]›[/size][/b][/color][/td][/tr][/table][/url][/td][/tr][/table][/td][/tr][/table]

[center][size=11][color=white]Design por [b]Brendon[/b] e reformulado por [b]SrHemoke[/b] - Todos os direitos reservados à [b]Companhia dos Treinadores[/b] <i class="fas fa-bolt"></i>[/color][/size][/center][/td][/tr][/table][/td][/tr][/table]`;
        break;
      case "GRAD_INTER":
        title = "[TRE] Graduação Intermediária";
        message = `[table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; font-family: 'Poppins', sans-serif; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="4D0C0D"][tr style="border: none!important"][td style="border: none!important; padding: 6px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px" bgcolor="150102"][tr style="border: none!important"][td style="border: none!important"][img]https://i.imgur.com/dMstpiH.png[/img][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]GRADUAÇÃO INTERMEDIÁRIA[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: center; padding: 24px 32px"]
[center][size=14]Saudações, [b][color=#721112]{USERNAME}[/color][/b]![/size]
[table  style="width: 25%; border-radius: 10px; border: none!important; overflow: hidden; line-height: 1em; margin: 10px auto 22px auto;" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; overflow: hidden; padding: 1.5px"][/td][/tr][/table][/center]

[justify][size=14][color=#1a0000]Congratulações pela sua promoção na companhia dos [b][color=#721112]Treinadores![/color][/b] A companhia agradece pelo seu esforço. Agora, em um novo cargo, você recebe [b]novos poderes e responsabilidades[/b] e essa apostila visa justamente te ensinar a atuar no seu novo posto hierárquico. Leia com [b]atenção![/b][/color][/size][/justify]
[/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]META SEMANAL[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000]Da mesma forma que acontecia quando era treinador de nível 1, a meta é o mínimo que deverá cumprir [b]semanalmente[/b]. Recomendamos que ultrapasse a meta sempre que possível, para se [b]destacar[/b] no cargo e conseguir uma possível [b]promoção[/b].

[b]→[/b] Os treinadores de nível dois devem cumprir uma [b]meta semanal de 100%[/b], que são distribuídos da seguinte maneira:
• Treinamentos de [b]tipo A[/b] (TF, TA, TOF, TAP, TCM e TS) adicionam [b]50%[/b] a sua meta;
• Treinamentos de [b]tipo B[/b] (TMO e TCG) adicionam [b]75%[/b] a sua meta;
• [b]Tutorias[/b] adicionam [b]50%[/b] a sua meta;
• [b]Envio de Mensagem Privada[/b] adicionam [b]50%[/b] a sua meta.

[b]→[/b] A contagem de aplicações inicia todo [b]domingo às 00h[/b] e encerra nos [b]sábados às 23h59[/b], seguindo o horário de Brasília.

[b]→[/b] Os treinadores de nível dois que [b]cumprirem[/b] com sua meta semanal receberão [b]10 medalhas positivas efetivas[/b]. No entanto, aqueles que [b]não cumprirem[/b], receberão [b]10 medalhas negativas efetivas e, em reincidência, serão rebaixados[/b].

[color=#4D0C0D][b]➥ Na sua primeira semana como treinador de nível 2, você não tem a obrigação de atingir a meta semanal. No entanto, a partir da semana seguinte, será obrigatório que você atinja.[/b][/color][/color][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]TREINAMENTOS RÁPIDOS[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000]Os treinamentos rápidos têm o objetivo de [b]exercitar a agilidade, o conhecimento e o raciocínio dos participantes[/b], cumprindo com o objetivo da companhia para a instituição. Eles são divididos em nove:

[table style="width: 100%; border: none!important;"][tr style="border: none!important"][td style="border: 5px solid #D9D9D9!important; border-radius: 14px; width: 33%; vertical-align: top; text-align: center; padding: 14px 10px;" bgcolor="f0f0f0"][color=#721112][size=22]<i class="fas fa-fw fa-running"></i>[/size][/color]
[b][color=#721112]Treinamento de Agilidade [TA][/color][/b]
[color=#1a0000]Treina agilidade, resistência e paciência por meio de um fuja e outras atividades.[/color][/td][td style="border: 5px solid #D9D9D9!important; border-radius: 14px; width: 33%; vertical-align: top; text-align: center; padding: 14px 10px;" bgcolor="f0f0f0"][color=#721112][size=22]<i class="fas fa-fw fa-tshirt"></i>[/size][/color]
[b][color=#721112]Treinamento de Fardas [TF][/color][/b]
[color=#1a0000]Perguntas sobre a instituição, e o primeiro a acertar é promovido uma patente.[/color][/td][td style="border: 5px solid #D9D9D9!important; border-radius: 14px; width: 33%; vertical-align: top; text-align: center; padding: 14px 10px;" bgcolor="f0f0f0"][color=#721112][size=22]<i class="fas fa-fw fa-shield-alt"></i>[/size][/color]
[b][color=#721112]Treinamento de Sentinela [TS][/color][/b]
[color=#1a0000]Prepara o policial para ser um excelente sentinela.[/color][/td][/tr][tr style="border: none!important"][td style="border: 5px solid #D9D9D9!important; border-radius: 14px; width: 33%; vertical-align: top; text-align: center; padding: 14px 10px;" bgcolor="f0f0f0"][color=#721112][size=22]<i class="fas fa-fw fa-hands-helping"></i>[/size][/color]
[b][color=#721112]Treinamento de Apoio aos Praças [TAP][/color][/b]
[color=#1a0000]Passa conhecimento essencial a quem ocupa os postos iniciais.[/color][/td][td style="border: 5px solid #D9D9D9!important; border-radius: 14px; width: 33%; vertical-align: top; text-align: center; padding: 14px 10px;" bgcolor="f0f0f0"][color=#721112][size=22]<i class="fas fa-fw fa-user-shield"></i>[/size][/color]
[b][color=#721112]Treinamento de Cabo da Guarda [TCG][/color][/b]
[color=#1a0000]Melhora o desempenho dos praças enquanto Cabos da Guarda.[/color][/td][td style="border: 5px solid #D9D9D9!important; border-radius: 14px; width: 33%; vertical-align: top; text-align: center; padding: 14px 10px;" bgcolor="f0f0f0"][color=#721112][size=22]<i class="fas fa-fw fa-comments"></i>[/size][/color]
[b][color=#721112]Treinamento de Comunicação Militar [TCM][/color][/b]
[color=#1a0000]Aprimora a comunicação dos participantes no âmbito militar.[/color][/td][/tr][tr style="border: none!important"][td style="border: 5px solid #D9D9D9!important; border-radius: 14px; width: 33%; vertical-align: top; text-align: center; padding: 14px 10px;" bgcolor="f0f0f0"][color=#721112][size=22]<i class="fas fa-fw fa-exclamation-triangle"></i>[/size][/color]
[b][color=#721112]Treinamento de Conduta em Emergência [TCE][/color][/b]
[color=#1a0000]Ensina a reconhecer, comunicar e não atrapalhar em emergências.[/color][/td][td style="border: 5px solid #D9D9D9!important; border-radius: 14px; width: 33%; vertical-align: top; text-align: center; padding: 14px 10px;" bgcolor="f0f0f0"][color=#721112][size=22]<i class="fas fa-fw fa-spell-check"></i>[/size][/color]
[b][color=#721112]Treinamento de Ortografia Fundamental [TOF][/color][/b]
[color=#1a0000]Reforça as regras ortográficas essenciais da língua portuguesa.[/color][/td][td style="border: 5px solid #D9D9D9!important; border-radius: 14px; width: 33%; vertical-align: top; text-align: center; padding: 14px 10px;" bgcolor="f0f0f0"][color=#721112][size=22]<i class="fas fa-fw fa-desktop"></i>[/size][/color]
[b][color=#721112]Treinamento de Manuseação de Operadores [TMO][/color][/b]
[color=#1a0000]Prepara o policial para atuar na Sala de Controle com segurança.[/color][/td][/tr][/table][/color][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]REGRAS DE APLICAÇÃO[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000][b]→[/b] Os treinamentos rápidos podem ser aplicados a qualquer [b]cabo+/assessor+ com seus cursos concluídos[/b], com exceção do [b]Treinamento de Cabo da Guarda (TCG)[/b], no qual os participantes devem ser [b]sargentos+/secretário+ com CFS/APA[/b].

[color=#4D0C0D][b]➥ Atente-se que os treinamentos TCG, TF e TA não podem ser aplicados com menos de dois participantes, já que essa quantidade é necessária para que seja mais desafiador para os policiais. Além disso, por serem treinamentos coletivos, você deverá pedir permissão ao Oficial da Guarda antes de aplicá-los.[/b][/color]

[b]→[/b] Os treinamentos que podem ser realizados individualmente (TS, TAP, TCM, TOF e TMO) não necessitam da permissão do Oficial da Guarda para serem aplicados. Basta levar o policial de qualquer localidade do batalhão à sala de aplicação ou ao Centro de Instruções se o batalhão não estiver cheio.

[color=#4D0C0D][b]➥ Alguns treinamentos, como TCG, TMO e TS, só podem ser aplicados na base de treinamento que será apresentada a você após a graduação.[/b][/color]

[b]→[/b] Todos os treinamentos rápidos devem seguir a apostila disponibilizada em [url=https://www.policiarcc.com/t34296-tre-2-apostilas-de-treinamentos][b][TRE.2] Apostilas de Treinamentos[/b][/url] e, logo após a aplicação, o treinamento deve ser postado no formulário disponível no tópico [url=https://www.policiarcc.com/t12255-tre-2-central-de-postagens][b][TRE.2] Central de Postagens[/b][/url]. Ambos os tópicos encontram-se no [b]subfórum dos treinadores de nível 2[/b].

[b]→[/b] Para manter um bom padrão entre as aplicações de treinamentos rápidos, são instituídas as seguintes regras:

[b]I -[/b] [b]Treinamentos de tipo A devem ter, no mínimo, 7 minutos de duração[/b], enquanto os treinamentos de [b]tipo B[/b] devem ter, no mínimo, [b]10 minutos[/b]. [b]TRs-A não podem ultrapassar 30 minutos[/b];
[b]II -[/b] Não é permitido aplicar gratificações temporárias ou efetivas por bom desempenho no treinamento rápido;
[b]III -[/b] O seu treinamento rápido deve ter [b]dois printscreens: um do início e outro do término[/b], devendo ambos estarem em [b]tela cheia mostrando a data e hora[/b];
[b]IV -[/b] Se todos os participantes do seu treinamento caírem, você deve cumprir as exigências presentes na carta de orientação disponível em seu subfórum para ser postado.[/color][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]TUTORIAS[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000]As tutorias são [b]acompanhamentos[/b] feitos exclusivamente com [b]treinadores de nível 1[/b] na aplicação de treinamentos básicos [b]com o objetivo de evitar e corrigir erros, além de auxiliar os novos membros da companhia.[/b]

[b]→[/b] Antes de iniciar a tutoria, [b]é importante verificar se aquele treinador já não foi tutorado no mesmo curso nos últimos 07 dias[/b]. Para isso, acesse a planilha [url=https://docs.google.com/spreadsheets/d/1QprXAr4s8GCZIpOuBc1qUwdk_Jj57WfzXWx5PafYP94/edit?gid=257748916#gid=257748916][b]Verificador de Tutoria[/b][/url]. Se um treinador já recebeu tutoria durante um CAS, ele só pode receber agora em um CFS e vice-versa. O ministério+ pode conceder exceções se for de extrema necessidade.

[b]→[/b] Para aplicar uma tutoria, deve-se seguir os seguintes procedimentos:

[b]I -[/b] Encontre algum treinador dando início ao curso e consulte na planilha de verificação se está apto a receber sua tutoria;
[b]II -[/b] Leve-o para alguma sala de aplicação do corredor e instrua ao militar para que aplique a aula fora do sussurro;
[b]III -[/b] Reforce ao treinador a importância de [b]consultar o receptor do curso no system e seguir as instruções dos scripts[/b];
[b]IV -[/b] Caso o treinador cometa qualquer falha ou tenha dúvidas durante a aplicação, [b]você é o responsável por auxiliá-lo[/b];
[b]V -[/b] Oriente ao treinador para que, ao fim do curso, marque a opção "SIM" referente ao campo de acompanhamento no formulário;
[b]VI -[/b] Realize um breve diálogo com o treinador de nível 1 abordando tópicos relevantes para sua carreira. Sugerimos que aborde assuntos como o regimento interno, subgrupos ou código penal da companhia. Não se esqueça de printar a conversa completa e hospedar junto com a tutoria;
[b]VII -[/b] Realize a postagem da tutoria através da central de postagens, de forma a conter [b]os prints iniciais e finais do curso[/b].

[color=#4D0C0D][b]➥ Qualquer treinamento rápido ou tutoria que não seguir regras exigidas nesta apostila ou no tópico de [url=https://www.policiarcc.com/t31258-tre-2-carta-de-orientacao][TRE.2] Carta de Orientação[/url] no subfórum de treinadores de nível 2 será cancelado.[/b][/color][/color][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]ENVIO DE MENSAGEM PRIVADA[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000]Consiste no envio, de forma automatizada, de uma [b]Mensagem Privada[/b] ao seu Treinador de Nível 1 escalado.

[b]→[/b] Cada Treinador Nível 2 ficará responsável por pelo menos um Treinador Nível 1 em período de adaptação, [b]optando por enviar a Mensagem Privada[/b];

[b]→[/b] No subfórum de TRE.2, o tópico [b][TRE.2] Escala Semanal[/b] dará acesso à escala, a qual apresentará quais TRE.1 podem receber a MP. Para acessar a escala, [url=https://www.policiarcc.com/h429-tre-escala-semanal-tre-2][b]clique aqui.[/b][/url]

[b]→[/b] Caso o TRE.2 opte por enviar a Mensagem Privada ao TRE.1 designado pela escala, [b]ganhará 50% na sua meta semanal[/b];

[b]→[/b] A Mensagem Privada a ser enviada já tem seu [b]modelo pronto e automatizado[/b], ou seja, basta clicar no botão de enviar e pronto!

[b]→[/b] Para contabilizar os 50% dessa modalidade, deve-se [b]realizar o print da mensagem enviada[/b] e [b]postar em [TRE.2] Central de Postagens[/b].

É sugerido que [b]enviem sempre a Mensagem Privada[/b], pois além de orientar o treinador de nível 1 que está chegando na companhia, podendo evitar que ele sofra punições, também é a modalidade mais prática para ajudar vocês na meta![/color][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]CONCLUSÃO[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000]Caso tenha qualquer dúvida durante sua estadia no cargo, não hesite em retirá-las com um superior a você na companhia. Agora que finalizou a leitura da apostila, diga ao seu graduador que você está pronto para fazer o teste. Sinta-se à vontade para consultar a apostila durante o teste.[/color][/td][/tr][/table][/td][/tr][/table][/td][/tr][tr style="border: none!important"][td style="border: none!important; text-align: center; padding: 2px 20px 12px 20px;"][center][size=11][color=white]Design por [b]Brendon[/b] e reformulado por [b]SrHemoke[/b], com base no modelo de [b]Granno[/b], [b]gzrufino.[/b]
Todos os direitos reservados à [b]Companhia dos Treinadores[/b] <i class="fas fa-bolt"></i>[/color][/size][/center][/td][/tr][/table][/td][/tr][/table]`;
        break;
      case "GRAD_AVAN":
        title = "[TRE] Graduação Avançada";
        message = `[table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; font-family: 'Poppins', sans-serif; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);" bgcolor="4D0C0D"][tr style="border: none!important"][td style="border: none!important; padding: 6px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px" bgcolor="150102"][tr style="border: none!important"][td style="border: none!important"][img]https://i.imgur.com/dMstpiH.png[/img][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]GRADUAÇÃO AVANÇADA[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: center; padding: 24px 32px"]
[center][size=14]Saudações, [b][color=#721112]{USERNAME}[/color][/b]![/size]
[table  style="width: 25%; border-radius: 10px; border: none!important; overflow: hidden; line-height: 1em; margin: 10px auto 22px auto;" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; overflow: hidden; padding: 1.5px"][/td][/tr][/table][/center]

[justify][size=14][color=#1a0000]Congratulações pela sua promoção na companhia dos [b][color=#721112]Treinadores![/color][/b] A companhia agradece pelo seu esforço. Agora, em um novo cargo, você recebe [b]novos poderes e responsabilidades[/b] e essa apostila visa justamente te ensinar a atuar no seu novo posto hierárquico. Leia com [b]atenção![/b][/color][/size][/justify]
[/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]META E GRATIFICAÇÕES[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000]A meta quinzenal dos treinadores de nível 3 é composta [b]ATUALMENTE[/b] por [b]01 gincana + 01 capacitação de wired.[/b]

[color=#4D0C0D][b]➥ Nota: Ressalta-se que os Treinadores de Nível 3 também são responsáveis por aplicação do Treinamento Convencional Clássico (TCC), no entanto, esta modalidade encontra-se suspensa por decisão da Supremacia, de modo que não há meta no que se refere ao Treinamento Convencional Clássico (TCC).[/b][/color]

Os treinadores de nível três têm como obrigação concluir sua meta quinzenal, sendo esta obrigatoriamente formada por [b]01 gincana + capacitação de wireds.[/b]
• Aplicação de Capacitação de Wireds: [b]50%;[/b]
• Aplicação da gincana quinzenal: [b]50%.[/b]

[b]→[/b] Os treinadores de nível três que concluírem sua meta receberão [b]20 medalhas positivas efetivas por quinzena[/b].

[color=#4D0C0D][b]➥ Os que não cumprirem, receberão 20 medalhas negativas efetivas e uma advertência interna. Em caso de reincidências, o treinador de nível três será rebaixado.[/b][/color][/color][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]GINCANAS QUINZENAIS[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000]Os treinadores de nível 3, quinzenalmente, realizam uma gincana interna [b]no grupo dos Treinadores do WhatsApp.[/b]

[b]→[/b] As gincanas visam manter [b]interação direta[/b] com os membros da companhia, [b]fortalecendo laços de amizades[/b] e criando um senso de pertencimento ao grupo, melhorar o marketing interno e, por meio da competição, despertar o entusiasmo dos participantes.

[b]→[/b] [b]A discussão do tema e a organização[/b] são feitas pelos próprios treinadores de nível 3 no grupo do WhatsApp, de modo que [b]devem estar estabelecidas as tarefas de cada um dos membros,[/b] devendo estes cumpri-las para que possam ser contabilizadas na meta quinzenal.

[b]→[/b] Após a conclusão, a gincana deverá ser postada no subfórum dos Treinadores em [url=https://www.policiarcc.com/t30176-tre-3-central-de-postagens][b][TRE.3] Central de Postagens[/b][/url].

[color=#4D0C0D][b]➥ Negligenciar as regras aqui dispostas, tornará os responsáveis passíveis de punição, como previsto no Código Penal dos Treinadores.[/b][/color][/color][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]CAPACITAÇÃO DE WIREDS[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000]As capacitações de wireds são aplicadas para qualquer policial, [b]desde que este esteja integrado a uma companhia.[/b] Apesar de ser um requisito [b]obrigatório[/b] de promoção aos [b]treinadores de nível 2[/b], podem ser aplicadas aos treinadores de nível 1 da mesma maneira.

[b]→[/b] Para aplicar, basta verificar se o policial foi aprovado na parte teórica, [url=https://docs.google.com/spreadsheets/d/13M9ovdV8QclDF1QCeeCh6sNOfUhGlvNyLDir5oGZISA/edit?gid=1081934736#gid=1081934736][b]clicando aqui[/b][/url]. Após isto, leve-o ao quarto "[b][TRE] Sala Técnica [CDI][/b]" e aplique o script disposto no subfórum do seu cargo. Para efeito de comprovação, o printscreen do [b]início, meio e fim[/b] da aula devem ser tirados e postados em [url=https://www.policiarcc.com/t30176-tre-3-central-de-postagens][b][TRE.3] Central de Postagens[/b][/url].

[b]I -[/b] Após finalizar a capacitação de wired, é de competência do Treinador de Nível 3 [b]remover o militar do grupo[/b]. Em caso de descumprimento, o membro receberá uma [b]advertência[/b] na companhia;
[b]II -[/b] O printscreen final deve ser tirado após desmontar os wireds, em :zoom 0 e deve mostrar o grupo “[b][CDI] Sala Técnica[/b]” na última página [url=https://imgur.com/a/IpJTmZu][b]Clique aqui[/b][/url] e veja o exemplo.

[color=#4D0C0D][b]➥ Uma capacitação de wired pode ser cancelada pela superintendência do Comitê de Intendência (CDI) caso não possua todos os printscreens comprobatórios necessários e caso o capacitado não tenha sido aprovado na parte teórica da capacitação.[/b][/color][/color][/td][/tr][/table][/td][/tr][/table][table  style="width: auto; border: none!important; overflow: hidden; border-radius: 100px; position: relative; font-weight: 700; color: white; top: -5px; margin: 20px auto 0 auto; box-shadow: 0px 2px 5px rgba(20, 0, 0, 0.14);  z-index: 2" bgcolor="721112"][tr style="border: none!important"][td style="border: none!important; padding: 15px 50px 15px 50px;"]CONCLUSÃO[/td][/tr][/table][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px; position: relative; margin-top: -28px; z-index: 1" bgcolor="f0f0f0"][tr style="border: none!important"][td style="border: none!important; padding: 3px"][table  style="width: 100%; border: none!important; overflow: hidden; border-radius: 15px;" bgcolor="D9D9D9"][tr style="border: none!important"][td style="border: none!important; text-align: justify; padding: 34px 18px 16px 18px"][color=#1a0000]Caso tenha qualquer dúvida durante sua estadia no cargo, não hesite em retirá-las com um superior a você na companhia. Agora que finalizou a leitura da apostila, diga ao seu graduador que você está pronto para fazer o teste. Sinta-se à vontade para consultar a apostila durante o teste.[/color][/td][/tr][/table][/td][/tr][/table][/td][/tr][tr style="border: none!important"][td style="border: none!important; text-align: center; padding: 2px 20px 12px 20px;"][center][size=11][color=white]Design por [b]Brendon[/b] e reformulado por [b]SrHemoke[/b], com base no modelo de [b]Granno[/b], [b]gzrufino.[/b]
Todos os direitos reservados à [b]Companhia dos Treinadores[/b] <i class="fas fa-bolt"></i>[/color][/size][/center][/td][/tr][/table][/td][/tr][/table]`;
        break;
    }

    send_MP(title, user, message);
    return false;
  }

  function send_MP(title, user, message) {
    jQuery
      .post("/privmsg", {
        folder: "inbox",
        mode: "post",
        post: "1",
        "username[]": user,
        subject: title,
        message: message,
      })
      .done(function () {
        console.log("Mensagem Privada enviada!");
        $("#toast-post").addClass("show");
        setTimeout(function () {
          $("#toast-post").removeClass("show");
        }, 4000);
        setTimeout(function () {
          location.href = "https://www.policiarcc.com/privmsg?folder=inbox";
        }, 4000);
      })
      .fail(function () {
        console.log("Erro");
        $("#toast").addClass("show");
        setTimeout(function () {
          $("#toast").removeClass("show");
        }, 4000);
      });
  }
