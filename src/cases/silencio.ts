import type { Case, Clue, SceneData, Suspect } from '../types'

/* Caso 007 · Desafio. Pistas mais escondidas e só abre ao zerar os outros casos. */
const SUS: Suspect[] = [
  {
    id: 'ol',
    name: 'Olívia Renner',
    role: 'Pianista, 34 anos',
    ini: 'O',
    qs: [
      ['Onde você estava na noite do sumiço?', 'Ensaiando na sala de espelhos, até as 23h. Depois fui dormir.'],
      ['Você tinha ciúmes da Lorena?', 'Ela era a compositora. Eu só tocava o que ela escrevia.'],
      ['Ouviu algum barulho?', 'Nenhum. A casa é isolada. Só o ruído do gerador.'],
    ],
    re: {
      c2: ['Eu não rasguei partitura nenhuma. Sei o que ela ensaiava.', 'contra'],
      c5: ['A estufa fica fechada à noite. Só o jardineiro tem a chave.', 'clear'],
    },
  },
  {
    id: 'ca',
    name: 'Caetano Moura',
    role: 'Ex-marido, 45 anos',
    ini: 'C',
    qs: [
      ['Onde você estava às 23h?', 'No jardim, fumando e pensando. A chuva parou tarde.'],
      ['Por que se separaram?', 'Ela trabalhava demais e não me deixava entrar no estúdio.'],
      ['Você tinha acesso ao sótão?', 'Não. As fitas são coisa dela.'],
    ],
    re: {
      c7: ['Essas fitas são da Lorena. Eu nunca as toquei.', 'contra'],
      c8: ['Eu não cortei fita nenhuma. Ela cortava as próprias gravações.', 'adm'],
    },
  },
  {
    id: 'be',
    name: 'Benedita Sousa',
    role: 'Governanta, 60 anos',
    ini: 'B',
    qs: [
      ['A senhora viu a Lorena naquela noite?', 'Vi, às 22h, levando chá. Ela estava nervosa, dizia que alguém a seguia.'],
      ['Quem tinha chave da casa?', 'Eu, a Lorena e o Hugo. Só nós três.'],
      ['Você sabia das gravações?', 'Sabia que existiam, mas Lorena não deixava ninguém ouvir.'],
    ],
    re: {
      c1: ['O espelho já estava rachado. Foi uma queda antiga, de uma cadeira.'],
      c4: ['Essas pegadas são de salto. A Lorena usava salto em casa para ensaiar a postura.'],
    },
  },
  {
    id: 'hu',
    name: 'Hugo Lessa',
    role: 'Zelador, 48 anos',
    ini: 'H',
    qs: [
      ['Onde você estava à noite?', 'Cuidando do gerador, como faço toda semana. Não saí do porão.'],
      ['Você tem acesso aos cômodos?', 'Tenho a chave de todos, por causa da manutenção.'],
      ['Lorena confiava em você?', 'Muito. Por isso me deixava consertar tudo sozinho.'],
    ],
    re: {
      c3: ['Eu sempre desligo a caixa de som quando o gerador esquenta. Não há nada de estranho nisso.', 'crack'],
      c6: ['A estufa não é minha responsabilidade. Quem cuida é o jardineiro.', 'contra'],
    },
  },
]

const CLUES: Clue[] = [
  { id: 'c1', sc: 'esp', t: 'Espelho rachado de dentro', x: 'Uma rachadura no espelho saiu de dentro para fora, como se algo tivesse batido do outro lado.' },
  { id: 'c2', sc: 'esp', t: 'Partitura incompleta', x: 'A última página da partitura está faltando, com marcas de corte rente à costura.' },
  { id: 'c3', sc: 'por', t: 'Caixa de som desligada', x: 'A caixa de som do porão está desligada na tomada, mas o gerador ainda esquenta.' },
  { id: 'c4', sc: 'por', t: 'Pegadas na poeira', x: 'Pegadas de salto alto na poeira da escada, sem sinal de passos de volta.' },
  { id: 'c5', sc: 'jar', t: 'Estufa aberta à noite', x: 'A porta da estufa foi aberta com a chave do jardineiro, e não há sinal de arrombamento.' },
  { id: 'c6', sc: 'jar', t: 'Ração de gato espalhada', x: 'Ração espalhada perto da porta da estufa. A casa não tem gatos.' },
  { id: 'c7', sc: 'sot', t: 'Baú de fitas', x: 'O baú de fitas magnéticas está aberto, e as etiquetas das últimas gravações foram arrancadas.' },
  { id: 'c8', sc: 'sot', t: 'Fita cortada', x: 'Uma fita magnética cortada no meio, com a última gravação de Lorena antes do silêncio.' },
]

const SC: Record<string, SceneData> = {
  esp: { n: 'Sala de espelhos', d: 'Espelhos nas quatro paredes e um piano fechado. Lorena ensaiava aqui todas as noites.', h: [['c1', 72, 92], ['c2', 288, 90]] },
  por: { n: 'Porão', d: 'Caixas de som, o gerador zumbindo e a escada de madeira úmida. Ninguém vem aqui sem motivo.', h: [['c3', 300, 150], ['c4', 76, 108]] },
  jar: { n: 'Jardim de inverno', d: 'Vidro, calor e plantas úmidas. A estufa é fechada à noite e aberta de manhã.', h: [['c5', 204, 114], ['c6', 238, 172]] },
  sot: { n: 'Sótão', d: 'Vigas, caixas e o baú de fitas. A luz da janela entra fraca, e o pó marca cada passo.', h: [['c7', 186, 116], ['c8', 90, 124]] },
}

export const silencio: Case = {
  id: 'silencio',
  key: 'cases-stories-silencio-v1',
  theme: 'silencio',
  no: '007',
  title: 'O Caso do Silêncio',
  titleLines: ['O Caso do', 'Silêncio'],
  kind: 'Desafio · Morte suspeita',
  tagline: 'A música parou. Alguém sabe por quê.',
  synopsis:
    'Na casa de vidro, a compositora Lorena Vasques é achada morta no sótão. Desde então, as gravações da casa não tocam mais. Só quem zerou o arquivo inteiro chega até aqui.',
  place: 'Casa de Vidro',
  bg: 'esp',
  suspectsLabel: 'Quatro pessoas moravam ou trabalhavam na casa',
  suspects: SUS,
  clues: CLUES,
  scenes: SC,
  desafio: true,
  met: [
    'Golpe na nuca na sala de espelhos, depois de uma discussão',
    'Trancou Lorena no porão até a asfixia',
    'Empurrou Lorena pela escada do sótão',
  ],
  mot: ['Esconder as gravações que vendeu a um colecionador', 'Vingar-se de uma demissão recente', 'Herdar a casa pelo testamento antigo'],
  win: {
    s: 'hu',
    m: 0,
    r: 0,
    text: [
      'Era Hugo Lessa. Ele vendia as gravações de Lorena para um colecionador, e ela descobriu a venda na véspera.',
      'Hugo a encontrou na sala de espelhos e a feriu na nuca. Depois, levou o corpo para o sótão. As fitas cortadas e o gerador ligado sem motivo entregaram o zelador.',
    ],
  },
  ranks: [
    [8, 'Ouvido absoluto: nenhum som escapou.'],
    [6, 'Silêncio bem interpretado.'],
    [0, 'Silêncio quebrado, mas o caso foi resolvido.'],
  ],
}
