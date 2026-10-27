/* Arquivo de cada cômodo: desbloqueia ao examinar todos os objetos dele. */
export const ARQUIVO: Record<string, Record<string, string>> = {
  valverde: {
    esc: 'Augusto guardava documentos num cofre atrás da lareira. A chave ficou sempre com o médico da família, desde a última cirurgia.',
    coz: 'A cozinha tinha um livro de recados diário. Marta anotava horários de bandeja, e a letra às vezes muda de um dia para o outro.',
    bib: 'Na biblioteca, Augusto discutia a venda da propriedade em voz alta. Os papéis revirados eram propostas de compra recusadas.',
    qua: 'O quarto de hóspedes foi preparado às pressas para o doutor. A mala aberta tem uma caixa de cápsulas que não era dele.',
  },
  imperial: {
    cam: 'O camarim era dividido por cortinas. Atrizes e técnicos trocavam recados por ali, e as cartas de ameaça chegaram por esse caminho.',
    pal: 'O tablado tinha uma varanda técnica de onde se fazia a iluminação das cenas. O guarda-corpo foi reforçado depois de um acidente antigo.',
    bil: 'A bilheteria anotava cada ingresso vendido. O caixa estava abaixo do esperado, e o livro de contagem foi refeito na madrugada.',
    cab: 'Na cabine de luz, cada programação ficava registrada no sistema. Um histórico de comandos mostra quem apagou o palco e quando.',
  },
  aurora: {
    aad: 'A adega guardava barricas de duas safras. Os rótulos da reserva não batiam com os livros de lotes, algo que só o enólogo podia explicar.',
    alg: 'O lagar tinha um detector de CO₂ que disparava alarmes com frequência. As pilhas eram trocadas toda semana pelo operador.',
    aof: 'No escritório, um quadro de avisos listava as visitas dos compradores. Um dos nomes aparece com um X ao lado, como se tivesse desistido.',
    apa: 'O parreiral é cercado por um muro baixo e uma guarita. O portão ficava trancado depois das 20h, mas nunca de fato.',
  },
  origem: {
    of_hal: 'A porta da frente tinha uma fechadura simples, sem sinal de arrombamento. Quem entrou tinha uma chave ou esperava que alguém abrisse.',
    of_jan: 'A sala de jantar é onde a família se reúne aos domingos. Foi ali que a discussão sobre o testamento começou, segundo a empregada.',
    of_esc: 'A caixa de joias pertencia à avó de Clara e nunca saiu da casa. Ela só era aberta em ocasiões especiais.',
    of_qua: 'O quarto de hóspedes é o único com janela voltada para o portão. De lá, dá para ver quem chega e quem sai da propriedade.',
  },
  farol: {
    tor: 'A torre tem 132 degraus. A lâmpada gira com um motor elétrico, e a chave de desligamento manual fica numa caixa de ferro na base.',
    cas: 'A casa do faroleiro guarda o diário de bordo, onde cada turno registra avisos aos navios. As anotações da última semana foram escritas com outra caneta.',
    anc: 'O ancoradouro recebe os barcos de carga que passam pela costa. Sem sinal do farol, as embarcações da noite seguem por uma rota perigosa.',
    dep: 'O depósito guarda óleo, combustível e caixas que chegam sem nota fiscal. Um rádio sintonizado numa frequência de navio fica sempre ligado.',
  },
  trem: {
    vag: 'O vagão-restaurante serve jantar até as 23h. As taças são lavadas por um funcionário, e um armário de vidro guarda as que estão fora de uso.',
    cab: 'As cabines do trem são pequenas e ficam trancadas por dentro. Cada passageiro recebe uma chave, e a da cabine 7 não foi devolvida.',
    pla: 'A parada de madrugada é só para cargas e alguns passageiros. Não há funcionário na plataforma depois da meia-noite.',
    loc: 'A locomotiva registra cada parada em um diário de bordo. Uma parada sem autorização aparece como erro no painel do maquinista.',
  },
  silencio: {
    esp: 'A sala de espelhos foi usada para ensaios com gravação. Os espelhos cobrem as paredes para que a acústica fique controlada.',
    por: 'O porão guarda o gerador e as caixas de som que alimentavam as gravações noturnas. Só o zelador tinha a chave do gerador.',
    jar: 'O jardim de inverno é fechado com vidro e aquecido. Plantas sensíveis ao frio ficam ali, e a estufa é aberta todas as noites.',
    sot: 'No sótão ficam os arquivos de fitas magnéticas. Cada fita tem uma etiqueta com a data da gravação, e algumas faltam.',
  },
  galeria: {
    gal: 'A galeria expõe apenas obras autenticadas. Cada quadro tem uma ficha com histórico de proprietários, e uma delas nunca teve procedência clara.',
    res: 'O ateliê de restauro é fechado por dentro. Os restauradores usam solventes fortes, e o cheiro fica preso no ambiente por horas.',
    cof: 'O cofre guardava os contratos da galeria e os laudos originais. A combinação era conhecida por poucas pessoas da família e da curadoria.',
    ter: 'O terraço dá para o pátio dos fundos. A grade baixa é uma passagem conhecida pelos funcionários que fumam no fim do expediente.',
  },
}
