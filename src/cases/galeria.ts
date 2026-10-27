import type { Case, Clue, SceneData, Suspect } from '../types'

const SUS: Suspect[] = [
  {
    id: 'ma',
    name: 'Marina Sá',
    role: 'Curadora da galeria, 45 anos',
    ini: 'M',
    qs: [
      ['Onde você estava às 22h?', 'Na sala de leilões, conferindo o catálogo com o restaurador.'],
      ['Você sabia da dúvida sobre a tela?', 'Sabia que havia dúvidas. Eduardo não queria ouvir.'],
      ['Como era sua relação com Eduardo?', 'Profissional. Ele me pagava para acreditar nele.'],
    ],
    re: {
      c3: ['Esse laudo tem a minha assinatura, sim. Mas confiei no restaurador.', 'adm'],
      c6: ['Não conheço esse cofre por dentro. Só tenho parte do código.'],
      c8: ['Saí do terraço antes das 22h. Estava com frio.', 'clear'],
    },
  },
  {
    id: 'ig',
    name: 'Igor Pinto',
    role: 'Restaurador, 39 anos',
    ini: 'I',
    qs: [
      ['Onde você estava às 22h?', 'No ateliê, limpando a tela. Até 22h15, pelo menos.'],
      ['Quem tinha acesso ao ateliê?', 'Eu, a Marina e o próprio Eduardo.'],
      ['Você conhecia a tela?', 'Trabalhei nela por três meses. Conheço cada pincelada.'],
    ],
    re: {
      c3: ['Eu só limpei o verniz. A tinta é original, juro.', 'crack'],
      c4: ['Os pincéis estão do jeito que deixei.', 'clear'],
      c5: ['Esse cofre não é meu. Nunca tive a combinação.', 'contra'],
      c7: ['Eu não fumo. Ninguém fuma no terraço.', 'contra'],
    },
  },
  {
    id: 'li',
    name: 'Lisandra Abreu',
    role: 'Herdeira, 33 anos',
    ini: 'L',
    qs: [
      ['Onde você estava às 22h?', 'No terraço, com um drinque. Estava sozinha.'],
      ['O que você ganha com a morte dele?', 'A galeria, se ele morresse sem testamento novo.'],
      ['Viu alguém no corredor?', 'Só o Igor, correndo. Achei estranho.'],
    ],
    re: {
      c2: ['Pode ser. Eduardo levava quadros na mala de viagem.'],
      c7: ['Vi uma luz no terraço mais cedo. Achei que fosse o vigia.', 'adm'],
      c8: ['Saí do terraço às 22h05, sozinha.', 'clear'],
    },
  },
  {
    id: 'ke',
    name: 'Kenji Oda',
    role: 'Colecionador, 58 anos',
    ini: 'K',
    qs: [
      ['Onde você estava às 22h?', 'Na sala de leilões, bebendo com a Marina.'],
      ['Você chegou a comprar a tela?', 'Ofereci. O preço era alto demais para mim.'],
      ['Você conhecia o Igor?', 'Só de vista. Um restaurador muito nervoso.'],
    ],
    re: {
      c1: ['Essa moldura estava assim quando cheguei. Não reparei em mais nada.'],
      c4: ['Esses pincéis parecem de um profissional. Nada de amador.'],
      c5: ['Nunca estive no cofre. Sou discreto com o que é meu.'],
    },
  },
]

const CLUES: Clue[] = [
  { id: 'c1', sc: 'gal', t: 'Moldura vazia', x: 'A moldura da tela principal tem um encaixe vazio, como se outra tela tivesse sido retirada.' },
  { id: 'c2', sc: 'gal', t: 'Mala de viagem', x: 'Uma mala aberta no canto, com fita de embalagem de tela enrolada.' },
  { id: 'c3', sc: 'res', t: 'Laudo de autenticidade', x: 'Laudo assinado que atesta a tela como original, com data da véspera.' },
  { id: 'c4', sc: 'res', t: 'Pincéis úmidos', x: 'Pincéis lavados às pressas, ainda úmidos, num pote de solvente.' },
  { id: 'c5', sc: 'cof', t: 'Cofre entreaberto', x: 'O cofre está entreaberto. Só pode ser aberto por quem tem a combinação completa.' },
  { id: 'c6', sc: 'cof', t: 'Combinação parcial', x: 'Um papel com três dígitos da combinação, escrito em letra apressada.' },
  { id: 'c7', sc: 'ter', t: 'Ponta de cigarro', x: 'Uma ponta de cigarro sob o banco, de uma marca que ninguém da casa fuma.' },
  { id: 'c8', sc: 'ter', t: 'Mensagem das 22h10', x: 'Uma mensagem no celular de Eduardo: "o laudo está pronto, falamos amanhã".' },
]

const SC: Record<string, SceneData> = {
  gal: { n: 'Galeria', d: 'Três telas nas paredes e um banco de madeira no centro. Uma das molduras parece vazia por dentro.', h: [['c1', 80, 120], ['c2', 260, 110]] },
  res: { n: 'Ateliê de restauro', d: 'Cavaletes, pincéis e um cheiro forte de solvente. A tela rara ficou aqui até ontem à noite.', h: [['c3', 150, 140], ['c4', 290, 120]] },
  cof: { n: 'Cofre', d: 'Um cofre de parede, com a porta entreaberta. Só a família e a curadoria conheciam a combinação.', h: [['c5', 180, 120], ['c6', 270, 160]] },
  ter: { n: 'Terraço', d: 'Vista para a cidade, um banco frio e a grade baixa. Daqui se ouve tudo que acontece no ateliê.', h: [['c7', 90, 140], ['c8', 250, 150]] },
}

export const galeria: Case = {
  id: 'galeria',
  key: 'cases-stories-galeria-v1',
  theme: 'galeria',
  no: '004',
  title: 'O Caso Ateliê',
  titleLines: ['O Caso', 'Ateliê'],
  kind: 'Dossiê confidencial · Morte suspeita',
  tagline: 'Um quadro falso. Um colecionador morto.',
  synopsis:
    'Na Galeria Serra, o colecionador Eduardo Serra é achado morto no ateliê de restauro, um dia depois de um laudo atestar a autenticidade de uma tela rara.',
  place: 'Galeria Serra',
  bg: 'gal',
  suspectsLabel: 'Quatro pessoas tinham acesso ao ateliê',
  suspects: SUS,
  clues: CLUES,
  scenes: SC,
  met: [
    'Golpe na cabeça no ateliê, depois da discussão sobre a tela',
    'Envenenou o café de Eduardo durante a limpeza',
    'Empurrou Eduardo da grade do terraço',
  ],
  mot: ['Esconder a falsificação que ele mesmo produziu', 'Vender a tela original a um colecionador', 'Herdar a galeria com o testamento antigo'],
  win: {
    s: 'ig',
    m: 0,
    r: 0,
    text: [
      'Era Igor Pinto. Ele trocou a tela original por uma cópia que pintou no ateliê. Eduardo desconfiou na véspera, e a conversa sobre o laudo acabou em briga.',
      'O cofre, o cigarro que ninguém fuma e a mensagem das 22h10 fecharam o caso. A tela verdadeira estava na mala, escondida à vista de todos.',
    ],
  },
  ranks: [
    [8, 'Olhar de restaurador: nenhum traço escapou.'],
    [6, 'Caso difícil, bem conduzido.'],
    [0, 'Resolvido com a tela na mão.'],
  ],
}
