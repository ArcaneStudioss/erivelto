# Olavo Taygoro (antigo repositório erivelto)

Site do corretor de imóveis Olavo Taygoro (Arcane Studios). Fonte estática (HTML/CSS/JS, sem build). Nasceu do layout do site do Erivelto, redesenhado do zero no visual: claro, editorial, alto padrão.

- **Paleta única:** marfim (`#F6F2EA`), champanhe (`#EFE5D2`), ônix (`#16140F`) e dourado (`#C9A24A`; texto dourado sobre claro `#83621C`, sobre escuro `#E7C981`). Tipos: Cormorant (títulos) + Jost (texto), em `fonts/`.
- **Hero:** trecho de 19 s do tour do Olavo, laço contínuo (o fim se funde com o começo), sem som, marca d'água do Instagram apagada. Anti-travamento: o JS baixa o arquivo inteiro (2,4 MB, ~1 Mbps) e só dá play da memória; em economia de dados, 2G/3G, movimento reduzido ou falha, fica a foto de capa. Pausa fora da tela e com a aba escondida.
- **Galeria:** 6 quadros do mesmo vídeo (sem quartos de criança nem banheiros, por privacidade da família).
- **WhatsApp:** preencher `WHATS` em `js/site.js` (ex.: `5521999999999`).
- **Hospedagem:** Vercel (estático, pasta raiz). Domínio proposto `olavo.arcanestudios.io` (CNAME `cname.vercel-dns.com`, proxy desligado).
- `robots.txt` (Disallow) e `noindex` ativos até o cliente aprovar: trocar ao publicar.
- **Pendências do cliente:** WhatsApp, CRECI, foto de cidade/bairros de atuação (o site diz "Rio de Janeiro" por causa da vista: confirmar), se o apartamento do vídeo está à venda e pode aparecer, prazo de resposta, perfil do Google (avaliações), ID do GA4, vídeo original sem marca d'água.
- **Repositório:** este era o `erivelto`; por decisão do Gabriel (23/10/2026) virou o site do Olavo. O site antigo do Erivelto está na branch `site-erivelto-final`.
