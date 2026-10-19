# Bastidores de Projetos com WordPress — roteiro

_Para pedir uma mudança, cite a cena e o número da frase, por exemplo: "wxr 2: trocar …". Gerado por review.mjs a partir de script.yaml._

## abertura — Abertura (0:00)

| # | Tempo | Narração |
|---|---|---|
| 1 | 0:00 | Olá! |
| 2 | 0:00 | Sou Gilberto Tavares, desenvolvedor WordPress desde 2012. |
| 3 | 0:05 | Estes são os bastidores de como uma dor que se repete virou um plugin no diretório oficial. |
| 4 | 0:10 | Meu primeiro plugin no diretório é o caso, não o assunto. |

## agencia — A agência (0:14)

| # | Tempo | Narração |
|---|---|---|
| 1 | 0:14 | Desde julho de 2025, trabalho numa agência americana de e-commerce. |
| 2 | 0:19 | A maioria dos projetos é Adobe Commerce, o Magento 2. |
| 3 | 0:23 | Também WordPress/WooCommerce e outros. |

## parceiro — O parceiro (0:26)

| # | Tempo | Narração |
|---|---|---|
| 1 | 0:26 | O WordPress vem de um parceiro que integra ERPs ao WooCommerce. |
| 2 | 0:30 | O layout fica com a gente, às vezes com o Figma. |
| 3 | 0:33 | Os anteriores eram Elementor. |
| 4 | 0:35 | O recente usa um tema performático, híbrido de blocos e clássico. |

## dupla — A dupla (0:40)

| # | Tempo | Narração |
|---|---|---|
| 1 | 0:40 | Somos dois desenvolvedores WordPress/WooCommerce. |
| 2 | 0:43 | Ele, primariamente Magento. |
| 3 | 0:45 | E eu, esse ano treinado na agência como o primeiro Shopware. |

## problema — O problema (0:50)

| # | Tempo | Narração |
|---|---|---|
| 1 | 0:50 | Qual é o problema? |
| 2 | 0:51 | O layout nasce no Figma. |
| 3 | 0:53 | No ambiente local, criamos menus, páginas, imagens e conteúdo. |
| 4 | 0:57 | Tudo isso precisa se repetir no staging ou em outro ambiente local. |
| 5 | 1:01 | Cliente, colega e gerente revisam visualmente. |
| 6 | 1:04 | Na prática, tudo é remontado. |

## versao — Versionar o conteúdo (1:07)

| # | Tempo | Narração |
|---|---|---|
| 1 | 1:07 | Queria versionar o conteúdo. |
| 2 | 1:09 | Como o WooCommerce. |
| 3 | 1:10 | Ou como migrations. |
| 4 | 1:12 | Mas acoplar conteúdo ao código parecia drástico. |
| 5 | 1:15 | Separar era o caminho. |

## ideia — A primeira tentativa (1:17)

| # | Tempo | Narração |
|---|---|---|
| 1 | 1:17 | Sugeri migrations e patches, e foi bem aceito. |
| 2 | 1:20 | O gerente vem do Magento, onde isso é natural. |
| 3 | 1:23 | Foi aceito o modelo JSON do Playground. |
| 4 | 1:26 | O colega liderou, alterando um pouco. |
| 5 | 1:29 | Até hoje, sem uso efetivo. |
| 6 | 1:31 | Também houve a questão de armazenar mídia sem inflar o Git. |

## wxr — As limitações do WXR (1:35)

| # | Tempo | Narração |
|---|---|---|
| 1 | 1:35 | Nessa nova solução, segui o exportador e o importador nativos. |
| 2 | 1:39 | Limitações conhecidas. |
| 3 | 1:41 | Exportar uma página leva todas. |
| 4 | 1:43 | O contorno é apagar as outras no local. |
| 5 | 1:46 | A mídia é outra exportação, sem juntar páginas e anexos. |
| 6 | 1:49 | Vários XML, ou um grande, e imagens dependendo de URL pública. |

## bundle — O bundle (1:55)

| # | Tempo | Narração |
|---|---|---|
| 1 | 1:55 | O Playground aceita um bundle em zip, com as imagens junto. |
| 2 | 1:59 | Montar o zip sem um gerador não compensa. |

## decisao — A decisão (2:02)

| # | Tempo | Narração |
|---|---|---|
| 1 | 2:02 | Decidi não reinventar. |
| 2 | 2:03 | Usar o exportador nativo e o importador oficial. |
| 3 | 2:07 | Acrescentar o que falta. |
| 4 | 2:08 | Assim nasceu o Eizport, antes Exporter Importer Z. |
| 5 | 2:12 | São três formatos. |
| 6 | 2:14 | XML num zip, para o importador com o Eizport. |
| 7 | 2:17 | O bundle do Playground, opcionalmente com temas e plugins. |
| 8 | 2:21 | E como plugin, que instala o necessário, importa e se exclui. |

## ia — A IA (2:25)

