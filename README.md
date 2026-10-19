# Bastidores de Projetos com WordPress

Palestra de cerca de 5 minutos (ou a versão completa, de 5:10 em 1,3×), mais 5 de perguntas, em pt-BR, por Gilberto
Tavares. O foco são os bastidores: como uma dor de todo projeto (repetir no
staging os menus, as páginas, as imagens e o conteúdo montados localmente a
partir do Figma) virou um plugin no diretório oficial, e o que ficou do caminho. O Eizport é o caso, não o assunto.

Tudo sai de um arquivo, `script.yaml`: os slides avançam no ritmo da narração,
a voz é gerada pelo `say` do macOS, o Playwright grava e o ffmpeg monta o vídeo.
Mudou uma frase? Roda de novo.

Apresentada no [#06 Bastidores de projetos com WordPress](https://www.meetup.com/brasil-wordpress-meetup/events/316724634/), do WordPress Brasil Meetup Online, em 19 de outubro de 2026.

O plugin: [wordpress.org/plugins/eizport](https://wordpress.org/plugins/eizport/) · [eizport.github.io](https://eizport.github.io/) · [github.com/eizport/eizport](https://github.com/eizport/eizport).

## O que sai

| Arquivo | O quê |
|---|---|
| `build/presentation.mp4` | O vídeo narrado (1080p, cerca de 5:28; a completa, 5:10), com música de fundo que abaixa sob a voz |
| `build/presentation.srt`, `.pt-BR.vtt` | Legendas |
| `build/review.html` | O vídeo com a transcrição clicável; manda o tempo para o teleprompter |
| `build/teleprompter.html` | O teleprompter (abaixo) |
| `build/show.html` | Os slides avançando sozinhos no tempo do vídeo, com pausa, para apresentar ao vivo |
| `build/rehearsal/*.m4a` | Áudio de treino: cada cena em ritmo normal e lento, a palestra inteira e as perguntas |
| `script.md`, `script.pt-BR.md` | O roteiro para ler e a tabela por cena e frase, para pedir mudanças ("wxr 2: …") |
| `slides/*.html` | Os slides, que também servem para apresentar ao vivo |
| `PERGUNTAS.md` | Respostas curtas para os 5 minutos de perguntas |

## Rodar

```sh
npm install
npm run draft      # antes de gravar: voz, slides e roteiro para aprovação (build/review.html sem vídeo)
npm run video      # voz → gravação dos slides → música → vídeo, legendas, revisão e teleprompter
npm run rehearse   # áudio de treino
npm run preview    # um PNG por slide, no último passo (build/preview/)
npm run review     # serve build/ na rede: review.html no computador, teleprompter no celular
```

Duas versões, com as mesmas cenas, frases e slides: a **curta** (padrão,
`narration` no `script.yaml`, saída em `build/`, roteiro em `script.md`) e a
**completa** (`completa`, acelerada 1,3×, saída em `build/completa/`, roteiro em
`script.completa.md`). Para a completa, use `npm run draft:completa`,
`video:completa`, `rehearse:completa` e `review:completa`, ou `VERSAO=completa`
antes de qualquer comando.

Depois de mudar só o texto: `npm run tts && npm run record && npm run mix`.
Depois de mudar só os slides: `npm run record && npm run mix`.
Para regravar algumas cenas: `node record.mjs wxr,bundle`, depois `npm run mix`.

Requisitos: macOS (`say`, voz Luciana), ffmpeg, Node 20+ e o Google Chrome
(para tocar o vídeo no teste do teleprompter).

## O teleprompter

`build/teleprompter.html` tem dois modos (tecla **V** ou os botões na barra):

- **Livre**: rola sozinho no ritmo escolhido, em palavras por minuto, para
  ensaiar ou apresentar ao vivo. Abre direto do arquivo, sem servidor.
  Contagem de 3 s, espelhar (para vidro de teleprompter), tela cheia, tamanho da
  letra, e as barras `/` marcam onde respirar. Atalhos: Espaço, ↑↓ ritmo, +−
  letra, ←→ recuar/avançar, R início, M espelhar, F tela cheia.
- **Vídeo**: segue o vídeo do `review.html` (ou o `show.html`) e acende a frase que a voz está
  lendo. Na mesma máquina, abra o teleprompter pelo botão do `review.html`. No
  celular, rode `npm run review` e abra no celular o endereço
  `/teleprompter.html` que ele mostra.

A versão **Perguntas** mostra as respostas do `PERGUNTAS.md` e conta 5 minutos
para trás.

## Apresentar ao vivo

**Sozinho, no ritmo da narração:** rode `npm run review` e abra no computador
`http://localhost:8765/show.html` (ou o botão "Apresentar os slides" do
`review.html`). Os slides avançam com os mesmos tempos do vídeo, sem som, e o
teleprompter do celular, no modo **Vídeo**, acende a frase da vez. Espaço (ou um
clique) pausa e continua, para responder a uma pergunta no meio; → e ← pulam um
passo, Home volta ao início, F põe em tela cheia. O teleprompter pausa junto.

**À mão:** abra `slides/title.html` em tela cheia. → ou espaço avança um passo, ←
volta, PageDown/PageUp troca de slide e Esc abre a lista. O último slide,
`perguntas.html`, fica na tela durante as perguntas, com os QR codes.

## Como funciona

| Arquivo | Faz |
|---|---|
| `script.yaml` | Cenas: título, narração (frases curtas) e ações (`slide`, `step`, `pause`; `cue: N` dispara na frase N). `pronuncia` corrige só o que a voz lê. |
| `lib.mjs` | Lê o roteiro, divide as frases e aplica a pronúncia |
| `tts.mjs` | Uma frase por vez no `say`, com o início de cada uma (`build/durations.json`) |
| `record.mjs` | Abre os slides no Playwright e grava por screencast, cada cena com o tempo da sua narração |
| `music.mjs`, `mix.mjs` | Música gerada pelo ffmpeg, voz e vídeo juntos, legendas |
| `review.mjs`, `teleprompter.mjs` | Página de revisão, transcrição e teleprompter (`teleprompter/modelo.html`) |
| `rehearse.mjs` | Áudio de treino |
| `qr.mjs` | Os QR codes do slide de perguntas, gerados aqui |

## Identidade

Só a marca e o design system do WordPress.org: a paleta do tema
`wporg-parent-2021` (Charcoal, Light Grey, Blueberry; Pomegranate, Acid Green e
Lemon nos detalhes), títulos em EB Garamond, texto em Inter, código em IBM Plex
Mono, cantos de 2 px. As fontes vêm em `slides/fonts/`, sob a SIL Open Font
License.

O pipeline (voz, gravação, mixagem e revisão) veio de uma apresentação anterior
sobre Web Vitals; o teleprompter, do vídeo de voluntários do WordCamp Brasil 2026.
