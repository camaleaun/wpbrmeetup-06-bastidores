# Bastidores de Projetos com WordPress — roteiro

_Para pedir uma mudança, cite a cena e o número da frase, por exemplo: "wxr 2: trocar …". Gerado por review.mjs a partir de script.yaml._

## abertura — Abertura (0:00)

| # | Tempo | Narração |
|---|---|---|
| 1 | 0:00 | Olá! |
| 2 | 0:00 | Sou Gilberto Tavares, desenvolvedor WordPress profissionalmente desde 2012. |
| 3 | 0:05 | Vou falar os bastidores de como uma dor que se repete virou um plugin no diretório oficial, e o os aprendizados. |
| 4 | 0:11 | Meu primeiro plugin no diretório é o caso, não o assunto. |

## agencia — A agência (0:15)

| # | Tempo | Narração |
|---|---|---|
| 1 | 0:15 | Em julho de 2025, entrei numa agência dos Estados Unidos especializada em e-commerce. |
| 2 | 0:21 | A maioria dos projetos é Adobe Commerce, o Magento 2. |
| 3 | 0:24 | Também WordPress/WooCommerce e outros. |

## parceiro — O parceiro (0:27)

| # | Tempo | Narração |
|---|---|---|
| 1 | 0:27 | O WordPress vem de um parceiro que integra ERPs ao WooCommerce. |
| 2 | 0:31 | O layout fica com a gente, às vezes com o Figma. |
| 3 | 0:34 | Os anteriores eram Elementor. |
| 4 | 0:35 | O recente usa um tema performático, híbrido de blocos e clássico. |

## dupla — A dupla (0:40)

| # | Tempo | Narração |
|---|---|---|
| 1 | 0:40 | Somos dois desenvolvedores WordPress/WooCommerce. |
| 2 | 0:43 | Ele, primariamente Magento. |
| 3 | 0:45 | E eu, esse ano treinado na agência como o primeiro Shopware. |

## problema — O problema (0:49)

| # | Tempo | Narração |
|---|---|---|
| 1 | 0:49 | Qual é o problema? |
| 2 | 0:50 | O layout nasce no Figma. |
| 3 | 0:52 | No ambiente local, criamos menus, páginas, imagens e conteúdo. |
| 4 | 0:56 | Tudo isso precisa se repetir no staging ou em outro ambiente local. |
| 5 | 0:59 | Cliente, colega e gerente revisam visualmente. |
| 6 | 1:02 | Na prática, tudo é remontado. |

## versao — Versionar o conteúdo (1:05)

| # | Tempo | Narração |
|---|---|---|
| 1 | 1:05 | Queria versionar o conteúdo. |
| 2 | 1:07 | Como o WooCommerce. |
| 3 | 1:08 | Ou como migrations. |
| 4 | 1:09 | Mas acoplar conteúdo ao código parecia drástico. |
| 5 | 1:12 | Separar era o caminho. |

## ideia — A primeira tentativa (1:14)

| # | Tempo | Narração |
|---|---|---|
| 1 | 1:14 | Sugeri migrations e patches, e foi bem aceito. |
| 2 | 1:17 | O gerente vem do Magento, onde isso é natural. |
| 3 | 1:20 | Foi aceito o modelo JSON do Playground. |
| 4 | 1:23 | O colega liderou, alterando um pouco. |
| 5 | 1:25 | Até hoje, sem uso efetivo. |
| 6 | 1:27 | Também houve a questão de armazenar mídia sem inflar o Git. |

## wxr — As limitações do WXR (1:31)

| # | Tempo | Narração |
|---|---|---|
| 1 | 1:31 | Nessa nova solução, segui o exportador e o importador nativos. |
| 2 | 1:35 | Limitações conhecidas. |
| 3 | 1:36 | Exportar uma página leva todas. |
| 4 | 1:39 | O contorno é apagar as outras no local. |
| 5 | 1:41 | A mídia é outra exportação, sem juntar páginas e anexos. |
| 6 | 1:44 | Vários XML, ou um grande, e imagens dependendo de URL pública. |

## bundle — O bundle (1:49)

| # | Tempo | Narração |
|---|---|---|
| 1 | 1:49 | O Playground aceita um bundle em zip, com as imagens junto. |
| 2 | 1:53 | Montar o zip sem um gerador não compensa. |

## decisao — A decisão (1:56)

| # | Tempo | Narração |
|---|---|---|
| 1 | 1:56 | Decidi não reinventar. |
| 2 | 1:57 | Usar o exportador nativo e o importador oficial. |
| 3 | 2:00 | Acrescentar o que falta. |
| 4 | 2:02 | Assim nasceu o Eizport, antes Exporter Importer Z. |
| 5 | 2:05 | São três formatos. |
| 6 | 2:07 | XML num zip, para o importador com o Eizport. |
| 7 | 2:10 | O bundle do Playground, opcionalmente com temas e plugins. |
| 8 | 2:13 | E como plugin, que instala o necessário, importa e se exclui. |

## ia — A IA (2:17)

