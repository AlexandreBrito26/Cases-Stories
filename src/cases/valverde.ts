import type { Case, Clue, SceneData, Suspect } from '../types'

const SUS: Suspect[] = [
  {
    id: 'cec',
    name: 'Cecília Valverde',
    role: 'Filha, advogada, 42 anos',
    ini: 'C',
    qs: [
      ['Onde você estava às 22h?', 'Na biblioteca, revisando uns papéis do escritório. Rodrigo passou por lá por volta das 22h30, já agitado.'],
      ['Como era a relação com seu pai?', 'Difícil. Ele controlava tudo e todos. Mas eu o respeitava.'],
      ['Sabia do novo testamento?', 'Ele ameaçava mudar, sim. Não sabia que tinha feito de fato.'],
    ],
    re: {
      c6: ['Então ele fez mesmo... Isso me dá um motivo, eu sei. Mas ninguém mata o pai por causa de uma herança.', 'adm'],
      c1: ['Meu pai tomava aqueles comprimidos há anos. Eu nunca encostei neles.'],
      c2: ['Extratos? Que extratos? Papai nunca me falou disso.'],
      c3: ['Eu não estava na cozinha. Pergunte à Marta.'],
      c7: ['O Dr. Heitor? Ele sempre foi como da família.'],
    },
  },
  {
    id: 'rod',
    name: 'Rodrigo Valverde',
    role: 'Filho, empresário, 38 anos',
    ini: 'R',
    qs: [
      ['Onde você estava às 22h?', 'No jardim de inverno, fumando para acalmar os nervos. Chovia, fiquei debaixo do telhado de vidro.'],
      ['Como era a relação com seu pai?', 'Ele me humilhava na frente de todos. Não vou fingir luto.'],
      ['Tem problemas financeiros?', 'Todo mundo tem problemas de dinheiro.'],
    ],
    re: {
      c5: ['Isso é entre mim e meus credores. Eu precisava do dinheiro, mas meu pai, vivo ou morto, nunca ia me dar nada.', 'adm'],
      c6: ['Uma fundação? Ele ia dar tudo a estranhos? Isso explica a gritaria do jantar.'],
      c1: ['Nunca toquei nesse organizador.'],
      c2: ['Extratos da clínica... do Heitor? Interessante.'],
      c7: ['Ah. O Heitor andou nervoso a noite toda, eu reparei.'],
    },
  },
  {
    id: 'mar',
    name: 'Dona Marta Brandão',
    role: 'Governanta, 61 anos',
    ini: 'M',
    qs: [
      ['Onde você estava às 22h?', 'Na cozinha, o tempo todo, arrumando a louça do jantar.'],
      ['Há quanto tempo trabalha aqui?', 'Trinta e dois anos. O senhor Augusto era duro, mas justo.'],
      ['Quem cuidava dos remédios dele?', 'Eu preparo a bandeja todo dia às 21h30, com as cápsulas do frasco de sempre.'],
    ],
    re: {
      c4: ['Está bem. Minha irmã está internada. Liguei do corredor às 21h50 e não quis que pensassem que eu abandonei o serviço.', 'clear'],
      c3: ['Foi o doutor Heitor quem levou a bandeja. Ele sempre se oferece quando o patrão está cansado.'],
      c1: ['Eu encho com as cápsulas do frasco, como sempre. Não troquei nada.'],
      c2: ['Eu não leio as cartas do patrão.'],
      c7: ['Meu Deus... isso estava no quarto do doutor?'],
    },
  },
  {
    id: 'hei',
    name: 'Dr. Heitor Lins',
    role: 'Médico da família, 58 anos',
    ini: 'H',
    qs: [
      ['Onde o senhor estava às 22h?', 'No salão, com os demais. Vi Augusto pela última vez no fim do jantar, por volta das 21h30.'],
      ['Qual era sua relação com Augusto?', 'Médico e amigo há 25 anos. Cuidava do coração dele.'],
      ['Do que ele morreu, doutor?', 'Parada cardíaca, imagino. Era previsível na idade dele.'],
    ],
    re: {
      c3: ['(pausa) Ah, sim... levei a bandeja rapidinho, só deixei na mesa. Esqueci de mencionar.', 'contra'],
      c1: ['Marta enche aquilo todo dia. Não sei de quem foi o erro.'],
      c2: ['Augusto vivia ameaçando todo mundo. Isso não significa nada.'],
      c5: ['Problemas do Rodrigo. Não me envolvem.'],
      c6: ['Eu não sabia do testamento.'],
      c7: ['Isso é uma invasão! Digoxina é o meu trabalho. O frasco está vazio porque acabou... (a voz falha)', 'crack'],
      c8: ['Minha agenda é pessoal. Ninguém tinha o direito de ler.', 'crack'],
    },
  },
]

