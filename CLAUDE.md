@AGENTS.md

# Portal CNH Fácil

Site de venda de cursos para condutores (CNH). São dois repositórios, lado a lado em `~/Repositorios/`:

- **portalcnhfacil** (este): frontend em Next.js 16 + React 19 + Tailwind 4, TypeScript. Publicado na Vercel; push na `main` publica sozinho em https://www.portalcnhfacil.com
- **portalcnhfacil-backend**: API em Node + Fastify 5 + Mongoose, ES modules, em https://api.portalcnhfacil.com

Este projeto é anterior ao padrão MVC por módulo: o backend é organizado por camada (`src/routes`, `controllers`, `services`, `models`, `dtos`) e o frontend usa Tailwind. Siga o jeito que já está aqui, não migre para o padrão novo sem ele pedir.

## Frontend

- `app/lib/courses.ts`: lista **estática** dos cursos (título, preço em texto, `productId`, slug, requisitos). A coleção `courses` do banco está vazia; a fonte é este arquivo.
- `app/lib/payments.ts`: rótulo da forma de pagamento a partir do `gateway_response` (lê o formato do AbacatePay e do Mercado Pago).
- `app/cursos/[slug]/page.tsx`: página do curso; "Comprar" vai para `/pagamento?name=&price=&productId=`.
- `app/pagamento/page.tsx`: chama `POST /api/payments/checkout` e redireciona para o Mercado Pago.
- `app/dashboard/page.tsx`: painel admin (só `user.access === true`, lido do `localStorage`). Aba "Ver Compras" (só `status === 'paid'`, com total) e aba "Ver Usuários" (`app/components/Usuarios.tsx`: total, data de criação, cursos comprados de cada usuário).
- **Não existe a rota `/cursos`** (só `/cursos/[slug]`). Links de "voltar" vão para a home `/`.
- URL da API: `NEXT_PUBLIC_API_URL` no `.env`.
- Conferir mudança: `npx tsc --noEmit -p .` e `npx eslint <arquivos>`.

## Backend

- Pagamento: **Mercado Pago** (`src/routes/payment.routes.js`, desde set/2026). Antes era AbacatePay (a chave do `.env` está inativa; compras antigas têm `checkout_id` começando com `bill_`).
  - `POST /api/payments/checkout`: cria a preferência e salva um `History` com `status: 'pending'`, `checkout_id` = `external_reference` e o `user` (objeto inteiro com `_id`, vindo do `localStorage`).
  - `POST /api/payments/webhook`: busca o pagamento no MP, acha o `History` pelo `external_reference` e converte o status: approved → `paid`, rejected/cancelled → `failed`, refunded/charged_back → `refunded`, o resto → `pending`. Nunca rebaixa um `paid`.
  - `back_urls`: sucesso em `/pagamento/sucesso`; recusado ou pendente vão para a home.
- Coleção de compras: `historys` (model `History`). Status aceitos: `pending | paid | failed | refunded`.
- Compra ligada ao usuário por `history.user._id` (string); registros antigos só têm `user.email`.
- O e-mail do pagador no Mercado Pago pode ser diferente do e-mail do cadastro.
- Rotas sem autenticação (`/api/history`, `/api/users` são abertas).

## Banco e chaves

- MongoDB Atlas, banco `portalcnhfacil`; credenciais no `.env` do backend. **É o banco de produção (dados reais)**: só leitura, salvo pedido dele.
- Consultar pagamentos no MP: `GET https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc` com `MP_ACCESS_TOKEN` do `.env` do backend.
- Ele não quer trocar o token do Mercado Pago (está no histórico do servidor); não insistir nisso.

## Servidor do backend (EC2 antiga, não é a OVH)

- Acesso: `ssh -i ~/"Documents/chaves .pem/keyPortalCnhFacil/keyPortalCnhFacil.pem" ubuntu@ec2-56-125-168-60.sa-east-1.compute.amazonaws.com`
- Código em `~/projects/portalcnhfacil-backend`, rodando no **PM2** com o nome `index` (atrás de nginx).
- **Atualizar** (depois do push na `main` do backend):
  `ssh -i ~/"Documents/chaves .pem/keyPortalCnhFacil/keyPortalCnhFacil.pem" ubuntu@ec2-56-125-168-60.sa-east-1.compute.amazonaws.com ./atualizar.sh`
  O script faz `git pull`, `npm install` só se o package mudou, `pm2 restart index` e mostra os logs. Linhas de erro antigas no log (`ERR_MODULE_NOT_FOUND`, `MPForbiddenError`) são de antes; o que importa é "Conectado ao MongoDB" e "Servidor rodando na porta 4000".
- Conferir no ar: `curl -s -o /dev/null -w "%{http_code}" https://api.portalcnhfacil.com/api/history` deve dar 200.