| # | Tempo | Narração |
|---|---|---|
| 1 | 2:17 | Utilizei Inteligência Artificial. |
| 2 | 2:20 | Comecei pelas skills oficiais do WordPress. |
| 3 | 2:22 | E criei as minhas próprias. |
| 4 | 2:24 | A cada sessão, o aprendizado entra nas minhas skills. |

## referencias — Código de referência (2:28)

| # | Tempo | Narração |
|---|---|---|
| 1 | 2:28 | A resposta de como o WordPress faz está no código. |
| 2 | 2:31 | Minha preferência: Gutenberg e WordPress. |
| 3 | 2:33 | Também plugins da Automattic: WooCommerce e Jetpack. |

## processo — O processo (2:37)

| # | Tempo | Narração |
|---|---|---|
| 1 | 2:37 | Cada funcionalidade começa com a IA no modo de planejamento. |
| 2 | 2:41 | Aprovado, segue no modo automático. |
| 3 | 2:43 | Se algo fica para depois, entra numa lista. |
| 4 | 2:46 | Sempre Git, mesmo local, e nos commits, revisão de diretrizes, qualidade, código e testes. |

## configuracoes — Preferência vira configuração (2:52)

| # | Tempo | Narração |
|---|---|---|
| 1 | 2:52 | Possíveis preferências já nascem como configuração. |
| 2 | 2:55 | Tela de exportar moderna, com componentes do Gutenberg. |
| 3 | 2:58 | Mas pode não substituir o Exportar. |
| 4 | 3:00 | Ou substituir, com a interface clássica. |
| 5 | 3:03 | O importador também pode ser clássico. |
| 6 | 3:05 | Outras configurações disponíveis. |

## documentacao — A documentação (3:08)

| # | Tempo | Narração |
|---|---|---|
| 1 | 3:08 | A documentação faz parte do desenvolvimento. |
| 2 | 3:11 | Os screenshots do site e do readme, e o vídeo, são gerados por automatização. |
| 3 | 3:15 | Mudou uma funcionalidade ou uma tela? |
| 4 | 3:17 | Regera documentação, telas e vídeo. |
| 5 | 3:20 | Assim nada fica fragmentado nem desatualizado. |

## padroes — Os padrões (3:23)

| # | Tempo | Narração |
|---|---|---|
| 1 | 3:23 | Seguir os padrões desde o começo evita reprovação no diretório. |
| 2 | 3:27 | Os padrões de código WPCS. |
| 3 | 3:29 | E o Plugin Check Plugin, o PCP, rodando a cada mudança. |

## diretorio — O diretório (3:34)

| # | Tempo | Narração |
|---|---|---|
| 1 | 3:34 | Criei um usuário no WordPress.org, que representa o projeto. |
| 2 | 3:37 | Esse usuário precisou ser liberado, porque foi considerado empresa. |
| 3 | 3:41 | Um voluntário explicou que empresa não pode responder no fórum como pessoa. |
| 4 | 3:45 | Depois, o envio da versão 1.0.0. |
| 5 | 3:48 | Fila longa, mas foram poucas interações em poucos dias, automática e manual, e a aprovação veio na 1.0.1, liberando a URL e o SVN. |
| 6 | 3:57 | Em breve sai a 1.2.0, com Live Preview e outras funcionalidades. |
| 7 | 4:02 | Ter um plugin publicado pode ser o diferencial numa contratação. |

## traducao — A tradução (4:06)

| # | Tempo | Narração |
|---|---|---|
| 1 | 4:06 | Sempre valorizei tradução: código em inglês, pronto para traduzir. |
| 2 | 4:10 | Palestrei sobre tradução no WordCamp Porto Alegre, em 2018, disponível no WordPress.tv, mas desatualizado. |
| 3 | 4:18 | Já desenvolvi com traduções. |
| 4 | 4:20 | Ao aprovar o plugin, o readme e o código foram importados, como sugestões. |
| 5 | 4:24 | O Fellyph Cintra encontrou o plugin, talvez pela tag e pela funcionalidade do Playground, e aprovou em poucas horas. |
| 6 | 4:31 | Obrigado, Fellyph Cintra! |
| 7 | 4:32 | Um único ajuste, que eu corrigi e foi aprovado. |
| 8 | 4:35 | Paralelamente, estou na fila para ser PTE. |

## licoes — O que fica (4:39)

| # | Tempo | Narração |
|---|---|---|
| 1 | 4:39 | O que fica desses bastidores? |
| 2 | 4:41 | Uma dor que se repete é um projeto esperando alguém. |
| 3 | 4:43 | Uma ideia aceita não é uma ideia usada: às vezes, é preciso retomar por outro caminho. |
| 4 | 4:48 | Use o que a plataforma já oferece antes de criar. |
| 5 | 4:51 | Automatize o que se repete, inclusive a documentação. |
| 6 | 4:54 | E publique: um plugin no diretório também conta a sua história. |

## apoio — Apoio (4:58)

| # | Tempo | Narração |
|---|---|---|
| 1 | 4:58 | Contribua com issues no GitHub ou no fórum, e no Apoia.se, inspirado no PainelWP, obrigado Daniel Kossmann, e os outros links nos QR codes, incluindo esta apresentação. |
| 2 | 5:08 | Obrigado! |

_Duração: 5:09._
