import type { Case, Clue, SceneData, Suspect } from '../types'

const SUS: Suspect[] = [
  {
    id: 'ro',
    name: 'Rosana Vidal',
    role: 'Viúva, 52 anos',
    ini: 'R',
    qs: [
      ['Onde você estava durante a tempestade?', 'Dentro de casa, fechando as janelas. A chuva estava forte.'],
      ['Você sabia do que Joaquim fazia no farol?', 'Ele dizia que era só vigiar a costa. Não mexia em nada além disso.'],
      ['Joaquim tinha inimigos?', 'Muitos. Ele não tinha paciência com ninguém que descumpria as regras.'],
    ],
    re: {
      c4: ['Eu tomei chá com ele antes de subir. Ele estava calmo.', 'clear'],
      c3: ['Essa letra não é do Joaquim. Ele escrevia com lápis.', 'contra'],
      c6: ['Não sei nada sobre essas caixas. O marido cuidava disso.'],
    },
  },
  {
    id: 'ti',
    name: 'Tiago Mota',
    role: 'Filho, pescador, 27 anos',
    ini: 'T',
    qs: [
      ['Onde você estava à noite?', 'No barco, levando redes para dentro antes da chuva. Voltei tarde.'],
      ['Você e seu pai brigavam?', 'Todo dia. Ele achava que eu deveria ter ficado no farol.'],
      ['Você sabia do contrabando?', 'Ouvi rumores no porto. Nunca confirmei.'],
    ],
    re: {
      c5: ['O bote estava no mar quando cheguei. Achei que era de outro pescador.', 'adm'],
      c2: ['Meus sapatos estão secos. Eu não passei por aquela escada.', 'contra'],
      c7: ['Esse rádio nunca foi meu. Eu não sintonizo frequências de navio.'],
    },
  },
  {
    id: 'ar',
    name: 'Arlindo Souza',
    role: 'Ajudante do farol, 60 anos',
    ini: 'A',
    qs: [
      ['Onde você estava às 23h?', 'Na casa, esquentando a sopa. Não subi à torre depois das 22h.'],
      ['Quem tinha a chave da caixa de ferro?', 'Joaquim e eu. Só nós dois.'],
      ['Como era seu trabalho com ele?', 'Vinte anos juntos. Ele confiava em mim para o turno de madrugada.'],
    ],
    re: {
      c1: ['A chave de desligamento estava na caixa. Qualquer um podia ter usado.', 'crack'],
      c5: ['Eu não cortaria um bote. Eu cuido dos barcos desde menino.'],
      c6: ['Esses rótulos são de fornecedores. Eu só recebo as caixas.', 'contra'],
      c8: ['A chave do depósito fica comigo. Eu não a deixei lá.', 'contra'],
    },
  },
  {
    id: 'ce',
    name: 'Celina Prado',
    role: 'Inspetora da Marinha, 40 anos',
    ini: 'C',
    qs: [
      ['Onde você estava na noite da tempestade?', 'Num posto de vigia na praia, monitorando os sinais da costa.'],
      ['Você veio investigar o farol?', 'Recebi denúncias de navios sem sinal. Vim verificar o farol.'],
      ['Você conhecia Joaquim?', 'Só pelos relatórios. Ele fazia tudo certo no papel.'],
    ],
    re: {
      c1: ['Essa lâmpada foi desligada à mão. Não há falha no motor.', 'adm'],
      c7: ['Essa frequência é de um navio que deveria estar no porto. Confirmo.', 'clear'],
      c3: ['Os avisos desse diário foram alterados depois da tempestade.'],
    },
  },
]

