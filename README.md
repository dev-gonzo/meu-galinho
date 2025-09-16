# 🐔 Meu Galinho

Jogo desenvolvido com Angular 20 e Phaser.js onde você pode cuidar e controlar seu galinho virtual.

## 🚀 Tecnologias Utilizadas

- **Angular 20** - Framework principal
- **Phaser.js 3.80** - Engine de jogos 2D
- **TypeScript** - Linguagem de programação
- **SCSS** - Pré-processador CSS

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── features/          # Features organizadas por domínio
│   │   └── game/          # Feature do jogo
│   │       ├── pages/     # Páginas da feature
│   │       └── game.routes.ts
│   ├── layouts/           # Layouts da aplicação
│   │   └── layout-main/
│   ├── app.component.ts   # Componente raiz
│   └── app.routes.ts      # Rotas principais
├── styles.scss            # Estilos globais
├── main.ts               # Bootstrap da aplicação
└── index.html            # HTML principal
```

## 🎮 Como Jogar

1. Use as **setas do teclado** para mover o galinho
2. O galinho não pode sair da tela
3. Divirta-se cuidando do seu galinho virtual!

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo de desenvolvimento:**
   ```bash
   npm start
   ```

3. **Abrir no navegador:**
   ```
   http://localhost:4200
   ```

### Outros comandos úteis

- **Build para produção:**
  ```bash
  npm run build
  ```

- **Executar testes:**
  ```bash
  npm test
  ```

- **Lint do código:**
  ```bash
  npm run lint
  ```

## 🎯 Funcionalidades Implementadas

- ✅ Estrutura base do projeto Angular 20
- ✅ Integração com Phaser.js
- ✅ Galinho controlável com teclado
- ✅ Layout responsivo
- ✅ Organização por features

## 🔄 Próximas Funcionalidades

- [ ] Sistema de alimentação do galinho
- [ ] Sistema de felicidade/humor
- [ ] Animações do galinho
- [ ] Sons e efeitos sonoros
- [ ] Sistema de save/load
- [ ] Diferentes cenários

## 📝 Padrões do Projeto

Este projeto segue os padrões estabelecidos:

- **Features organizadas por domínio** na pasta `features/`
- **Componentes standalone** do Angular
- **Lazy loading** das rotas
- **Layouts reutilizáveis**
- **Estrutura escalável**

---

**Desenvolvido com ❤️ usando Angular 20 e Phaser.js**