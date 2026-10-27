import type { Case, Clue, SceneData, Suspect } from '../types'

const SUS: Suspect[] = [
  {
    id: 'bia',
    name: 'Bianca Bertoni',
    role: 'Filha, gerente comercial, 38 anos',
    ini: 'B',
    qs: [
      ['Onde você estava às 21h?', 'Na sala de degustação, servindo os convidados da vindima ao lado da tia Irene. Só saí às 21h30.'],
      ['Como era sua relação com seu pai?', 'Brigávamos por causa da vinícola. Ele decidia tudo sozinho. Mas era meu pai.'],
      ['Sabia de planos de venda?', 'Boatos. Ninguém nunca me mostrou nada.'],
    ],
    re: {
      c5: ['Então ele ia vender mesmo, sem me contar. Eu ia perder tudo o que construí aqui. Sim, fiquei com raiva. Mas não encostei nele.', 'adm'],
      c4: ['Está aí. Eu e a tia Irene, a noite toda servindo.', 'clear'],
      c1: ['Esse painel é do Dante e do Luiz. Eu nem sei ligar aquilo.'],
      c2: ['Meu pai nunca entrava no lagar sem o detector. Nunca.'],
      c3: ['Livro de lotes é com o enólogo.'],
      c6: ['Que laudo? Meu pai não me mostrou nada disso.'],
      c7: ['O Dante disse que não saiu da degustação... isso não bate.'],
      c8: ['O Luiz estava na colheita. Eu vi as luzes do trator da janela.'],
    },
  },
  {
    id: 'ire',
    name: 'Irene Rossi',
    role: 'Irmã de Ângelo, enoturismo, 61 anos',
    ini: 'I',
    qs: [
      ['Onde você estava às 21h?', 'Na degustação com a Bianca. Servi vinho para trinta pessoas.'],
      ['Como era a relação com seu irmão?', 'Dividimos esta terra por quarenta anos. Discutíamos por tudo, mas a gente se amava.'],
      ['A vinícola tinha problemas?', 'Todo ano tem. Mas a safra deste ano estava linda.'],
    ],
    re: {
      c4: ['Eu anotei cada convidado. Estávamos lá, eu e a Bianca.', 'clear'],
      c5: ['Eu sabia da proposta. Ele me pediu segredo. Eu não queria vender, claro. Esta terra é a minha vida.', 'adm'],
      c7: ['O Dante voltou para a sala suado, perto das 21h15. Achei que fosse o calor.'],
      c1: ['Eu nunca desço ao lagar à noite. O cheiro de mosto me dá dor de cabeça.'],
      c2: ['Ele tinha esse detector havia anos. Era supersticioso.'],
      c3: ['Número de garrafa é com o Dante.'],
      c6: ['Meu Deus... a vinícola estava podre por dentro?'],
      c8: ['O Luiz sempre fica no trator quando tem colheita noturna.'],
    },
  },
  {
    id: 'lui',
    name: 'Luiz Carvalho',
    role: 'Operador de lagar, 44 anos',
    ini: 'L',
    qs: [
      ['Onde você estava às 21h?', 'Colhendo no talhão do fundo, com o trator. Desde as 20h30.'],
      ['Quem mexe no painel do lagar?', 'Eu e o Dante. A chave fica comigo e com ele.'],
      ['Tinha algum problema com o patrão?', 'Ele cobrava por tudo, mas pagava em dia. Eu devo muito a ele.'],
    ],
    re: {
      c8: ['Pode olhar o GPS. Eu não saí do talhão do fundo.', 'clear'],
      c1: ['Deixei o exaustor ligado às 20h30. Quem desligou foi outra pessoa.'],
      c7: ['Esse cartão é do Dante, não é o meu.'],
      c2: ['O detector está sempre com pilha nova. Eu mesmo troquei na segunda.'],
      c3: ['Não me meto com lote nem com rótulo.'],
      c4: ['Eu não estava na degustação.'],
      c5: ['Venda? Então eu perderia o emprego também...'],
      c6: ['Isso eu nunca vi.'],
    },
  },
  {
    id: 'dan',
    name: 'Dante Ferraz',
    role: 'Enólogo, 52 anos',
    ini: 'D',
    qs: [
      ['Onde você estava às 21h?', 'Na sala de degustação, apresentando os rótulos aos convidados. Só saí de lá depois das 21h15.'],
      ['Qual era sua relação com Ângelo?', 'Vinte e dois anos de casa. Mais que patrão, quase um irmão.'],
      ['Como está o Reserva 2019?', 'O melhor vinho que já fizemos. Vendeu tudo.'],
    ],
    re: {
      c7: ['(pausa) Passei no lagar por um minuto, para conferir a temperatura dos tanques. Esqueci de mencionar.', 'contra'],
      c3: ['O rendimento da barrica varia, a evaporação é grande. Está tudo dentro do normal.', 'crack'],
      c6: ['Esse laudo foi mal interpretado! Laboratório de fora não conhece o nosso processo!', 'crack'],
      c1: ['O exaustor falha sempre. Eu já avisei que está velho.'],
      c2: ['Pilha de detector acaba. Ele é que devia ter conferido.'],
      c4: ['Eu assino a entrada. Ninguém assina para sair.'],
      c5: ['Eu era contra vender, sim. Como todo mundo aqui.'],
      c8: ['O Luiz estava lá fora. Ele sempre foge do lagar quando tem colheita.'],
    },
  },
]