const CLUES: Clue[] = [
  { id: 'c1', sc: 'tor', t: 'Lâmpada desligada', x: 'A chave manual da lâmpada foi virada para desligar às 23h. O motor elétrico estava em ordem.' },
  { id: 'c2', sc: 'tor', t: 'Marcas molhadas na escada', x: 'Pegadas de sapato molhado sobem e descem os degraus da torre, mas somem antes do topo.' },
  { id: 'c3', sc: 'cas', t: 'Diário de bordo', x: 'As anotações da última semana foram reescritas com outra caneta, e os avisos aos navios não batem com o rádio.' },
  { id: 'c4', sc: 'cas', t: 'Duas xícaras de chá', x: 'Duas xícaras de chá sobre a mesa, uma ainda morna e outra vazia, com marca de batom.' },
  { id: 'c5', sc: 'anc', t: 'Bote solto', x: 'Um bote amarrado ao píer, com a corda cortada de forma limpa, não por desgaste.' },
  { id: 'c6', sc: 'anc', t: 'Caixas sem nota', x: 'Caixas com rótulos de fornecedores que não existem na lista do porto.' },
  { id: 'c7', sc: 'dep', t: 'Rádio sintonizado', x: 'O rádio do depósito está numa frequência de navio, com volume alto e chiado de tempestade.' },
  { id: 'c8', sc: 'dep', t: 'Chave reserva ausente', x: 'O gancho da chave reserva do depósito está vazio, e só dois homens tinham acesso a ela.' },
]

const SC: Record<string, SceneData> = {
  tor: { n: 'Torre do farol', d: 'Cento e trinta e dois degraus, uma lâmpada parada e o vento batendo nas janelas. Joaquim foi achado na base da escada.', h: [['c1', 180, 90], ['c2', 240, 170]] },
  cas: { n: 'Casa do faroleiro', d: 'Uma mesa de madeira, duas xícaras e o diário de bordo aberto sobre a estante.', h: [['c3', 110, 120], ['c4', 270, 140]] },
  anc: { n: 'Ancoradouro', d: 'O píer balança com a maré. Um bote solto bate contra as estacas, e as caixas ainda estão na beira.', h: [['c5', 80, 150], ['c6', 250, 120]] },
  dep: { n: 'Depósito', d: 'Caixas empilhadas, óleo nos barris e um rádio ligado sem ninguém por perto.', h: [['c7', 120, 110], ['c8', 270, 150]] },
}

export const farol: Case = {
  id: 'farol',
  key: 'cases-stories-farol-v1',
  theme: 'farol',
  no: '005',
  title: 'O Caso Farol',
  titleLines: ['O Caso', 'Farol'],
  kind: 'Dossiê confidencial · Morte suspeita',
  tagline: 'A luz apagou numa noite de tempestade.',
  synopsis:
    'Na Ponta do Farol, o faroleiro Joaquim Mota é achado morto na base da torre. Na mesma noite, a lâmpada se apagou e um navio quase naufragou na costa.',
  place: 'Farol da Ponta',
  bg: 'tor',
  suspectsLabel: 'Quatro pessoas estavam na ponta na noite da tempestade',
  suspects: SUS,
  clues: CLUES,
  scenes: SC,
  met: [
    'Desligou a lâmpada do farol durante a tempestade e esperou o navio se aproximar das pedras',
    'Cortou a corda do bote para que ninguém saísse em socorro',
    'Trocou os avisos do diário de bordo para enganar a Marinha',
  ],
  mot: ['Esconder o contrabando que passava pela costa', 'Vingar-se de Joaquim por uma demissão', 'Ficar com a casa do farol'],
  win: {
    s: 'ar',
    m: 0,
    r: 0,
    text: [
      'Era Arlindo Souza. Joaquim descobriu que os barcos de carga traziam mercadoria sem nota e ameaçou denunciar tudo na manhã seguinte.',
      'Na noite da tempestade, Arlindo desligou a lâmpada à mão e deixou o navio se aproximar das pedras. Joaquim subiu para ver a luz e foi empurrado na escada. O rádio e as caixas sem nota fecharam o caso.',
    ],
  },
  ranks: [
    [8, 'Nenhum sinal escapou: o farol inteiro conta a história.'],
    [6, 'Caso difícil, resolvido com boa leitura da costa.'],
    [0, 'A luz voltou a acender depois que você chegou.'],
  ],
}
