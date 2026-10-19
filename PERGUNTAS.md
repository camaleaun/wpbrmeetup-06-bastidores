# Perguntas (5 minutos depois da palestra)

Respostas curtas, de 30 a 45 segundos cada, com fatos verificados nas notas do
projeto. O teleprompter (versão "Perguntas") e o áudio de treino
(`npm run rehearse`) usam este arquivo. Cada `##` é uma pergunta e o parágrafo
abaixo dela é a resposta.

Se a pergunta não estiver aqui, a resposta honesta vale mais do que um palpite:
"não testei isso ainda; abre uma issue que eu olho".

## Por que não usar o All-in-One WP Migration ou o Duplicator?

Eles migram o site inteiro, e fazem isso bem. O caso aqui é outro: levar só uma parte, as páginas de exemplo, o conteúdo e as imagens de uma entrega, para um site que já existe. E com o importador oficial do WordPress, sem trocar de ferramenta.

## E a ferramenta interna da agência, o que aconteceu com ela?

As ideias foram aceitas: migrations, patches e blueprints em JSON. O colega que liderou integrou ao pipeline de deploy, e até hoje ela ainda não teve uso efetivo. Por isso, no projeto novo, eu tentei outro caminho: o exportador e o importador que o WordPress já tem. Uma coisa não substitui a outra.

## Funciona com WooCommerce?

Funciona, com suporte próprio: produtos, pedidos, cupons, as páginas da loja, as galerias e as avaliações. Advanced Custom Fields e Elementor ainda não foram testados oficialmente; os dados vão, mas os IDs dentro deles ainda não são remapeados.

## Tem limite de tamanho?

O envio respeita o limite de upload do PHP do servidor. Depois de aberto, um pacote pode ter até 512 MB por padrão, e um filtro muda esse valor.

## Funciona em multisite?

Ainda não testei em multisite. Se esse é o seu caso, abre uma issue no GitHub, com o cenário, que ele entra no backlog.

## O que costuma reprovar um plugin na revisão?

Os quatro pontos que eu recebi são os clássicos: scripts e estilos fora do wp_enqueue, falta de nonce e de checagem de permissão, um serviço externo não documentado no readme e sanitização faltando no register_setting. Fora isso: nome com marca de terceiros, licença que não é GPL e código ofuscado.

## A aprovação no diretório foi difícil?

Foi mais simples do que eu esperava. Primeiro, liberar o usuário do projeto. Depois, mesmo com a fila longa, foram poucas interações de correção, automática e manual, até liberar a URL e o SVN. Quem segue os padrões e roda o Plugin Check antes de enviar chega com quase tudo resolvido. Enviei a 1.0.0, a aprovada foi a 1.0.1, e a 1.2.0 vem com Live Preview.

## Como funcionou a tradução no translate.wordpress.org?

Com o plugin aprovado, o readme e o código foram importados como sugestões. Sem eu pedir, o Fellyph Cintra encontrou o plugin e aprovou as sugestões em poucas horas; só um fuzzy precisou de ajuste. Para aprovar eu mesmo as próximas, publiquei o pedido de PTE no blog do time de Polyglots, e ele está na fila.

## Quanto do código a IA escreveu?

Muito. Mas nada entra sem passar por mim e pelas mesmas checagens de sempre: lint, testes e Plugin Check antes de cada commit. A IA acelera; a responsabilidade continua sendo minha.

## Como as skills aprendem?

Ao fim de cada sessão, o que deu errado ou deu certo vira uma regra escrita na skill: um erro de tradução que vira fuzzy, um detalhe de bloco, um passo do Studio. Na próxima sessão, a IA já começa sabendo.

## Por que os blueprints do Playground?

Porque um blueprint descreve um site em passos repetíveis: instalar plugins, ativar o tema, importar conteúdo. Roda no navegador ou no terminal, sem servidor. Foi o que me fez pensar em pacotes que levam tudo junto.

## Como contribuir?

Issues no GitHub e tópicos no fórum do WordPress.org: cada pedido vira um item do backlog, com o porquê. E o site do plugin tem um Apoia.se, em apoia.se/eizport, inspirado no do PainelWP, do Daniel Kossmann.

## O que é o arquivo "como plugin"?

Um zip de plugin com o pacote dentro. No outro site, você instala como qualquer plugin e abre a tela dele em Ferramentas: ele confere se o Eizport e o WordPress Importer estão lá, importa com um clique e, no fim, se exclui.

## Por que tanta opção?

Porque cada equipe trabalha de um jeito. Quem gosta das telas novas do painel tem a interface moderna; quem prefere o Exportar de sempre mantém o original ou volta à tela clássica, com as mesmas escolhas a mais. Se algo podia ser uma preferência, virou configuração desde o começo.

## Por que não colocar o conteúdo no código, com migrations?

Era o que eu queria no começo, como as rotinas de atualização do WooCommerce ou as migrations dos frameworks PHP. Mas o conteúdo passaria pela mesma revisão do código, e as imagens fariam o repositório crescer. Separar o conteúdo num pacote resolve as duas coisas.

## E o Elementor ou o tema pai híbrido?

Os projetos antigos eram em Elementor; o mais recente usa um tema pai próprio do parceiro, híbrido de blocos e clássico. O pacote leva as páginas e os metadados delas; o que depende de IDs dentro de construtores como o Elementor ainda não é remapeado e está no backlog.

## Um plugin publicado ajuda a ser contratado?

Em alguns processos seletivos, pode ser o diferencial. Mostra que você conhece os padrões, passou por uma revisão de verdade e mantém algo público, com código, tradução e suporte.
