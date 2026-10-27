import type { Case, Clue, SceneData, Suspect } from '../types'

const SUS: Suspect[] = [
  {
    id: 'liv',
    name: 'Lívia Duarte',
    role: 'Atriz principal, 36 anos',
    ini: 'L',
    qs: [
      ['Onde você estava às 22h40?', 'No camarim, tirando a maquiagem. Nilza bateu na porta às 22h50 para chamar para o brinde.'],
      ['Como era sua relação com Sérgio?', 'Ele me deu o papel da minha vida. Também me cobrava como ninguém. Mas eu o admirava.'],
      ['Sabia algo sobre a turnê?', 'Ouvi boatos de que o elenco mudaria. Ninguém me disse nada diretamente.'],
    ],
    re: {
      c3: ['Então era isso... ele ia me trocar pela Débora. Sim, dói. Mas eu jamais subiria naquele urdimento.', 'adm'],
      c1: ['Não sei nada de mecânica de teatro. Falem com a produção.'],
      c2: ['Sérgio sempre deixava recados nos programas. Era mania dele.'],
      c4: ['As meninas assinaram, sim. Eu assinei às 22h50, quando Nilza passou.'],
      c5: ['Dinheiro é com o Otávio.'],
      c6: ['Não me meto nas contas do teatro.'],
      c7: ['O Otávio na coxia? Ele sempre odiou ficar atrás do palco.'],
      c8: ['O Caio foi demitido hoje? Ninguém me contou.'],
    },
  },
  {
    id: 'ota',
    name: 'Otávio Brandt',
    role: 'Produtor e sócio, 55 anos',
    ini: 'O',
    qs: [
      ['Onde o senhor estava às 22h40?', 'No foyer, recebendo convidados no bar. Fiquei lá a noite toda.'],
      ['Qual era sua relação com Sérgio?', 'Sócio e amigo de trinta anos. Brigávamos por tudo, como todo casal de teatro.'],
      ['Como estão as finanças do teatro?', 'Teatro nunca é negócio fácil, mas estamos bem. A estreia foi um sucesso de bilheteria.'],
    ],
    re: {
      c7: ['(silêncio) Passei pela coxia por um minuto, só para conferir o cenário. Esqueci de mencionar.', 'contra'],
      c5: ['Divergência de borderô acontece. Foi erro de contagem do caixa.', 'crack'],
      c6: ['Isso é assunto da empresa! Não deveria estar nas mãos de vocês!', 'crack'],
      c2: ['Nunca vi esse programa. Eu estava no foyer, já disse.'],
      c1: ['Aquela grade era velha. Pedi revisão mil vezes. Foi um acidente.'],
      c3: ['A turnê era decisão do Sérgio. Eu só produzia.'],
      c4: ['Não sei nada de folha de chamada.'],
      c8: ['Caio sempre foi temperamental. Não me surpreende.'],
    },
  },
  {
    id: 'nil',
    name: 'Nilza Campos',
    role: 'Contrarregra, 49 anos',
    ini: 'N',
    qs: [
      ['Onde você estava às 22h40?', 'Estive na coxia até as 22h30. Depois, só nos camarins e no corredor, avisando do brinde.'],
      ['Há quanto tempo trabalha aqui?', 'Dezenove anos de Imperial. Vi muita estreia, nunca uma tragédia.'],
      ['Quem mexe nas ferramentas do teatro?', 'A maleta de manutenção fica na sala do Otávio. Só ele e eu temos a chave.'],
    ],
    re: {
      c4: ['Está tudo aí, hora por hora. Cada atriz assinou quando eu bati na porta.', 'clear'],
      c7: ['Então ele esteve lá atrás... e disse que ficou no foyer. Que estranho.'],
      c1: ['Pedi a revisão dessa trava há meses. Ninguém liberou verba.'],
      c2: ['Não mexo nos programas dos diretores.'],
      c3: ['Contratos não passam por mim.'],
      c5: ['Eu não entro na bilheteria.'],
      c6: ['Isso é papel do escritório. Nunca vi.'],
      c8: ['O Caio só saiu da cabine depois do último cue. Eu mesma passei lá às 23h.'],
    },
  },
  {
    id: 'cai',
    name: 'Caio Mendonça',
    role: 'Iluminador, 31 anos',
    ini: 'C',
    qs: [
      ['Onde você estava às 22h40?', 'Na cabine de luz, operando os cues do brinde e dos agradecimentos.'],
      ['O que houve entre você e Sérgio?', 'Ele me demitiu hoje, na frente da equipe. Disse que eu era lento. Doeu.'],
      ['Dá para apagar as luzes do urdimento por fora?', 'Dá, pelo painel da coxia ou pela cabine. Mas eu não apaguei nada.'],
    ],
    re: {
      c8: ['Pode ler. Fiquei lá o tempo todo, cue a cue. Só desci depois do último.', 'clear'],
      c7: ['Eu vi na tela de serviço, sim. Achei estranho o Otávio lá atrás com aquela maleta.'],
      c1: ['Alguém soltou isso de propósito. Aquela trava nunca cedeu sozinha.'],
      c3: ['Não sei de contrato nenhum.'],
      c4: ['Nilza é de confiança, ela sempre passa nos camarins.'],
      c2: ['Sérgio escrevia em tudo. Programa, mão, parede.'],
      c5: ['Bilheteria não é comigo.'],
      c6: ['Cobrança? Isso eu não sabia.'],
    },
  },
]

