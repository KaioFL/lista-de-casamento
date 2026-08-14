# 🚀 Guia de Implantação e Entrega (Deploy Gratuito)

Este guia contém as instruções passo a passo para você publicar este site de casamento na **Vercel** de forma 100% gratuita para o seu amigo utilizar.

---

## 📋 Pré-requisitos

1. Uma conta gratuita no **GitHub** (onde o código fonte será hospedado).
2. Uma conta gratuita na **Vercel** ([vercel.com](https://vercel.com)).
3. O projeto **Supabase** (já configurado no ID `zyxjbbvusnqnhnxbdhac`).

---

## 🛠️ Passo 1: Subir o projeto para o GitHub

Se o projeto ainda não estiver em um repositório no seu GitHub, siga os passos no terminal:

```bash
git add .
git commit -m "feat: versão final pronta para entregar"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/nome-do-repositorio.git
git push -u origin main
```

---

## ⚡ Passo 2: Importar e Configurar na Vercel

1. Acesse o painel da **[Vercel](https://vercel.com)** e clique em **"Add New..." -> "Project"**.
2. Selecione o repositório do GitHub importado.
3. Na seção **Environment Variables** (Variáveis de Ambiente), adicione as seguintes variáveis (você pode copiar os valores do arquivo `.env.local`):

| Variável | Descrição |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL pública do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave Publishable (segura para o browser) |
| `SUPABASE_SECRET_KEY` | Chave Secreta do Supabase (somente servidor) |

4. Clique em **Deploy**. A Vercel construirá o projeto e fornecerá um link gratuito (ex: `https://nosso-casamento.vercel.app`).

---

## 🔑 Passo 3: Configurar os Redirecionamentos no Supabase

1. Acesse o painel do seu projeto no **Supabase** ([supabase.com](https://supabase.com)).
2. Vá em **Authentication -> URL Configuration**.
3. Em **Site URL**, coloque o link oficial gerado pela Vercel (ex: `https://nosso-casamento.vercel.app`).
4. Em **Redirect URLs**, adicione:
   - `https://nosso-casamento.vercel.app/**`
   - `http://localhost:3000/**` (para desenvolvimento local)

---

## 🌐 Passo 4: Domínio Personalizado (Opcional)

Se o casal comprou um domínio próprio (ex: `marianaefelipe.com.br`):

1. No painel do projeto na Vercel, vá em **Settings -> Domains**.
2. Digite o domínio desejado e siga as instruções para apontar o DNS (apenas criar os registros CNAME/A no seu registrador de domínio como Registro.br ou GoDaddy).
3. Atualize o **Site URL** no Supabase para o novo domínio.

---

## 🎁 Como Entregar para o seu Amigo

1. **Criar a conta do casal:** Acesse o link implantado (ex: `/cadastro`) e crie a conta de acesso para os noivos.
2. **Entrar no Painel:** O casal entrará automaticamente no painel (`/painel`), onde poderá:
   - Personalizar a capa, nomes, data, local e história na aba **Configurações**.
   - Inserir a **Chave PIX** para receber presentes financeiros sem taxas.
   - Adicionar ou ordenar as sugestões de presentes na aba **Presentes**.
   - Publicar a página e clicar em **Compartilhar Convite** para enviar o link no WhatsApp ou baixar o **QR Code** para o convite impresso!