const CLUES: Clue[] = [
  { id: 'c1', sc: 'alg', t: 'Painel da ventilação', x: 'O exaustor do lagar foi desligado à mão às 20h52, sem queda de energia. A chave do painel só está com Dante e Luiz.' },
  { id: 'c2', sc: 'alg', t: 'Detector de CO₂ sem pilhas', x: 'O detector portátil que Ângelo levava a cada ronda estava na bancada, com o compartimento aberto e vazio. As pilhas não estavam por perto.' },
  { id: 'c3', sc: 'aad', t: 'Livro de lotes', x: 'Reserva 2019: as barricas renderam 2.400 garrafas, mas foram rotuladas e vendidas 7.800. Assinado: D. Ferraz.' },
  { id: 'c4', sc: 'aad', t: 'Livro de visitas da degustação', x: 'Bianca e Irene aparecem servindo das 20h30 às 21h30. Dante assinou a entrada às 20h35 e voltou à sala só às 21h15. Nada entre os dois horários.' },
  { id: 'c5', sc: 'aof', t: 'Proposta de venda', x: 'Proposta do grupo Altavista para comprar a Vinícola Aurora, já com a assinatura de Ângelo. Bianca e Irene não sabiam, e perderiam o controle da terra.' },
  { id: 'c6', sc: 'aof', t: 'Laudo do laboratório', x: 'Análise do grupo comprador: o \"Reserva 2019\" tem a mesma composição do tinto de mesa. Na margem, a letra de Ângelo: \"Dante. Amanhã, 8h, no escritório. Quero explicação.\"' },
  { id: 'c7', sc: 'apa', t: 'Registro do cartão de acesso', x: 'Às 20h48, o cartão de Dante Ferraz abre a porta do lagar. Ele sai às 21h05. Nenhum outro cartão passou ali depois das 20h30.' },
  { id: 'c8', sc: 'apa', t: 'GPS do trator', x: 'O trator de Luiz ficou parado no talhão do fundo das 20h30 às 21h30, longe do lagar, com o motor ligado e o arado em uso.' },
]

const SC: Record<string, SceneData> = {
  aad: { n: 'Adega', d: 'Barricas empilhadas, cheiro de carvalho e vinho velho. A degustação ainda tem taças pela metade.', h: [['c3', 103, 126], ['c4', 313, 108]] },
  alg: { n: 'Lagar', d: 'Tanques de aço, tubulação e o zumbido do silêncio. Ângelo foi achado aqui às 21h45.', h: [['c1', 314, 118], ['c2', 176, 130]] },
  aof: { n: 'Escritório', d: 'Pastas, uma janela para o parreiral e um quadro de avisos que não foi feito para ficar à vista.', h: [['c5', 160, 124], ['c6', 310, 76]] },
  apa: { n: 'Parreiral', d: 'Fileiras de videiras sob a lua, a guarita da entrada e um trator ainda aceso no fundo.', h: [['c7', 292, 115], ['c8', 70, 132]] },
}

export const aurora: Case = {
  id: 'aurora',
  key: 'cases-stories-aurora-v1',
  theme: 'aurora',
  no: '003',
  title: 'O Caso Aurora',
  titleLines: ['O Caso', 'Aurora'],
  kind: 'Dossiê confidencial · Morte suspeita',
  tagline: 'Uma safra perfeita. Um segredo na adega.',
  synopsis:
    'Noite de colheita na Vinícola Aurora. O patriarca é achado morto no lagar, sem um arranhão. Parecia descuido, até alguém conferir os rótulos.',
  place: 'Vinícola Aurora',
  difficulty: 2,
  bg: 'aad',
  suspectsLabel: 'Quatro pessoas conheciam o lagar',
  suspects: SUS,
  clues: CLUES,
  scenes: SC,
  met: [
    'Desligou a ventilação do lagar e tirou as pilhas do detector de CO₂ enquanto Ângelo fazia a ronda',
    'Envenenou a taça de prova que Ângelo bebeu na degustação',
    'Empurrou Ângelo pela escada da adega',
  ],
  mot: [
    'Esconder a fraude nos rótulos, que a venda da vinícola ia revelar',
    'Impedir a venda da vinícola e proteger a terra da família',
    'Herdar a parte de Ângelo no negócio',
  ],
  win: {
    s: 'dan',
    m: 0,
    r: 0,
    text: [
      'Era Dante Ferraz. Havia anos, ele vendia como Reserva um vinho comum, e a venda da vinícola traria auditores para a adega. O laudo do comprador provou a fraude, e Ângelo marcou uma conversa para as 8h da manhã seguinte.',
      'Dante não esperou: tirou as pilhas do detector, desligou o exaustor e deixou o ar parado do lagar fazer o resto. O cartão de acesso e o livro de visitas desmontaram o álibi.',
    ],
  },
  ranks: [
    [8, 'Detetive exemplar, nenhum detalhe escapou.'],
    [6, 'Olfato de enólogo, quase nada escapou.'],
    [0, 'Instinto afiado, resolvido com poucas pistas.'],
  ],
}
