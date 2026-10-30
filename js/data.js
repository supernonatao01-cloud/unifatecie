/* ============================================================
   DADOS DO SITE — UniFatecie (extraídos dos regulamentos e do info.txt)
   Para atualizar telefone, links ou valores, edite apenas este arquivo.
   ============================================================ */

window.UNI = {
  contato: {
    whatsappNumero: "5583991054923",          // formato internacional p/ wa.me
    whatsappExibicao: "(83) 99105-4923",
    endereco: "Avenida Comandante Vital Rolim, 1346 — Bairro Santa Cecília",
    referencia: "Próximo ao Hotel Oásis",
    cidade: "Cajazeiras — PB",
    mapa: "Avenida Comandante Vital Rolim, 1346, Santa Cecília, Cajazeiras, PB"
  },

  /* Matrícula agora é 100% via WhatsApp (mensagem pronta por item). Só resta o site institucional. */
  links: {
    site: "https://www.unifatecie.edu.br"
  },

  /* ---- Graduação EAD — Módulo 3/2026 ---- */
  grupos: {
    BASE: { nome: "Base", cheio: 225.00, campanha: 126.50, pontual: 76.50 },
    "01": { nome: "Grupo 01", cheio: 299.00, campanha: 151.66, pontual: 101.66 },
    "02": { nome: "Grupo 02", cheio: 330.00, campanha: 162.20, pontual: 112.20 },
    "03": { nome: "Grupo 03", cheio: 499.00, campanha: 219.66, pontual: 169.66 },
    "04": { nome: "Grupo 04", cheio: 799.00, campanha: 321.66, pontual: 271.66 },
    "05": { nome: "Grupo 05", cheio: 925.67, campanha: 364.73, pontual: 314.73 },
    "06": { nome: "Grupo 06", cheio: 996.67, campanha: 388.87, pontual: 338.87 }
  },

  /* [nome, grau, duração em anos, grupo, semipresencial?] */
  cursos: [
    // BASE (4)
    ["Design de Produto", "Tecnólogo", 1.5, "BASE", 0],
    ["Jogos Digitais", "Tecnólogo", 2, "BASE", 0],
    ["Produção Publicitária", "Tecnólogo", 1.5, "BASE", 0],
    ["Segurança no Trânsito", "Tecnólogo", 1.5, "BASE", 0],
    // 01 (3)
    ["Ciências Econômicas", "Bacharelado", 3, "01", 0],
    ["Processos Escolares", "Tecnólogo", 2, "01", 1],
    ["Teologia", "Bacharelado", 3, "01", 0],
    // 02 (55)
    ["Administração", "Bacharelado", 3, "02", 0],
    ["Análise e Desenvolvimento de Sistemas", "Tecnólogo", 2, "02", 0],
    ["Artes", "Licenciatura", 4, "02", 1],
    ["Artes Visuais", "Bacharelado", 3, "02", 0],
    ["Biblioteconomia", "Bacharelado", 3, "02", 0],
    ["Ciência do Futuro", "Tecnólogo", 1.5, "02", 0],
    ["Ciências Biológicas", "Bacharelado", 4, "02", 1],
    ["Ciências Biológicas", "Licenciatura", 4, "02", 1],
    ["Ciências Contábeis", "Bacharelado", 3, "02", 0],
    ["Comércio Exterior", "Tecnólogo", 1.5, "02", 0],
    ["Design de Interiores", "Tecnólogo", 1.5, "02", 0],
    ["Design de Moda", "Tecnólogo", 1.5, "02", 0],
    ["Design Gráfico", "Tecnólogo", 1.5, "02", 0],
    ["Educação Especial", "Licenciatura", 4, "02", 1],
    ["Educação Física", "Bacharelado", 4, "02", 1],
    ["Educação Física", "Licenciatura", 4, "02", 1],
    ["Filosofia", "Licenciatura", 4, "02", 1],
    ["Gastronomia", "Tecnólogo", 1.5, "02", 0],
    ["Geografia", "Licenciatura", 4, "02", 1],
    ["Gestão Ambiental", "Tecnólogo", 2, "02", 1],
    ["Gestão Comercial", "Tecnólogo", 1.5, "02", 0],
    ["Gestão da Qualidade", "Tecnólogo", 1.5, "02", 0],
    ["Gestão de Produção Industrial", "Tecnólogo", 2.5, "02", 0],
    ["Gestão de Recursos Humanos", "Tecnólogo", 1.5, "02", 0],
    ["Gestão de Segurança Privada", "Tecnólogo", 1.5, "02", 0],
    ["Gestão do Agronegócio", "Tecnólogo", 2.5, "02", 0],
    ["Gestão Financeira", "Tecnólogo", 1.5, "02", 0],
    ["Gestão Hospitalar", "Tecnólogo", 3, "02", 0],
    ["Gestão Pública", "Tecnólogo", 1.5, "02", 0],
    ["História", "Licenciatura", 4, "02", 1],
    ["Hotelaria", "Tecnólogo", 1.5, "02", 0],
    ["Inteligência Artificial e Machine Learning", "Tecnólogo", 2, "02", 0],
    ["Investigação Forense e Perícia Criminal", "Tecnólogo", 3, "02", 0],
    ["Jornalismo", "Bacharelado", 4, "02", 0],
    ["Letras (Português/Inglês)", "Licenciatura", 4, "02", 1],
    ["Letras (Português/Libras)", "Licenciatura", 4, "02", 1],
    ["Logística", "Tecnólogo", 1.5, "02", 0],
    ["Marketing", "Tecnólogo", 1.5, "02", 0],
    ["Matemática", "Licenciatura", 4, "02", 1],
    ["Música", "Licenciatura", 4, "02", 1],
    ["Negócios Imobiliários", "Tecnólogo", 1.5, "02", 0],
    ["Pedagogia", "Licenciatura", 4, "02", 1],
    ["Processos Gerenciais", "Tecnólogo", 1.5, "02", 0],
    ["Processos Químicos", "Tecnólogo", 3, "02", 1],
    ["Psicopedagogia", "Bacharelado", 4, "02", 1],
    ["Publicidade e Propaganda", "Bacharelado", 4, "02", 0],
    ["Química", "Bacharelado", 3.5, "02", 1],
    ["Secretariado", "Tecnólogo", 1.5, "02", 0],
    ["Segurança da Informação", "Tecnólogo", 2, "02", 0],
    ["Segurança do Trabalho", "Tecnólogo", 2.5, "02", 0],
    ["Segurança Pública", "Tecnólogo", 1.5, "02", 0],
    ["Serviço Social", "Bacharelado", 4, "02", 1],
    ["Sistemas de Informação", "Bacharelado", 4, "02", 0],
    ["Sistemas para Internet", "Tecnólogo", 2, "02", 0],
    ["Sociologia", "Licenciatura", 4, "02", 1],
    // 03 (6)
    ["Agente Comunitário", "Tecnólogo", 2.5, "03", 1],
    ["Engenharia Ambiental e Sanitária", "Bacharelado", 5, "03", 1],
    ["Engenharia de Produção", "Bacharelado", 5, "03", 1],
    ["Engenharia de Software", "Bacharelado", 4, "03", 0],
    ["Estética e Cosmética", "Tecnólogo", 2.5, "03", 0],
    ["Terapias Integrativas e Complementares", "Tecnólogo", 2.5, "03", 1],
    // 04 (7)
    ["Arquitetura e Urbanismo", "Bacharelado", 5, "04", 1],
    ["Engenharia Agronômica (Agronomia)", "Bacharelado", 5, "04", 1],
    ["Engenharia Civil", "Bacharelado", 5, "04", 1],
    ["Engenharia da Computação", "Bacharelado", 4, "04", 0],
    ["Engenharia Elétrica", "Bacharelado", 5, "04", 1],
    ["Engenharia Mecânica", "Bacharelado", 5, "04", 1],
    ["Estudos Teóricos Psicanalíticos e Sociais", "Bacharelado", 4, "04", 0],
    // 05 (5)
    ["Biomedicina", "Bacharelado", 4, "05", 1],
    ["Farmácia", "Bacharelado", 4, "05", 1],
    ["Fisioterapia", "Bacharelado", 4, "05", 1],
    ["Nutrição", "Bacharelado", 4, "05", 1],
    ["Podologia", "Tecnólogo", 2.5, "05", 1],
    // 06 (3)
    ["Fonoaudiologia", "Bacharelado", 4, "06", 1],
    ["Radiologia", "Tecnólogo", 3, "06", 1],
    ["Terapia Ocupacional", "Bacharelado", 4, "06", 1]
  ],

  /* ---- Pós-Graduação EAD — Setembro/2026 ---- */
  pos: {
    destaque: [
      { nome: "Atendimento Educacional Especializado — AEE", meses: 3, horas: 360 },
      { nome: "Educação Especial e Inclusiva — Neuropedagogia e Psicomotricidade", meses: 4, horas: 360 },
      { nome: "Psicopedagogia Institucional e Clínica", meses: 7, horas: 820, estagio: true },
      { nome: "Gestão Escolar", meses: 4, horas: 360 },
      { nome: "Engenharia de Segurança do Trabalho", meses: 6, horas: 750, parcela: 149.90 }
    ],
    clusters: [
      {
        id: "educacao", nome: "Educação", qtd: 44, parcela: 29.90,
        cursos: ["Alfabetização e Letramento", "Educação Infantil", "Neuropsicologia Educacional", "Transtorno do Espectro Autista — TEA", "Ludopedagogia", "Ensino de Inglês", "Educação Física Escolar", "Educação de Jovens e Adultos"]
      },
      {
        id: "gestao", nome: "Gestão e Negócios", qtd: 58, parcela: 47.90,
        cursos: ["Marketing Digital", "Gestão de Pessoas e Desenvolvimento Humano", "Logística e Operações", "Negócios Imobiliários", "Controladoria e Custos", "MBA em Gestão de Projetos e Inovação", "MBA em Gestão Avançada e Liderança Transformadora", "Gestão Comercial e Vendas"]
      },
      {
        id: "engenharia", nome: "Engenharia e Arquitetura", qtd: 11, parcela: 47.90,
        cursos: ["Engenharia de Software", "Gerenciamento de Obras", "Segurança contra Incêndio e Pânico", "Arquitetura e Urbanismo", "Construções Verdes", "Engenharia de Software e Segurança da Informação", "MBA em Gestão da Produção Industrial", "Solos e Nutrição de Plantas"]
      },
      {
        id: "direito", nome: "Direito", qtd: 8, parcela: 47.90,
        cursos: ["Direito Constitucional", "Direito Penal", "Direito do Trabalho e Previdenciário", "Direito Tributário e Empresarial", "Segurança Pública", "Saúde Ocupacional e Direito do Trabalho", "Direito Constitucional e Prática", "Direito, Psicologia e Gestão de Conflitos Laborais"]
      },
      {
        id: "saude", nome: "Saúde e Bem-Estar", qtd: 20, parcela: 57.90,
        cursos: ["Administração Hospitalar e Serviços de Saúde", "Auditoria em Saúde", "Enfermagem do Trabalho", "Nutrição Clínica e Dietética", "Procedimentos Injetáveis", "Personal Trainer", "Psicologia Clínica e Saúde Mental", "Saúde Pública"]
      },
      {
        id: "ia", nome: "Inovação (IA)", qtd: 10, parcela: 57.90,
        cursos: ["Inteligência Artificial e Ciência de Dados", "IA Generativa: Inovação, Automação e Produtividade", "Inteligência Artificial na Educação", "MBA Executivo em Inteligência Artificial", "MBA em Inbound Marketing com ênfase em IA", "MBA em Marketing Digital com ênfase em IA", "MBA em Liderança para o Futuro", "Letramento Digital e IA na Educação"]
      }
    ]
  },

  /* ---- Polos ---- */
  polos: [
    { id: "cajazeiras", nome: "Cajazeiras", uf: "PB", lat: -6.8897, lon: -38.5561, mega: true },
    { id: "sjp", nome: "São José de Piranhas", uf: "PB", lat: -7.1219, lon: -38.4983 },
    { id: "patos", nome: "Patos", uf: "PB", lat: -7.0247, lon: -37.2801 },
    { id: "itaporanga", nome: "Itaporanga", uf: "PB", lat: -7.3033, lon: -38.1517 },
    { id: "pombal", nome: "Pombal", uf: "PB", lat: -6.7704, lon: -37.8016 },
    { id: "ico", nome: "Icó", uf: "CE", lat: -6.3996, lon: -38.8545 },
    { id: "caico", nome: "Caicó", uf: "RN", lat: -6.4587, lon: -37.0978 },
    { id: "jaboatao", nome: "Jaboatão dos Guararapes", uf: "PE", lat: -8.1130, lon: -35.0147 }
  ]
};
