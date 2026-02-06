# 📱 Como Transformar em App para iOS (e Android)

Este guia vai te ensinar a configurar o app para você e sua namorada usarem no celular com sincronização de favoritos.

---

## 🚀 Passo 1: Configurar o Supabase (Banco de Dados Gratuito)

### 1.1 Criar conta no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project" e faça login com GitHub ou email
3. Clique em "New Project"
4. Escolha um nome (ex: "biblia-casal")
5. Defina uma senha para o banco de dados (guarde essa senha!)
6. Escolha a região mais próxima (South America - São Paulo)
7. Clique em "Create new project" e aguarde ~2 minutos

### 1.2 Criar as tabelas do banco de dados
1. No painel do Supabase, clique em "SQL Editor" no menu lateral
2. Clique em "New Query"
3. Copie TODO o conteúdo do arquivo `supabase-schema.sql` que está na pasta do projeto
4. Cole no editor SQL e clique em "Run"
5. Deve aparecer "Success. No rows returned" - isso é normal!

### 1.3 Pegar as credenciais
1. No menu lateral, clique em "Project Settings" (ícone de engrenagem)
2. Clique em "API" no submenu
3. Copie a "Project URL" (algo como `https://xxxxx.supabase.co`)
4. Copie a "anon public" key (a chave longa)

### 1.4 Configurar no projeto
1. Na pasta do projeto, crie um arquivo chamado `.env` (sem extensão)
2. Cole o seguinte conteúdo:

```
VITE_SUPABASE_URL=https://sua-url-aqui.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

3. Substitua pelos valores que você copiou
4. Salve o arquivo

---

## 🌐 Passo 2: Publicar o Site Online (Vercel)

Para vocês acessarem do celular, o site precisa estar na internet.

### 2.1 Subir para o GitHub
1. Crie uma conta no [GitHub](https://github.com) se não tiver
2. Crie um novo repositório (ex: "nossa-biblia")
3. No terminal, na pasta do projeto, execute:

```bash
git init
git add .
git commit -m "Primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/nossa-biblia.git
git push -u origin main
```

### 2.2 Conectar ao Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em "Add New..." → "Project"
3. Selecione o repositório "nossa-biblia"
4. **IMPORTANTE**: Clique em "Environment Variables"
5. Adicione:
   - `VITE_SUPABASE_URL` = (cole a URL do Supabase)
   - `VITE_SUPABASE_ANON_KEY` = (cole a chave anon)
6. Clique em "Deploy"
7. Aguarde o deploy terminar (~1-2 minutos)
8. Você receberá um link como `nossa-biblia.vercel.app`

---

## 📲 Passo 3: Instalar como App no iPhone

### No iPhone de vocês dois:
1. Abra o Safari (tem que ser Safari!)
2. Acesse o link do Vercel (ex: `nossa-biblia.vercel.app`)
3. Toque no ícone de compartilhar (quadrado com seta para cima)
4. Role para baixo e toque em "Adicionar à Tela de Início"
5. Dê um nome ao app (ex: "Bíblia 💕") e confirme

Pronto! O app agora aparece na tela inicial como um app normal!

---

## 💕 Passo 4: Conectar Vocês Dois

### Pessoa 1 (quem vai criar o código):
1. Abra o app
2. Vá em "Favoritos"
3. Na seção "Sincronização em Casal", clique em "✨ Criar Novo Código"
4. Digite seu nome (ex: "João")
5. Um código de 6 letras será gerado (ex: "ABC123")
6. Compartilhe esse código com sua namorada!

### Pessoa 2 (quem vai entrar):
1. Abra o app no celular dela
2. Vá em "Favoritos"
3. Clique em "🔗 Entrar com Código"
4. Digite o nome dela (ex: "Maria")
5. Digite o código que você compartilhou
6. Clique em "Conectar"

Pronto! Agora quando um favoritar um versículo, aparece no celular do outro em tempo real! 🎉

---

## 🔧 Solução de Problemas

### O código não funciona?
- Verifique se as credenciais do Supabase estão corretas no `.env`
- Verifique se executou o SQL para criar as tabelas
- O código é case-insensitive (ABC123 = abc123)

### Favoritos não sincronizam?
- Verifique se ambos estão com internet
- Tente clicar em "🔄 Atualizar" na seção de sincronização
- Verifique se os dois estão usando o mesmo código

### App não instala no iPhone?
- Só funciona pelo Safari!
- Certifique-se de estar no site publicado (não localhost)

---

## 📁 Arquivos Importantes Criados

- `public/manifest.json` - Configuração do PWA
- `public/sw.js` - Service Worker para cache offline
- `src/services/supabaseClient.js` - Cliente do banco de dados
- `src/components/sync/CoupleSync.jsx` - Componente de sincronização
- `supabase-schema.sql` - Script SQL para criar tabelas
- `.env.example` - Exemplo de variáveis de ambiente

---

## ❤️ Dica Final

Você pode escolher versículos especiais para vocês dois! O nome de quem favoritou aparece ao lado do versículo, então vocês podem se surpreender um ao outro com versículos significativos!

Bom uso do app! Que a Palavra de Deus fortaleça o relacionamento de vocês! 🙏
