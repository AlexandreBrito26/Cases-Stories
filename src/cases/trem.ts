import type { Case, Clue, SceneData, Suspect } from '../types'

const SUS: Suspect[] = [
  {
    id: 'sa',
    name: 'Sandra Matos',
    role: 'Assessora de Renato, 38 anos',
    ini: 'S',
    qs: [
      ['Onde você estava à noite?', 'Na minha cabine, revisando os contratos da fusão.'],
      ['Renato tinha inimigos?', 'Todo negócio tem. Ele provocava quem perdia.'],
      ['Você viu Renato depois do jantar?', 'Só no corredor, por volta das 23h. Ele estava bem.'],
    ],
    re: {
      c4: ['A pasta é minha, mas o acordo não era para ser levado. Renato levava para casa.', 'adm'],
      c3: ['Ele sempre foi pontual. Nunca adiantou o relógio.', 'contra'],
    },
  },
  {
    id: 'mi',
    name: 'Miguel Torres',
    role: 'Maquinista, 50 anos',
    ini: 'M',
    qs: [
      ['Onde você estava às 2h?', 'No posto de comando, como sempre. Ninguém pode subir durante a viagem.'],
      ['Houve alguma parada não programada?', 'Não na minha conta. O diário está em ordem.'],
      ['Você tem acesso às cabines?', 'Só a chave mestra, que fica na caixa de ferramentas.'],
    ],
    re: {
      c7: ['Esse registro foi feito pelo meu ajudante. Eu não autorizei parada nenhuma.', 'contra'],
      c8: ['A chave mestra é minha. Ninguém pegou sem eu saber.', 'clear'],
    },
  },
  {
    id: 'eva',
    name: 'Eva Lund',
    role: 'Advogada da fusão, 42 anos',
    ini: 'E',
    qs: [
      ['Onde você estava na madrugada?', 'Dormindo no vagão-leito. Tomei um remédio para dormir.'],
      ['Você sabia do acordo de fusão?', 'Sabia. Renato queria fechar até o fim da semana.'],
      ['Gustavo estava no vagão-restaurante?', 'Estava. Jantamos juntos, mas ele saiu cedo.'],
    ],
    re: {
      c2: ['A conta foi paga pelo Gustavo, eu vi o cartão. Mas ele diz que não pagou.', 'contra'],
      c5: ['Eu vi um homem de sobretudo na plataforma. Não consegui ver o rosto.', 'clear'],
      c1: ['Essa taça não é do vagão. Nunca serviram vinho em taça de cristal lá.'],
    },
  },
  {
    id: 'gu',
    name: 'Gustavo Rocha',
    role: 'Sócio concorrente, 55 anos',
    ini: 'G',
    qs: [
      ['Onde você estava às 22h40?', 'No vagão-restaurante, pagando a conta da mesa de Renato como cortesia.'],
      ['Você tinha negócios com Renato?', 'Concorrência. Ele ganhou a última licitação.'],
      ['Você desceu na parada das 2h?', 'Não. Fiquei na cabine até o amanhecer.'],
    ],
    re: {
      c1: ['Renato sempre pedia vinho tinto. Eu nunca toquei na taça dele.', 'crack'],
      c6: ['Esse bilhete é meu, sim. Não usei porque mudei de planos.', 'contra'],
      c3: ['Não mexi em relógio nenhum. Pergunte ao maquinista.'],
    },
  },
]

const CLUES: Clue[] = [
  { id: 'c1', sc: 'vag', t: 'Taça com resíduo', x: 'Uma taça de vinho com resíduo escuro no fundo, guardada no armário e não na mesa.' },
  { id: 'c2', sc: 'vag', t: 'Conta sem assinatura', x: 'A conta da mesa de Renato saiu às 22h40, paga no cartão sem assinatura.' },
  { id: 'c3', sc: 'cab', t: 'Relógio adiantado', x: 'O relógio de bolso de Renato está adiantado em quarenta minutos. Alguém mexeu nele.' },
  { id: 'c4', sc: 'cab', t: 'Pasta revirada', x: 'A pasta de contratos foi revirada. Falta a cópia de um acordo de fusão.' },
  { id: 'c5', sc: 'pla', t: 'Vendedor ambulante', x: 'O vendedor viu um homem de sobretudo descer na parada das 2h, com uma maleta.' },
  { id: 'c6', sc: 'pla', t: 'Bilhete de embarque', x: 'Um bilhete de volta no trem seguinte, em nome de Gustavo Rocha, nunca usado.' },
  { id: 'c7', sc: 'loc', t: 'Parada sem autorização', x: 'O diário de bordo registra uma parada não programada às 2h10, sem autorização.' },
  { id: 'c8', sc: 'loc', t: 'Chave mestra', x: 'Uma chave de cabine guardada na caixa de ferramentas da locomotiva, que só a equipe tem.' },
]

const SC: Record<string, SceneData> = {
  vag: { n: 'Vagão-restaurante', d: 'Mesas de linho, taças e cheiro de café frio. Renato jantou aqui antes de subir para a cabine.', h: [['c1', 110, 118], ['c2', 260, 120]] },
  cab: { n: 'Cabine 7', d: 'Cama estreita, janela embaçada e a pasta do executivo aberta. Renato foi achado aqui às 3h.', h: [['c3', 260, 118], ['c4', 110, 115]] },
  pla: { n: 'Plataforma', d: 'A parada de madrugada, com luzes fracas e um vendedor fechando a barraca.', h: [['c5', 220, 130], ['c6', 90, 150]] },
  loc: { n: 'Locomotiva', d: 'Manômetros, alavancas e a caldeira em silêncio. O maquinista nunca deixa o posto durante a viagem.', h: [['c7', 180, 100], ['c8', 260, 120]] },
}

export const trem: Case = {
  id: 'trem',
  key: 'cases-stories-trem-v1',
  theme: 'trem',
  no: '006',
  title: 'O Caso Trem Noturno',
  titleLines: ['O Caso', 'Trem Noturno'],
  kind: 'Dossiê confidencial · Morte suspeita',
  tagline: 'Três horas de viagem. Uma cabine trancada por dentro.',
  synopsis:
    'No trem noturno para o norte, o executivo Renato Duarte é achado morto na cabine 7. A porta estava trancada por dentro, e o trem fez uma parada que ninguém havia autorizado.',
  place: 'Trem Noturno',
  bg: 'vag',
  suspectsLabel: 'Quatro pessoas estavam no trem naquela noite',
  suspects: SUS,
  clues: CLUES,
  scenes: SC,
  met: [
    'Envenenou a taça de vinho no vagão-restaurante',
    'Forjou o horário da morte mexendo no relógio de bolso',
    'Desceu na parada e voltou para a cabine sem ser visto',
  ],
  mot: ['Impedir a fusão que o tiraria do negócio', 'Vingar-se de uma humilhação pública', 'Herdar a parte de Renato na empresa'],
  win: {
    s: 'gu',
    m: 0,
    r: 0,
    text: [
      'Era Gustavo Rocha. Ele perderia a licitação e a fusão o deixaria de fora do negócio. Renato havia descoberto o plano na véspera.',
      'Gustavo envenenou a taça de vinho no jantar, desceu na parada das 2h e voltou pela plataforma. O relógio foi adiantado para dar um álibi. O bilhete e a conta sem assinatura fecharam o caso.',
    ],
  },
  ranks: [
    [8, 'Nenhum detalhe escapou, nem o relógio.'],
    [6, 'Boa leitura da viagem, quase nada escapou.'],
    [0, 'O trem chegou ao destino, e o caso também.'],
  ],
}