const CLUES: Clue[] = [
  { id: 'c1', sc: 'pal', t: 'Trava da varanda técnica', x: 'Os parafusos da trava da grade foram retirados e deixados no chão, com marcas de chave de fenda. A grade cedeu ao primeiro peso.' },
  { id: 'c2', sc: 'pal', t: 'Programa da estreia', x: 'Programa dobrado, com a letra de Sérgio: "Otávio, 22h45, urdimento. Traga o livro-caixa. Chega de desculpas."' },
  { id: 'c3', sc: 'cam', t: 'Contrato da turnê', x: 'Contrato da turnê nacional já assinado: o papel principal passa de Lívia Duarte para Débora Reis. Sérgio ia avisar o elenco depois da estreia.' },
  { id: 'c4', sc: 'cam', t: 'Folha de chamadas', x: 'Folha da contrarregra, assinada pelas atrizes: 22h35 camarim 1, 22h42 camarim 3, 22h50 camarim 2. Nilza esteve no corredor leste o tempo todo.' },
  { id: 'c5', sc: 'bil', t: 'Borderô da estreia', x: 'Ingressos vendidos: 412. Valor declarado no caixa: 287. A diferença de 125 ingressos não aparece em lugar nenhum. Assinado: O. Brandt.' },
  { id: 'c6', sc: 'bil', t: 'Notificação de cobrança', x: 'Aviso em nome da Brandt Produções: dívida de R$ 1,2 milhão com prazo vencendo na sexta, sob risco de penhora do teatro.' },
  { id: 'c7', sc: 'cab', t: 'Câmera de serviço', x: 'Às 22h32, Otávio Brandt entra na coxia com a maleta de manutenção. Sai às 22h58, sem a maleta.' },
  { id: 'c8', sc: 'cab', t: 'Diário de luz de Caio', x: 'Cue a cue, anotado à mão: ele não saiu da cabine entre 22h e 23h. Na última página: "Demitido hoje. Faço o show até o fim."' },
]

const SC: Record<string, SceneData> = {
  cam: { n: 'Camarim', d: 'Lâmpadas acesas, espelho embaçado, perfume doce de pó de arroz. A estrela jura que não saiu daqui.', h: [['c3', 150, 128], ['c4', 53, 70]] },
  pal: { n: 'Palco', d: 'Tablado frio, cortinas ainda balançando. Sérgio Prado caiu da varanda técnica e foi achado aqui às 23h05.', h: [['c1', 238, 56], ['c2', 250, 184]] },
  bil: { n: 'Bilheteria', d: 'O guichê onde se conta a noite. Casa cheia, caixa magro.', h: [['c5', 130, 114], ['c6', 326, 126]] },
  cab: { n: 'Cabine de luz', d: 'Painéis, faders e uma tela de serviço. Daqui se enxerga tudo, e se apaga tudo.', h: [['c7', 314, 124], ['c8', 108, 116]] },
}

export const imperial: Case = {
  id: 'imperial',
  key: 'cases-stories-imperial-v1',
  theme: 'imperial',
  no: '002',
  title: 'O Caso Imperial',
  titleLines: ['O Caso', 'Imperial'],
  kind: 'Dossiê confidencial · Morte suspeita',
  tagline: 'Casa cheia. Cortinas fechadas. Um assassino nos bastidores.',
  synopsis:
    'Noite de estreia no Teatro Imperial. O diretor é achado morto sob a varanda técnica. Parecia acidente, até alguém conferir os números da noite.',
  place: 'Teatro Imperial',
  difficulty: 3,
  bg: 'pal',
  suspectsLabel: 'Quatro pessoas conheciam os bastidores',
  suspects: SUS,
  clues: CLUES,
  scenes: SC,
  met: [
    'Retirou os parafusos da trava da varanda técnica e atraiu Sérgio até lá',
    'Empurrou Sérgio durante uma discussão no palco',
    'Cortou o cabo do contrapeso do cenário',
  ],
  mot: [
    'Impedir que Sérgio descobrisse o desvio de dinheiro da bilheteria',
    'Ficar com o papel principal e a turnê',
    'Vingança por ter sido demitido',
  ],
  win: {
    s: 'ota',
    m: 0,
    r: 0,
    text: [
      'Era Otávio Brandt. Afogado em dívidas, ele embolsava parte da bilheteria do Imperial. Sérgio notou a diferença no borderô e marcou uma conversa no urdimento às 22h45, com o livro-caixa.',
      'Otávio chegou antes, soltou os parafusos da trava com a maleta de manutenção e esperou. A grade fez o resto.',
    ],
  },
  ranks: [
    [8, 'Detetive exemplar, nenhum detalhe escapou.'],
    [6, 'Olhar de bastidor, quase nada escapou.'],
    [0, 'Instinto afiado, resolvido com poucas pistas.'],
  ],
}
