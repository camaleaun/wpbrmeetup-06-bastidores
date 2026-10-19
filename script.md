# Bastidores de Projetos com WordPress

_Narração da palestra, gerada a partir de script.yaml._

## Abertura

Olá! Sou Gilberto Tavares, desenvolvedor WordPress desde 2012. Estes são os bastidores de como uma dor que se repete virou um plugin no diretório oficial. Meu primeiro plugin no diretório é o caso, não o assunto.

## A agência

Desde julho de 2025, trabalho numa agência americana de e-commerce. A maioria dos projetos é Adobe Commerce, o Magento 2. Também WordPress/WooCommerce e outros.

## O parceiro

O WordPress vem de um parceiro que integra ERPs ao WooCommerce. O layout fica com a gente, às vezes com o Figma. Os anteriores eram Elementor. O recente usa um tema performático, híbrido de blocos e clássico.

## A dupla

Somos dois desenvolvedores WordPress/WooCommerce. Ele, primariamente Magento. E eu, esse ano treinado na agência como o primeiro Shopware.

## O problema

Qual é o problema? O layout nasce no Figma. No ambiente local, criamos menus, páginas, imagens e conteúdo. Tudo isso precisa se repetir no staging ou em outro ambiente local. Cliente, colega e gerente revisam visualmente. Na prática, tudo é remontado.

## Versionar o conteúdo

Queria versionar o conteúdo. Como o WooCommerce. Ou como migrations. Mas acoplar conteúdo ao código parecia drástico. Separar era o caminho.

## A primeira tentativa

Sugeri migrations e patches, e foi bem aceito. O gerente vem do Magento, onde isso é natural. Foi aceito o modelo JSON do Playground. O colega liderou, alterando um pouco. Até hoje, sem uso efetivo. Também houve a questão de armazenar mídia sem inflar o Git.

## As limitações do WXR

Nessa nova solução, segui o exportador e o importador nativos. Limitações conhecidas. Exportar uma página leva todas. O contorno é apagar as outras no local. A mídia é outra exportação, sem juntar páginas e anexos. Vários XML, ou um grande, e imagens dependendo de URL pública.

## O bundle

O Playground aceita um bundle em zip, com as imagens junto. Montar o zip sem um gerador não compensa.

## A decisão

Decidi não reinventar. Usar o exportador nativo e o importador oficial. Acrescentar o que falta. Assim nasceu o Eizport, antes Exporter Importer Z. São três formatos. XML num zip, para o importador com o Eizport. O bundle do Playground, opcionalmente com temas e plugins. E como plugin, que instala o necessário, importa e se exclui.

## A IA

Utilizei Inteligência Artificial. Comecei pelas skills oficiais do WordPress. E criei as minhas. A cada sessão, o aprendizado entra nas minhas skills.

## Código de referência

A resposta de como o WordPress faz está no código. Minha preferência: Gutenberg e WordPress. Também plugins da Automattic: WooCommerce e Jetpack.

## O processo

Cada funcionalidade começa com a IA no modo de planejamento. Aprovado, segue no modo automático. Se algo fica para depois, entra numa lista. Sempre Git, mesmo local, e nos commits, revisão de diretrizes, qualidade, código e testes.

## Preferência vira configuração

Possíveis preferências já nascem como configuração. Tela de exportar moderna, com componentes do Gutenberg. Mas pode não substituir o Exportar. Ou substituir, com a interface clássica. O importador também pode ser clássico. Outras configurações disponíveis.

## A documentação

A documentação faz parte do desenvolvimento. Os screenshots do site e do readme, e o vídeo, são gerados por automatização. Mudou uma funcionalidade ou uma tela? Regera documentação, telas e vídeo. Assim nada fica fragmentado nem desatualizado.

## Os padrões

Seguir os padrões desde o começo evita reprovação no diretório. Os padrões de código WPCS. E o Plugin Check Plugin, o PCP, rodando a cada mudança.

## O diretório

Criei um usuário no WordPress.org, que representa o projeto. Esse usuário precisou ser liberado, porque foi considerado empresa. Um voluntário explicou que empresa não pode responder no fórum como pessoa. Depois, o envio da versão 1.0.0. Fila longa, mas foram poucas interações em poucos dias, automática e manual, e a aprovação veio na 1.0.1, liberando a URL e o SVN. Em breve sai a 1.2.0, com Live Preview e outras funcionalidades. Ter um plugin publicado pode ser o diferencial numa contratação.

## A tradução

Sempre valorizei tradução: código em inglês, pronto para traduzir. Palestrei sobre tradução no WordCamp Porto Alegre, em 2018, disponível no WordPress.tv, mas desatualizado. Já desenvolvi com traduções. Ao aprovar o plugin, o readme e o código foram importados, como sugestões. O Fellyph Cintra encontrou o plugin, talvez pela tag e pela funcionalidade do Playground, e aprovou em poucas horas. Obrigado, Fellyph Cintra! Um único ajuste, que eu corrigi e foi aprovado. Paralelamente, estou na fila para ser PTE.

## O que fica

O que fica? Dor que se repete é projeto esperando alguém. Ideia aceita não é ideia usada: às vezes, retome por outro caminho. Use o que a plataforma já oferece. Automatize o que se repete, inclusive a documentação. E publique: um plugin no diretório conta a sua história.

## Apoio

Contribua com issues no GitHub ou no fórum, e no Apoia.se, inspirado no PainelWP, obrigado Daniel Kossmann, e os outros links nos QR codes, incluindo esta apresentação. Obrigado!
