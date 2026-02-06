# 📖 Leitor Bíblico Web

Um leitor da Bíblia moderno, elegante e **100% offline**. Construído com React e usando a tradução **Nova Versão Internacional (NVI)**.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Offline](https://img.shields.io/badge/offline-100%25-success)

## ✨ Funcionalidades

- 📚 **Bíblia Completa**: Todos os 66 livros em português (NVI)
- 🔍 **Busca Instantânea**: Pesquise versículos em toda a Bíblia
- ❤️ **Favoritos**: Salve versículos para acesso rápido
- 🌙 **Tema Escuro**: Design elegante em modo escuro
- 📱 **Responsivo**: Funciona em desktop, tablet e celular
- 💾 **100% Offline**: Funciona sem conexão com internet
- 🎯 **Versículo do Dia**: Inspiração diária ao abrir o app
- ⚙️ **Ajuste de Fonte**: Personalize o tamanho do texto

## 🚀 Como Usar

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Acesse http://localhost:5173
```

### Build para Produção

```bash
# Gerar build otimizado
npm run build

# Testar build localmente
npm run preview
```

## 🛠️ Tecnologias

- **React 19** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS 4** - Estilização
- **React Router** - Navegação
- **Lucide React** - Ícones
- **LocalStorage** - Persistência de favoritos

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── books/          # Lista de livros
│   ├── layout/         # Header, Footer
│   ├── reader/         # Leitor de capítulos
│   └── ui/             # Componentes reutilizáveis
├── context/
│   ├── BibleContext    # Estado global da Bíblia
│   └── FavoritesContext# Gerenciamento de favoritos
├── data/
│   └── nvi.json        # Bíblia NVI completa (4MB)
├── pages/              # Páginas da aplicação
├── services/
│   └── bibleService.js # Serviço local da Bíblia
├── App.jsx             # Componente raiz
├── index.css           # Estilos globais
└── main.jsx            # Entry point
```

## 📖 Fonte dos Dados

Os textos bíblicos são da **Nova Versão Internacional (NVI)** em português, obtidos do repositório [thiagobodruk/bible](https://github.com/thiagobodruk/bible).

## 🎨 Design

- **Tema**: Modo escuro com tons dourados
- **Tipografia**: 
  - `Inter` para interface
  - `Merriweather` para leitura bíblica
- **Estilo**: Glassmorphism, gradientes sutis, animações suaves

## 📱 Screenshots

### Página Inicial
- Versículo do dia com destaque
- Lista de livros organizada por testamento

### Leitor
- Texto em fonte serifada para melhor leitura
- Botão de favoritar ao passar o mouse
- Navegação entre capítulos
- Ajuste de tamanho de fonte

### Favoritos
- Lista de versículos salvos
- Link direto para o capítulo
- Opção de limpar todos

## 🔧 Configuração

### Personalização de Cores

Edite as variáveis CSS em `src/index.css`:

```css
:root {
  --color-primary: #c9a227;     /* Cor principal (dourado) */
  --color-background: #0a0a0b;  /* Fundo */
  --color-surface: #141416;     /* Cards */
  --color-text: #f5f4f1;        /* Texto */
}
```

## 📄 Licença

Este projeto está sob a licença MIT. Os textos bíblicos são propriedade dos seus respectivos detentores de direitos autorais.

---

Feito com ❤️ e ☕