const CLUES: Clue[] = [
  { id: 'c1', sc: 'esc', t: 'Organizador de comprimidos', x: 'Os compartimentos de hoje têm cápsulas mais pesadas, cheias de um pó branco. O resto da semana está normal. Alguém trocou o conteúdo.' },
  { id: 'c2', sc: 'esc', t: 'Carta queimada', x: 'Rascunho meio queimado na lareira: "Heitor, tenho os extratos da clínica e sei para onde foi o dinheiro. Amanhã falo com a polícia." Assinado A. Valverde.' },
  { id: 'c3', sc: 'coz', t: 'Quadro de recados', x: 'Recado de Marta: "21h30 bandeja pronta. 22h00 Dr. Heitor levou a bandeja ao Sr. Augusto."' },
  { id: 'c4', sc: 'coz', t: 'Caderno do telefone', x: 'Ligação do telefone do corredor às 21h50 para o Hospital São Lucas, 30 minutos. Registrada por Marta.' },
  { id: 'c5', sc: 'bib', t: 'Cartas de cobrança', x: 'Cobranças em nome de Rodrigo: R$ 380 mil em atraso e aviso de execução judicial.' },
  { id: 'c6', sc: 'bib', t: 'Minuta do testamento', x: 'Assinada ontem: a maior parte do patrimônio vai para uma fundação. Cecília e Rodrigo ficam com muito menos.' },
  { id: 'c7', sc: 'qua', t: 'Maleta médica', x: 'Maleta do Dr. Heitor: um frasco vazio de digoxina e cápsulas de gelatina vazias, do mesmo tipo do organizador. Em excesso, a digoxina para o coração.' },
  { id: 'c8', sc: 'qua', t: 'Agenda de Heitor', x: 'Página marcada: "Pagar Carvalho, R$ 900 mil, sexta". Ao lado, anotações de transferências da conta da clínica.' },
]

const SC: Record<string, SceneData> = {
  esc: { n: 'Escritório', d: 'A lareira ainda guarda brasas. O corpo de Augusto Valverde foi encontrado aqui às 22h40, na poltrona, o rosto sereno demais.', h: [['c1', 178, 128], ['c2', 298, 150]] },
  coz: { n: 'Cozinha', d: 'Louça empilhada e o cheiro de café frio. A governanta jura que não saiu daqui.', h: [['c3', 78, 70], ['c4', 286, 138]] },
  bib: { n: 'Biblioteca', d: 'Estantes até o teto. Alguém discutiu aqui durante o jantar, e a mesa ainda guarda papéis revirados.', h: [['c5', 128, 138], ['c6', 282, 100]] },
  qua: { n: 'Quarto de hóspedes', d: 'O doutor Heitor dorme aqui quando a noite avança. A mala continua aberta.', h: [['c7', 84, 152], ['c8', 148, 128]] },
}

const MET = [
  'Trocou as cápsulas do remédio por uma dose letal de digoxina',
  'Envenenou o vinho servido no jantar',
  'Colocou veneno no café da noite',
]

const MOT = [
  'Impedir que Augusto o denunciasse pelo desvio de dinheiro da clínica',
  'Ficar com a herança do testamento',
  'Vingança por uma briga antiga',
]


export const valverde: Case = {
  id: 'valverde',
  key: 'caso-valverde-v1',
  theme: 'valverde',
  no: '001',
  title: 'O Caso Valverde',
  titleLines: ['O Caso', 'Valverde'],
  kind: 'Dossiê confidencial · Homicídio',
  tagline: 'Uma noite de chuva. Quatro suspeitos. Uma só verdade.',
  synopsis:
    'Uma mansão isolada pela tempestade. O patriarca da família é encontrado na poltrona do escritório, sereno demais. Só quatro pessoas estavam na casa.',
  place: 'Mansão Valverde',
  difficulty: 2,
  bg: 'esc',
  suspectsLabel: 'Quatro pessoas estavam na casa',
  suspects: SUS,
  clues: CLUES,
  scenes: SC,
  met: MET,
  mot: MOT,
  win: {
    s: 'hei',
    m: 0,
    r: 0,
    text: [
      'Era o Dr. Heitor Lins. Desviava dinheiro da clínica para pagar uma dívida de R$ 900 mil. Augusto descobriu e ia à polícia na manhã seguinte. Heitor se ofereceu para levar a bandeja às 22h, trocou as cápsulas por uma dose letal de digoxina e deixou o coração do velho fazer o resto.',
    ],
  },
  ranks: [
    [8, 'Detetive exemplar, nenhuma pista escapou.'],
    [6, 'Olho clínico, quase nada escapou.'],
    [0, 'Intuição afiada, resolvido com poucas pistas.'],
  ],
}
