# erivelto

Site do corretor de imóveis Erivelto Santos (Arcane Studios). Fonte estática (HTML/CSS/JS, sem build), baseado no site `arquitetura`.

- Hero: passeio contínuo de 17 s (fachada, hall, sala, terraço), sem pessoas, feito a partir de 4 imagens geradas por IA (Figma, modelo gpt-image-2.5) e animado com ffmpeg/OpenCV. `video/hero-1080.mp4` (PC) e `video/hero-720.mp4` (celular), capa `img/hero-poster.webp`. Toca uma vez e para no terraço. A casa é ilustrativa, não é imóvel à venda (aviso no rodapé).
- WhatsApp: preencher a constante `WHATS` em `js/site.js` (ex.: `5551999999999`).
- `robots.txt` e `noindex` ativos até o cliente aprovar: remover os dois ao publicar.
- Pendências do cliente: WhatsApp, CRECI, cidade de atuação, textos/valores reais dos imóveis, domínio.