| # | Tempo | Narração |
|---|---|---|
| 1 | 2:25 | Utilizei Inteligência Artificial. |
| 2 | 2:28 | Comecei pelas skills oficiais do WordPress. |
| 3 | 2:30 | E criei as minhas. |
| 4 | 2:32 | A cada sessão, o aprendizado entra nas minhas skills. |

## referencias — Código de referência (2:36)

| # | Tempo | Narração |
|---|---|---|
| 1 | 2:36 | A resposta de como o WordPress faz está no código. |
| 2 | 2:39 | Minha preferência: Gutenberg e WordPress. |
| 3 | 2:42 | Também plugins da Automattic: WooCommerce e Jetpack. |

## processo — O processo (2:46)

| # | Tempo | Narração |
|---|---|---|
| 1 | 2:46 | Cada funcionalidade começa com a IA no modo de planejamento. |
| 2 | 2:50 | Aprovado, segue no modo automático. |
| 3 | 2:52 | Se algo fica para depois, entra numa lista. |
| 4 | 2:55 | Sempre Git, mesmo local, e nos commits, revisão de diretrizes, qualidade, código e testes. |

## configuracoes — Preferência vira configuração (3:02)

| # | Tempo | Narração |
|---|---|---|
| 1 | 3:02 | Possíveis preferências já nascem como configuração. |
| 2 | 3:05 | Tela de exportar moderna, com componentes do Gutenberg. |
| 3 | 3:09 | Mas pode não substituir o Exportar. |
| 4 | 3:11 | Ou substituir, com a interface clássica. |
| 5 | 3:14 | O importador também pode ser clássico. |
| 6 | 3:16 | Outras configurações disponíveis. |

## documentacao — A documentação (3:19)

| # | Tempo | Narração |
|---|---|---|
| 1 | 3:19 | A documentação faz parte do desenvolvimento. |
| 2 | 3:22 | Os screenshots do site e do readme, e o vídeo, são gerados por automatização. |
| 3 | 3:27 | Mudou uma funcionalidade ou uma tela? |
| 4 | 3:29 | Regera documentação, telas e vídeo. |
| 5 | 3:32 | Assim nada fica fragmentado nem desatualizado. |

## padroes — Os padrões (3:36)

| # | Tempo | Narração |
|---|---|---|
| 1 | 3:36 | Seguir os padrões desde o começo evita reprovação no diretório. |
| 2 | 3:40 | Os padrões de código WPCS. |
| 3 | 3:42 | E o Plugin Check Plugin, o PCP, rodando a cada mudança. |

## diretorio — O diretório (3:47)

| # | Tempo | Narração |
|---|---|---|
| 1 | 3:47 | Criei um usuário no WordPress.org, que representa o projeto. |
| 2 | 3:51 | Esse usuário precisou ser liberado, porque foi considerado empresa. |
| 3 | 3:55 | Um voluntário explicou que empresa não pode responder no fórum como pessoa. |
| 4 | 4:00 | Depois, o envio da versão 1.0.0. |
| 5 | 4:03 | Fila longa, mas foram poucas interações em poucos dias, automática e manual, e a aprovação veio na 1.0.1, liberando a URL e o SVN. |
| 6 | 4:13 | Em breve sai a 1.2.0, com Live Preview e outras funcionalidades. |
| 7 | 4:18 | Ter um plugin publicado pode ser o diferencial numa contratação. |

## traducao — A tradução (4:23)

| # | Tempo | Narração |
|---|---|---|
| 1 | 4:23 | Sempre valorizei tradução: código em inglês, pronto para traduzir. |
| 2 | 4:27 | Palestrei sobre tradução no WordCamp Porto Alegre, em 2018, disponível no WordPress.tv, mas desatualizado. |
| 3 | 4:35 | Já desenvolvi com traduções. |
| 4 | 4:37 | Ao aprovar o plugin, o readme e o código foram importados, como sugestões. |
| 5 | 4:42 | O Fellyph Cintra encontrou o plugin, talvez pela tag e pela funcionalidade do Playground, e aprovou em poucas horas. |
| 6 | 4:49 | Obrigado, Fellyph Cintra! |
| 7 | 4:51 | Um único ajuste, que eu corrigi e foi aprovado. |
| 8 | 4:54 | Paralelamente, estou na fila para ser PTE. |

## licoes — O que fica (4:58)

| # | Tempo | Narração |
|---|---|---|
| 1 | 4:58 | O que fica? |
| 2 | 4:59 | Dor que se repete é projeto esperando alguém. |
| 3 | 5:01 | Ideia aceita não é ideia usada: às vezes, retome por outro caminho. |
| 4 | 5:06 | Use o que a plataforma já oferece. |
| 5 | 5:08 | Automatize o que se repete, inclusive a documentação. |
| 6 | 5:12 | E publique: um plugin no diretório conta a sua história. |

## apoio — Apoio (5:16)

| # | Tempo | Narração |
|---|---|---|
| 1 | 5:16 | Contribua com issues no GitHub ou no fórum, e no Apoia.se, inspirado no PainelWP, obrigado Daniel Kossmann, e os outros links nos QR codes, incluindo esta apresentação. |
| 2 | 5:26 | Obrigado! |

_Duração: 5:28._
