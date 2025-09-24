# Cardbinder - Jogo de Cartas para Aprender Inglês

Um jogo interativo de cartas para praticar vocabulário de inglês em diferentes níveis (A1 a C1).

## 🚀 Tecnologias Usadas

-  **HTML5** - Estrutura semântica
-  **Tailwind CSS** - Framework de CSS utilitário
-  **JavaScript** - Lógica do jogo
-  **PostCSS** - Processamento do CSS
-  **NPM** - Gerenciamento de dependências

## 📁 Estrutura do Projeto

```
cardbinder/
├── src/                    # Arquivos fonte
│   ├── css/               # Arquivos de estilo
│   │   ├── input.css      # CSS principal com @tailwind
│   │   └── custom.css     # Estilos customizados
│   ├── js/                # Arquivos JavaScript
│   │   ├── gameData.js    # Dados e configurações do jogo
│   │   └── gameLogic.js   # Lógicas de interação
│   └── view/              # Arquivos de visualização
│       └── index.html     # HTML principal do jogo
├── dist/                  # Arquivos de build
│   └── styles.css         # CSS processado e minificado
├── tailwind.config.js     # Configuração do Tailwind
├── postcss.config.js      # Configuração do PostCSS
└── package.json           # Dependências e scripts
```

## 🛠️ Instalação e Configuração

1. **Instalar dependências:**

   ```bash
   npm install
   ```

2. **Build do CSS:**

   ```bash
   npm run build:css
   ```

3. **Desenvolvimento com watch:**

   ```bash
   npm run dev
   ```

4. **Build completo:**
   ```bash
   npm run build
   ```

## 🎮 Como Jogar

1. Abra o arquivo `dist/index.html` no navegador
2. Selecione seu nível de inglês (A1 a C1)
3. Arraste cartas da "Mão" para "Segurando" para formar combinações
4. Use os botões "Rolar" para trocar cartas não seguradas
5. Clique "Enviar" quando estiver satisfeito com sua mão
6. Complete objetivos para ganhar pontos!

## ⚙️ Scripts Disponíveis

-  `npm run dev` - Inicia desenvolvimento com watch de CSS e servidor local
-  `npm run build` - Build completo do projeto
-  `npm run build:css` - Constrói apenas o CSS
-  `npm run watch:css` - Watch mode para CSS
-  `npm start` - Build e inicia servidor local
-  `npm run serve` - Apenas inicia o servidor (sem build)

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev

# Abrir no navegador
# http://localhost:3000
```

## 🎨 Customização do Tailwind

O arquivo `tailwind.config.js` contém:

-  **Cores do jogo** - Paleta customizada com prefixo `game-`
-  **Gradientes** - Backgrounds personalizados do jogo
-  **Sombras** - Efeitos visuais específicos
-  **Animações** - Animação `deal-in` para as cartas
-  **Fontes** - Configuração da fonte Inter

## 🔧 Personalização

### Adicionar Novas Palavras

Edite o arquivo `src/js/gameData.js` na constante `WORDS`:

```javascript
const WORDS = [
   { w: 'nova-palavra', pos: 'noun', lvl: 'A1' },
   // ...
]
```

### Modificar Objetivos

Edite a constante `OBJECTIVES` em `src/js/gameData.js`.

### Estilos Customizados

Adicione estilos que não podem ser feitos com Tailwind em `src/css/custom.css`.

## 📝 Arquitetura do Código

### gameData.js

-  **WORDS** - Base de dados das palavras
-  **POS_LABEL** - Labels das classes gramaticais
-  **OBJECTIVES** - Definição dos objetivos do jogo
-  **GAME_CONFIG** - Configurações gerais

### gameLogic.js

-  **Estado do jogo** - Variáveis de controle
-  **Funções auxiliares** - Utilitários para cálculos
-  **Renderização** - Funções de interface
-  **Fluxo do jogo** - Lógica das rodadas
-  **Eventos** - Interações do usuário

## 🌐 Suporte a Navegadores

-  Chrome/Edge 90+
-  Firefox 90+
-  Safari 14+

## 📄 Licença

MIT - Veja o arquivo LICENSE para detalhes.
